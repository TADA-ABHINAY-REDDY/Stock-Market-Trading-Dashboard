import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import type { ChartData } from '../types/stock';

interface Props {
  data: ChartData[];
  symbol: string;
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    wickUpColor?: string;
    wickDownColor?: string;
    borderUpColor?: string;
    borderDownColor?: string;
  };
}

export function StockChart({ data, symbol, colors = {} }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();
  const seriesRef = useRef<ISeriesApi<"Candlestick">>();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor || '#1B2028' },
        textColor: colors.textColor || '#DDD',
      },
      grid: {
        vertLines: { color: '#2B3139' },
        horzLines: { color: '#2B3139' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: colors.borderUpColor || '#26a69a',
      borderDownColor: colors.borderDownColor || '#ef5350',
      wickUpColor: colors.wickUpColor || '#26a69a',
      wickDownColor: colors.wickDownColor || '#ef5350',
    });

    // Set initial data
    candlestickSeries.setData(data);

    // Store references
    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      if (!seriesRef.current) return;

      const lastCandle = data[data.length - 1];
      const currentTime = Date.now();

      // Generate new price data
      const movement = (Math.random() - 0.5) * 2; // Random price movement
      const newClose = lastCandle.close + movement;
      const newHigh = Math.max(lastCandle.high, newClose);
      const newLow = Math.min(lastCandle.low, newClose);

      // Update the last candle
      const updatedCandle: CandlestickData = {
        time: lastCandle.time as number,
        open: lastCandle.open,
        high: newHigh,
        low: newLow,
        close: newClose,
      };

      // Add new candle if a minute has passed
      if (currentTime - lastCandle.time > 60000) {
        const newCandle: CandlestickData = {
          time: currentTime,
          open: lastCandle.close,
          high: lastCandle.close + Math.abs(movement),
          low: lastCandle.close - Math.abs(movement),
          close: newClose,
        };
        data.push(newCandle);
        seriesRef.current.update(newCandle);
      } else {
        seriesRef.current.update(updatedCandle);
      }
    }, 1000); // Update every second

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(updateInterval);
      chart.remove();
    };
  }, [data, colors, symbol]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{symbol} Price Chart</h2>
        <div className="text-sm text-gray-400">Live Updates</div>
      </div>
      <div ref={chartContainerRef} />
    </div>
  );
}
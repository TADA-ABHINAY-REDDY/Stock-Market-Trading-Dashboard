import React, { useState, useEffect } from 'react';
import { StockChart } from './components/StockChart';
import { StockList } from './components/StockList';
import { TradingPanel } from './components/TradingPanel';
import { Portfolio } from './components/Portfolio';
import { ProfileSection } from './components/ProfileSection';
import type { Asset, Portfolio as PortfolioType, ChartData } from './types/stock';

// Demo assets including both stocks and crypto
const demoAssets: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 52000.50, change: 1200.5, changePercent: 2.3, volume: 28000000000, type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 2800.75, change: 45.2, changePercent: 1.6, volume: 15000000000, type: 'crypto' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 167.50, change: 2.5, changePercent: 1.5, volume: 1000000, type: 'stock' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 134.20, change: -1.2, changePercent: -0.9, volume: 800000, type: 'stock' },
];

// Generate initial candlestick data
const generateChartData = (basePrice: number): ChartData[] => {
  const data: ChartData[] = [];
  let currentPrice = basePrice;
  const now = Date.now();
  
  for (let i = 100; i > 0; i--) {
    const time = now - i * 60000; // One minute intervals
    const movement = (Math.random() - 0.5) * (basePrice * 0.02); // 2% max movement
    const open = currentPrice;
    const close = currentPrice + movement;
    const high = Math.max(open, close) + Math.random() * Math.abs(movement);
    const low = Math.min(open, close) - Math.random() * Math.abs(movement);
    
    currentPrice = close;
    data.push({ time, open, high, low, close });
  }
  
  return data;
};

function App() {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(demoAssets[0]);
  const [chartData, setChartData] = useState<ChartData[]>(() => 
    generateChartData(selectedAsset.price)
  );
  const [portfolio, setPortfolio] = useState<PortfolioType>({
    balance: 100000,
    positions: [],
  });

  // Update chart data when selected asset changes
  useEffect(() => {
    setChartData(generateChartData(selectedAsset.price));
  }, [selectedAsset.symbol]);

  const handleTrade = (type: 'buy' | 'sell', amount: number) => {
    const cost = amount * selectedAsset.price;
    
    setPortfolio(current => {
      if (type === 'buy' && cost > current.balance) {
        alert('Insufficient funds for this trade');
        return current;
      }

      const existingPosition = current.positions.find(p => p.symbol === selectedAsset.symbol);
      
      if (type === 'sell' && (!existingPosition || existingPosition.amount < amount)) {
        alert('Insufficient assets for this trade');
        return current;
      }

      let newPositions = [...current.positions];
      
      if (type === 'buy') {
        if (existingPosition) {
          newPositions = newPositions.map(p => 
            p.symbol === selectedAsset.symbol
              ? {
                  ...p,
                  amount: p.amount + amount,
                  averagePrice: (p.averagePrice * p.amount + cost) / (p.amount + amount),
                }
              : p
          );
        } else {
          newPositions.push({
            symbol: selectedAsset.symbol,
            amount,
            averagePrice: selectedAsset.price,
            type: selectedAsset.type,
          });
        }
      } else {
        newPositions = newPositions.map(p => 
          p.symbol === selectedAsset.symbol
            ? { ...p, amount: p.amount - amount }
            : p
        ).filter(p => p.amount > 0);
      }

      return {
        balance: type === 'buy' 
          ? current.balance - cost
          : current.balance + cost,
        positions: newPositions,
      };
    });
  };

  const currentPrices = demoAssets.reduce((acc, asset) => ({
    ...acc,
    [asset.symbol]: asset.price,
  }), {});

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Crypto & Stock Trading Dashboard</h1>
          <ProfileSection 
            balance={portfolio.balance} 
            positions={portfolio.positions.length} 
          />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <StockChart
                data={chartData}
                symbol={selectedAsset.symbol}
                colors={{
                  backgroundColor: '#111827',
                  textColor: '#9CA3AF',
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TradingPanel stock={selectedAsset} onTrade={handleTrade} />
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Market Overview</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Volume</span>
                    <span className="font-medium">${selectedAsset.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <span className={`font-medium ${selectedAsset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <StockList 
              stocks={demoAssets} 
              onSelect={(symbol) => {
                const asset = demoAssets.find(s => s.symbol === symbol);
                if (asset) setSelectedAsset(asset);
              }} 
            />
            <Portfolio 
              portfolio={portfolio}
              currentPrices={currentPrices}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
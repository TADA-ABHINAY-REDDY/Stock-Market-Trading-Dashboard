import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Stock } from '../types/stock';

interface Props {
  stocks: Stock[];
  onSelect: (symbol: string) => void;
}

export function StockList({ stocks, onSelect }: Props) {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Trading Market</h2>
      <div className="space-y-2">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => onSelect(stock.symbol)}
            className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">{stock.symbol[0]}</span>
              </div>
              <div>
                <p className="text-white font-medium">{stock.symbol}</p>
                <p className="text-sm text-gray-400">{stock.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">${stock.price.toFixed(2)}</p>
              <div className="flex items-center space-x-1">
                {stock.changePercent >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm ${
                    stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {Math.abs(stock.changePercent).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import type { Stock } from '../types/stock';

interface Props {
  stock: Stock;
  onTrade: (type: 'buy' | 'sell', amount: number) => void;
}

export function TradingPanel({ stock, onTrade }: Props) {
  const [amount, setAmount] = useState(1);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">{stock.symbol}</h2>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-gray-400" />
          <span className="text-xl font-bold text-white">${stock.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Amount
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value)))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => onTrade('buy', amount)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Buy
          </button>
          <button
            onClick={() => onTrade('sell', amount)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
}
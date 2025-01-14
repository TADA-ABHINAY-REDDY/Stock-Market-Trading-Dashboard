import { DollarSign } from 'lucide-react';
import type { Portfolio, Position } from '../types/stock';

interface Props {
  portfolio: Portfolio;
  currentPrices: Record<string, number>;
}

export function Portfolio({ portfolio, currentPrices }: Props) {
  const calculatePositionValue = (position: Position): number => {
    const currentPrice = currentPrices[position.symbol] || 0;
    return position.amount * currentPrice;
  };

  const calculateTotalValue = (): number => {
    return portfolio.positions.reduce(
      (total, position) => total + calculatePositionValue(position),
      portfolio.balance
    );
  };

  const calculateProfitLoss = (position: Position): number => {
    const currentPrice = currentPrices[position.symbol] || 0;
    return (currentPrice - position.averagePrice) * position.amount;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Portfolio</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
          <span className="text-gray-400">Available Cash</span>
          <span className="text-white font-bold">
            ${portfolio.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
          <span className="text-gray-400">Total Value</span>
          <span className="text-white font-bold">
            ${calculateTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {portfolio.positions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Positions</h3>
            <div className="space-y-3">
              {portfolio.positions.map((position) => {
                const profitLoss = calculateProfitLoss(position);
                const value = calculatePositionValue(position);
                
                return (
                  <div key={position.symbol} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">{position.symbol}</span>
                      <span className="text-white">${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {position.amount} {position.type === 'crypto' ? 'coins' : 'shares'} @ ${position.averagePrice.toFixed(2)}
                      </span>
                      <span className={profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
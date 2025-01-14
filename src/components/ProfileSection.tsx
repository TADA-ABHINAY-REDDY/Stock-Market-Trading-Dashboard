import React from 'react';
import { User, Wallet } from 'lucide-react';

interface Props {
  balance: number;
  positions: number;
}

export function ProfileSection({ balance, positions }: Props) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2">
        <Wallet className="w-4 h-4 text-green-500" />
        <span className="text-sm font-medium">
          ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2">
        <span className="text-sm font-medium">{positions} Positions</span>
      </div>
      <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2">
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium">Demo Account</span>
      </div>
    </div>
  );
}
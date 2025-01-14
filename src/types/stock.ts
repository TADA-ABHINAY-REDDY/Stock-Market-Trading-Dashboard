export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  type: 'stock' | 'crypto';
}

export interface Portfolio {
  balance: number;
  positions: Position[];
}

export interface Position {
  symbol: string;
  amount: number;
  averagePrice: number;
  type: 'stock' | 'crypto';
}

export interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}
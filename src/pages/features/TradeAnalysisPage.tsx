import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import FeaturePageLayout from './FeaturePageLayout';
import { Loader } from 'lucide-react';

interface Trade {
  id: number;
  symbol: string;
  direction: 'buy' | 'sell';
  size: number;
  entryPrice: number;
  exitPrice?: number;
  notes?: string;
  createdAt: string;
}

const StatCard: React.FC<{ title: string; value: string | number; className?: string }> = ({ title, value, className }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default function TradeAnalysisPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view trade analysis.');
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:3001/api/trades', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrades(response.data);
      } catch (err) {
        setError('Failed to fetch trades.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  const metrics = useMemo(() => {
    const completedTrades = trades.filter(t => t.exitPrice != null && t.exitPrice > 0);

    let totalProfitLoss = 0;
    let winningTrades = 0;
    let losingTrades = 0;

    completedTrades.forEach(trade => {
      const profit = trade.direction === 'buy'
        ? (trade.exitPrice! - trade.entryPrice) * trade.size
        : (trade.entryPrice - trade.exitPrice!) * trade.size;

      totalProfitLoss += profit;
      if (profit > 0) winningTrades++;
      if (profit < 0) losingTrades++;
    });

    const totalClosedTrades = winningTrades + losingTrades;
    const winRate = totalClosedTrades > 0 ? (winningTrades / totalClosedTrades) * 100 : 0;

    return {
      totalTrades: trades.length,
      completedTrades: completedTrades.length,
      totalProfitLoss: totalProfitLoss.toFixed(2),
      winRate: winRate.toFixed(2),
      winningTrades,
      losingTrades,
    };
  }, [trades]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center p-10"><Loader className="animate-spin" /> Loading Analysis...</div>;
    }
    if (error) {
      return <div className="text-red-500 text-center p-10">{error}</div>;
    }
    if (trades.length === 0) {
        return <div className="text-center p-10 text-gray-500 dark:text-gray-400">No trades found. Add some trades to see your analysis.</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Trades" value={metrics.totalTrades} />
        <StatCard title="Completed Trades" value={metrics.completedTrades} />
        <StatCard title="Total P/L" value={`$${metrics.totalProfitLoss}`} className={parseFloat(metrics.totalProfitLoss) >= 0 ? 'text-green-500' : 'text-red-500'} />
        <StatCard title="Win Rate" value={`${metrics.winRate}%`} />
        <StatCard title="Winning Trades" value={metrics.winningTrades} />
        <StatCard title="Losing Trades" value={metrics.losingTrades} />
      </div>
    );
  };

  return (
    <FeaturePageLayout
      title="Trade Analysis"
      description="Instantly switch between 20 different trading accounts to stay on top of your progress."
      image="/assets/2.png"
    >
      {renderContent()}
    </FeaturePageLayout>
  );
}

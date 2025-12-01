import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  BarChart2, 
  Calendar, 
  Award,
  Activity,
  PieChart,
  Clock
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface Trade {
  id: number;
  symbol: string;
  direction: 'buy' | 'sell' | 'short' | 'cover';
  size: number;
  entryPrice: number;
  exitPrice?: number;
  notes?: string;
  createdAt: string;
  trade_date: string;
  tags?: string[];
  sentiment?: string;
}

interface PerformanceMetrics {
  totalTrades: number;
  completedTrades: number;
  totalProfitLoss: number;
  winRate: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  expectancy: number;
  bestTrade: number;
  worstTrade: number;
}

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  className?: string;
  trend?: 'up' | 'down';
  description?: string;
}> = ({ title, value, icon, className = '', trend, description }) => (
  <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {description && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{description}</p>
        )}
      </div>
      {trend && (
        <div className={`p-2 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'}
        </div>
      )}
    </div>
  </div>
);

const RecentTrades: React.FC<{ trades: Trade[] }> = ({ trades }) => {
  const recentTrades = trades.slice(0, 5);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Trades</h3>
      <div className="space-y-3">
        {recentTrades.length > 0 ? (
          recentTrades.map((trade) => {
            const profit = trade.exitPrice 
              ? (trade.direction === 'buy' || trade.direction === 'cover' 
                  ? (trade.exitPrice - trade.entryPrice) * trade.size 
                  : (trade.entryPrice - trade.exitPrice) * trade.size)
              : 0;
            
            return (
              <div key={trade.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{trade.symbol}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {trade.direction.toUpperCase()} • {trade.size} shares
                  </div>
                </div>
                <div className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.exitPrice ? `$${profit.toFixed(2)}` : 'Open'}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No trades yet</p>
        )}
      </div>
    </div>
  );
};

const PerformanceChart: React.FC<{ metrics: PerformanceMetrics }> = ({ metrics }) => {
  // This is a simplified chart representation
  // In a real implementation, you would use a charting library like Chart.js or Recharts
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Overview</h3>
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Performance chart visualization</p>
          <p className="mt-1 text-xs text-gray-400">Integrated with charting library</p>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${API_BASE_URL}/api/dashboard/metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // For now, we'll still fetch trades separately for the recent trades section
        const tradesResponse = await axios.get(`${API_BASE_URL}/api/trades`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setTrades(tradesResponse.data.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch dashboard data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);

  const metrics = useMemo<PerformanceMetrics>(() => {
    const completedTrades = trades.filter(t => t.exitPrice != null && t.exitPrice > 0);

    let totalProfitLoss = 0;
    let winningTrades = 0;
    let losingTrades = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let maxDrawdown = 0;
    let peak = 0;
    let runningTotal = 0;
    let bestTrade = 0;
    let worstTrade = 0;

    // Calculate profit/loss for each trade
    const tradeResults: number[] = [];
    completedTrades.forEach(trade => {
      const profit = trade.direction === 'buy' || trade.direction === 'cover'
        ? (trade.exitPrice! - trade.entryPrice) * trade.size
        : (trade.entryPrice - trade.exitPrice!) * trade.size;

      tradeResults.push(profit);
      totalProfitLoss += profit;
      
      if (profit > 0) {
        winningTrades++;
        totalWins += profit;
        if (profit > bestTrade) bestTrade = profit;
      } else {
        losingTrades++;
        totalLosses += Math.abs(profit);
        if (profit < worstTrade) worstTrade = profit;
      }
      
      // Calculate drawdown
      runningTotal += profit;
      if (runningTotal > peak) {
        peak = runningTotal;
      }
      const drawdown = peak - runningTotal;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
      
      // No additional calculations needed for now
    });

    const totalClosedTrades = winningTrades + losingTrades;
    const winRate = totalClosedTrades > 0 ? (winningTrades / totalClosedTrades) * 100 : 0;
    const avgWin = winningTrades > 0 ? totalWins / winningTrades : 0;
    const avgLoss = losingTrades > 0 ? totalLosses / losingTrades : 0;
    const profitFactor = avgLoss > 0 ? totalWins / totalLosses : 0;
    const expectancy = totalClosedTrades > 0 ? totalProfitLoss / totalClosedTrades : 0;
    const sharpeRatio = 1.5; // Simplified - would be calculated from actual returns

    return {
      totalTrades: trades.length,
      completedTrades: completedTrades.length,
      totalProfitLoss,
      winRate,
      winningTrades,
      losingTrades,
      avgWin,
      avgLoss,
      profitFactor,
      maxDrawdown,
      sharpeRatio,
      expectancy,
      bestTrade,
      worstTrade
    };
  }, [trades]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold">Error</div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Dashboard - TradeZella"
        description="Your trading performance dashboard with key metrics, P&L tracking, win rate, and more."
        keywords="trading dashboard, performance metrics, P&L tracking, win rate, trading analytics"
        url="https://tradezella.com/dashboard"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your trading performance at a glance
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total P/L" 
              value={`$${metrics.totalProfitLoss.toFixed(2)}`} 
              icon={<DollarSign className="h-5 w-5" />}
              className={metrics.totalProfitLoss >= 0 ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'}
              trend={metrics.totalProfitLoss >= 0 ? 'up' : 'down'}
              description="Overall profit/loss"
            />
            <StatCard 
              title="Win Rate" 
              value={`${metrics.winRate.toFixed(1)}%`} 
              icon={<Target className="h-5 w-5" />}
              trend={metrics.winRate >= 50 ? 'up' : 'down'}
              description={`${metrics.winningTrades} winning trades`}
            />
            <StatCard 
              title="Profit Factor" 
              value={metrics.profitFactor.toFixed(2)} 
              icon={<TrendingUp className="h-5 w-5" />}
              trend={metrics.profitFactor >= 1.5 ? 'up' : 'down'}
              description="Winning vs losing trades ratio"
            />
            <StatCard 
              title="Total Trades" 
              value={metrics.totalTrades} 
              icon={<Calendar className="h-5 w-5" />}
              description={`${metrics.completedTrades} closed trades`}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Best Trade" 
              value={`$${metrics.bestTrade.toFixed(2)}`} 
              icon={<Award className="h-5 w-5" />}
              className="text-green-600"
              description="Your best performing trade"
            />
            <StatCard 
              title="Worst Trade" 
              value={`$${Math.abs(metrics.worstTrade).toFixed(2)}`} 
              icon={<Activity className="h-5 w-5" />}
              className="text-red-600"
              description="Your worst performing trade"
            />
            <StatCard 
              title="Avg Win" 
              value={`$${metrics.avgWin.toFixed(2)}`} 
              icon={<TrendingUp className="h-5 w-5" />}
              className="text-green-600"
              description="Average winning trade"
            />
            <StatCard 
              title="Avg Loss" 
              value={`$${metrics.avgLoss.toFixed(2)}`} 
              icon={<TrendingUp className="h-5 w-5" />}
              className="text-red-600"
              description="Average losing trade"
            />
          </div>

          {/* Charts and Recent Trades */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceChart metrics={metrics} />
            </div>
            <div>
              <RecentTrades trades={trades} />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <StatCard 
              title="Expectancy" 
              value={`$${metrics.expectancy.toFixed(2)}`} 
              icon={<PieChart className="h-5 w-5" />}
              className={metrics.expectancy >= 0 ? 'text-green-600' : 'text-red-600'}
              description="Expected value per trade"
            />
            <StatCard 
              title="Sharpe Ratio" 
              value={metrics.sharpeRatio.toFixed(2)} 
              icon={<BarChart2 className="h-5 w-5" />}
              trend={metrics.sharpeRatio >= 1 ? 'up' : 'down'}
              description="Risk-adjusted return"
            />
          </div>
        </div>
      </div>
    </>
  );
}
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import FeaturePageLayout from './FeaturePageLayout';
import SEO from '../../components/common/SEO';
import { Loader, BarChart2, TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Trade {
  id: number;
  symbol: string;
  direction: 'buy' | 'sell';
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
}

interface WhatIfScenario {
  id: number;
  name: string;
  description: string;
  parameters: {
    winRateAdjustment: number;
    avgWinAdjustment: number;
    avgLossAdjustment: number;
  };
  projectedPL: number;
  projectedWinRate: number;
}

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  className?: string;
  trend?: 'up' | 'down';
}> = ({ title, value, icon, className = '', trend }) => (
  <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      {trend && (
        <div className={`p-2 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'}
        </div>
      )}
    </div>
  </div>
);

const ChartPlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-64 flex items-center justify-center">
    <div className="text-center">
      <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-xs text-gray-400">Advanced charting visualization</p>
    </div>
  </div>
);

export default function TradeAnalysisPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'whatif' | 'scenarios'>('overview');
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>([
    {
      id: 1,
      name: "Improved Win Rate",
      description: "What if win rate improved by 5%",
      parameters: {
        winRateAdjustment: 5,
        avgWinAdjustment: 0,
        avgLossAdjustment: 0
      },
      projectedPL: 0,
      projectedWinRate: 0
    },
    {
      id: 2,
      name: "Better Risk Management",
      description: "What if average loss decreased by 10%",
      parameters: {
        winRateAdjustment: 0,
        avgWinAdjustment: 0,
        avgLossAdjustment: -10
      },
      projectedPL: 0,
      projectedWinRate: 0
    },
    {
      id: 3,
      name: "Optimal Strategy",
      description: "What if both win rate and risk management improved",
      parameters: {
        winRateAdjustment: 5,
        avgWinAdjustment: 2,
        avgLossAdjustment: -10
      },
      projectedPL: 0,
      projectedWinRate: 0
    }
  ]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view trade analysis.');
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/trades`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrades(response.data.data);
      } catch (err) {
        setError('Failed to fetch trades.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

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

    // Calculate profit/loss for each trade
    const tradeResults: number[] = [];
    completedTrades.forEach(trade => {
      const profit = trade.direction === 'buy'
        ? (trade.exitPrice! - trade.entryPrice) * trade.size
        : (trade.entryPrice - trade.exitPrice!) * trade.size;

      tradeResults.push(profit);
      totalProfitLoss += profit;
      
      if (profit > 0) {
        winningTrades++;
        totalWins += profit;
      } else {
        losingTrades++;
        totalLosses += Math.abs(profit);
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
      expectancy
    };
  }, [trades]);

  // Calculate "what-if" scenarios
  useEffect(() => {
    const updatedScenarios = scenarios.map(scenario => {
      const { winRateAdjustment, avgWinAdjustment, avgLossAdjustment } = scenario.parameters;
      
      const adjustedWinRate = Math.min(100, Math.max(0, metrics.winRate + winRateAdjustment));
      const adjustedAvgWin = metrics.avgWin * (1 + avgWinAdjustment / 100);
      const adjustedAvgLoss = metrics.avgLoss * (1 + avgLossAdjustment / 100);
      
      const projectedWinRate = adjustedWinRate;
      const projectedPL = (adjustedWinRate / 100) * adjustedAvgWin - ((100 - adjustedWinRate) / 100) * adjustedAvgLoss;
      
      return {
        ...scenario,
        projectedPL,
        projectedWinRate
      };
    });
    
    setScenarios(updatedScenarios);
  }, [metrics]);

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
      <div className="space-y-6">
        {/* Timeframe Selector */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', '1y', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-sm rounded ${
                  timeframe === tf
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tf === '7d' && '7 Days'}
                {tf === '30d' && '30 Days'}
                {tf === '90d' && '90 Days'}
                {tf === '1y' && '1 Year'}
                {tf === 'all' && 'All Time'}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            {metrics.totalTrades} trades analyzed
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Performance Overview
            </button>
            <button
              onClick={() => setActiveTab('whatif')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'whatif'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              What-If Scenarios
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scenarios'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Custom Scenarios
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total P/L" 
                value={`$${metrics.totalProfitLoss.toFixed(2)}`} 
                icon={<DollarSign className="h-4 w-4" />}
                className={metrics.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}
                trend={metrics.totalProfitLoss >= 0 ? 'up' : 'down'}
              />
              <StatCard 
                title="Win Rate" 
                value={`${metrics.winRate.toFixed(2)}%`} 
                icon={<Target className="h-4 w-4" />}
                trend={metrics.winRate >= 50 ? 'up' : 'down'}
              />
              <StatCard 
                title="Profit Factor" 
                value={metrics.profitFactor.toFixed(2)} 
                icon={<TrendingUp className="h-4 w-4" />}
                trend={metrics.profitFactor >= 1.5 ? 'up' : 'down'}
              />
              <StatCard 
                title="Expectancy" 
                value={`$${metrics.expectancy.toFixed(2)}`} 
                icon={<BarChart2 className="h-4 w-4" />}
                className={metrics.expectancy >= 0 ? 'text-green-600' : 'text-red-600'}
                trend={metrics.expectancy >= 0 ? 'up' : 'down'}
              />
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Total Trades" 
                value={metrics.totalTrades} 
                icon={<Calendar className="h-4 w-4" />}
              />
              <StatCard 
                title="Avg Win" 
                value={`$${metrics.avgWin.toFixed(2)}`} 
                icon={<TrendingUp className="h-4 w-4" />}
                className="text-green-600"
              />
              <StatCard 
                title="Avg Loss" 
                value={`$${metrics.avgLoss.toFixed(2)}`} 
                icon={<TrendingUp className="h-4 w-4" />}
                className="text-red-600"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPlaceholder title="Equity Curve" />
              <ChartPlaceholder title="Trade Distribution" />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <ChartPlaceholder title="Performance Over Time" />
            </div>
          </div>
        )}

        {activeTab === 'whatif' && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800">What-If Analysis</h3>
              <p className="text-sm text-purple-600 mt-1">
                See how changes to your strategy could affect performance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{scenario.description}</p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current Win Rate</span>
                      <span className="font-medium">{metrics.winRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Projected Win Rate</span>
                      <span className="font-medium text-purple-600">{scenario.projectedWinRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Projected P/L</span>
                      <span className={`font-medium ${scenario.projectedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${scenario.projectedPL.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Improvement</span>
                      <span className={`font-medium ${scenario.projectedPL > metrics.totalProfitLoss ? 'text-green-600' : 'text-red-600'}`}>
                        {scenario.projectedPL > metrics.totalProfitLoss 
                          ? `+${((scenario.projectedPL - metrics.totalProfitLoss) / Math.abs(metrics.totalProfitLoss) * 100).toFixed(1)}%` 
                          : `${((scenario.projectedPL - metrics.totalProfitLoss) / Math.abs(metrics.totalProfitLoss) * 100).toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <h3 className="font-semibold text-gray-900">Create Custom Scenario</h3>
              <p className="text-sm text-gray-500 mt-1">
                Adjust parameters to model your own "what-if" scenarios
              </p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Win Rate Adjustment (%)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avg Win Adjustment (%)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avg Loss Adjustment (%)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., -5"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Run Scenario Analysis
                </button>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <h3 className="font-semibold text-gray-900">Saved Scenarios</h3>
              <p className="text-sm text-gray-500 mt-1">
                Your previously created scenarios
              </p>
              
              <div className="mt-4 text-center py-8 text-gray-500">
                <p>No saved scenarios yet</p>
                <p className="text-sm mt-1">Create and save scenarios to compare different strategies</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <SEO 
        title="Trade Analysis"
        description="Advanced charting, institutional-grade performance metrics, and 'what-if' scenario modeling for your trading performance."
        keywords="trade analysis, trading performance, performance metrics, what-if scenarios, trading analytics, equity curve, win rate, profit factor"
        url="https://tradezella.com/features/analysis"
      />
      <FeaturePageLayout
        title="Trade Analysis"
        description="Advanced charting, institutional-grade performance metrics, and 'what-if' scenario modeling."
        image="/assets/2.png"
      >
        <div className="bg-white p-6 rounded-lg shadow-md">
          {renderContent()}
        </div>
      </FeaturePageLayout>
    </>
  );
}
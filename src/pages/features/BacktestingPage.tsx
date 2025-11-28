import React, { useState, useEffect } from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import axios from 'axios';
import { 
  Play, Pause, Square, Save, Download, BarChart2, 
  Calendar, TrendingUp, Target, DollarSign, Clock
} from 'lucide-react';

interface BacktestResult {
  id: string;
  name: string;
  strategy: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  createdAt: string;
}

interface Trade {
  id: number;
  date: string;
  symbol: string;
  direction: string;
  size: number;
  entryPrice: number;
  exitPrice: number;
  profit: number;
  commission: number;
}

const StrategyExample = ({ title, description, onClick }: { title: string; description: string; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
  >
    <h4 className="font-medium text-gray-900">{title}</h4>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </div>
);

export default function BacktestingPage() {
  const [backtests, setBacktests] = useState<BacktestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'results'>('builder');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [strategy, setStrategy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [initialCapital, setInitialCapital] = useState('10000');
  const [selectedBacktest, setSelectedBacktest] = useState<BacktestResult | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to access backtesting.');
          return;
        }

        // In a real implementation, this would be an API call
        const mockBacktests: BacktestResult[] = [
          {
            id: '1',
            name: 'Moving Average Crossover',
            strategy: 'Buy when short-term MA crosses above long-term MA, sell when opposite',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
            initialCapital: 10000,
            finalCapital: 12560.75,
            totalTrades: 42,
            winningTrades: 28,
            losingTrades: 14,
            winRate: 66.67,
            profitFactor: 2.15,
            maxDrawdown: 8.25,
            sharpeRatio: 1.87,
            createdAt: '2023-01-15'
          },
          {
            id: '2',
            name: 'RSI Mean Reversion',
            strategy: 'Buy when RSI < 30, sell when RSI > 70',
            startDate: '2022-06-01',
            endDate: '2023-06-01',
            initialCapital: 10000,
            finalCapital: 11240.30,
            totalTrades: 67,
            winningTrades: 41,
            losingTrades: 26,
            winRate: 61.19,
            profitFactor: 1.78,
            maxDrawdown: 12.40,
            sharpeRatio: 1.42,
            createdAt: '2023-02-20'
          }
        ];

        setBacktests(mockBacktests);
      } catch (err) {
        setError('Failed to load backtest data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const runBacktest = async () => {
    if (!strategy.trim()) {
      alert('Please enter a strategy');
      return;
    }

    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      setIsRunning(true);
      setProgress(0);

      // Simulate backtest progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      // In a real implementation, this would be an API call
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        
        // Mock result
        const newResult: BacktestResult = {
          id: `${Date.now()}`,
          name: `Backtest ${new Date().toLocaleDateString()}`,
          strategy,
          startDate,
          endDate,
          initialCapital: parseFloat(initialCapital),
          finalCapital: parseFloat(initialCapital) * (1 + (Math.random() * 0.3 - 0.1)),
          totalTrades: Math.floor(Math.random() * 100) + 20,
          winningTrades: Math.floor(Math.random() * 60) + 20,
          losingTrades: 0,
          winRate: 0,
          profitFactor: parseFloat((1 + Math.random() * 2).toFixed(2)),
          maxDrawdown: parseFloat((Math.random() * 15).toFixed(2)),
          sharpeRatio: parseFloat((Math.random() * 2).toFixed(2)),
          createdAt: new Date().toISOString().split('T')[0]
        };

        newResult.losingTrades = newResult.totalTrades - newResult.winningTrades;
        newResult.winRate = parseFloat(((newResult.winningTrades / newResult.totalTrades) * 100).toFixed(2));

        setBacktests([newResult, ...backtests]);
        setIsRunning(false);
        setActiveTab('results');
        setSelectedBacktest(newResult);

        // Generate mock trades
        const mockTrades: Trade[] = Array.from({ length: Math.min(newResult.totalTrades, 20) }, (_, i) => ({
          id: i + 1,
          date: new Date(new Date(startDate).getTime() + Math.random() * (new Date(endDate).getTime() - new Date(startDate).getTime())).toISOString().split('T')[0],
          symbol: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'][Math.floor(Math.random() * 5)],
          direction: Math.random() > 0.5 ? 'Buy' : 'Sell',
          size: Math.floor(Math.random() * 100) + 1,
          entryPrice: parseFloat((100 + Math.random() * 150).toFixed(2)),
          exitPrice: parseFloat((100 + Math.random() * 150).toFixed(2)),
          profit: parseFloat(((Math.random() * 1000) - 500).toFixed(2)),
          commission: parseFloat((Math.random() * 10).toFixed(2))
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setTrades(mockTrades);
      }, 3000);
    } catch (err) {
      setError('Failed to run backtest.');
      console.error(err);
      setIsRunning(false);
    }
  };

  const saveBacktest = async () => {
    if (!selectedBacktest) return;
    
    try {
      // In a real implementation, this would be an API call
      alert('Backtest saved successfully!');
    } catch (err) {
      setError('Failed to save backtest.');
      console.error(err);
    }
  };

  const exportResults = () => {
    alert('Export functionality would open here');
  };

  const viewTrades = (backtest: BacktestResult) => {
    setSelectedBacktest(backtest);
    setActiveTab('results');
    
    // Generate mock trades for the selected backtest
    const mockTrades: Trade[] = Array.from({ length: Math.min(backtest.totalTrades, 20) }, (_, i) => ({
      id: i + 1,
      date: new Date(new Date(backtest.startDate).getTime() + Math.random() * (new Date(backtest.endDate).getTime() - new Date(backtest.startDate).getTime())).toISOString().split('T')[0],
      symbol: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'][Math.floor(Math.random() * 5)],
      direction: Math.random() > 0.5 ? 'Buy' : 'Sell',
      size: Math.floor(Math.random() * 100) + 1,
      entryPrice: parseFloat((100 + Math.random() * 150).toFixed(2)),
      exitPrice: parseFloat((100 + Math.random() * 150).toFixed(2)),
      profit: parseFloat(((Math.random() * 1000) - 500).toFixed(2)),
      commission: parseFloat((Math.random() * 10).toFixed(2))
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setTrades(mockTrades);
  };

  const strategyExamples = [
    {
      title: "Moving Average Crossover",
      description: "Buy when 50-day MA crosses above 200-day MA, sell when opposite"
    },
    {
      title: "RSI Mean Reversion",
      description: "Buy when RSI drops below 30, sell when RSI rises above 70"
    },
    {
      title: "Breakout Strategy",
      description: "Buy when price breaks above 52-week high, sell on trailing stop"
    },
    {
      title: "Mean Reversion",
      description: "Buy when price deviates 2 std devs from 20-day moving average"
    }
  ];

  return (
    <FeaturePageLayout
      title="Backtesting"
      description="User-friendly, natural language-based backtesting engine with realistic simulations and in-depth performance analytics."
      image="/assets/5.png"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('builder')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'builder'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Strategy Builder
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Backtest Results
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-500">Loading backtests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-red-500">{error}</div>
          </div>
        ) : activeTab === 'builder' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Strategy Builder */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Define Your Strategy</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strategy Description
                    </label>
                    <textarea
                      value={strategy}
                      onChange={(e) => setStrategy(e.target.value)}
                      placeholder="Describe your trading strategy in plain English. For example: 'Buy when the 50-day moving average crosses above the 200-day moving average and RSI is below 30'"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Initial Capital ($)
                      </label>
                      <input
                        type="number"
                        value={initialCapital}
                        onChange={(e) => setInitialCapital(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={runBacktest}
                      disabled={isRunning}
                      className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                        isRunning 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Clock className="h-5 w-5 mr-2 animate-spin" />
                          Running Backtest...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Run Backtest
                        </>
                      )}
                    </button>
                  </div>
                  
                  {isRunning && (
                    <div className="pt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Running simulation on historical data...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Strategy Examples */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Strategy Examples</h3>
              <div className="space-y-3">
                {strategyExamples.map((example, index) => (
                  <StrategyExample
                    key={index}
                    title={example.title}
                    description={example.description}
                    onClick={() => setStrategy(example.description)}
                  />
                ))}
              </div>
              
              <div className="mt-6 bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-800">Natural Language Processing</h4>
                <p className="text-sm text-purple-600 mt-1">
                  Our AI translates your plain English strategy into executable code for backtesting.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {selectedBacktest ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedBacktest.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{selectedBacktest.strategy}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={saveBacktest}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={exportResults}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </button>
                    <button
                      onClick={() => setSelectedBacktest(null)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Back to Results
                    </button>
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Final Capital</p>
                        <p className="text-lg font-semibold">${selectedBacktest.finalCapital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Win Rate</p>
                        <p className="text-lg font-semibold">{selectedBacktest.winRate}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Profit Factor</p>
                        <p className="text-lg font-semibold">{selectedBacktest.profitFactor}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <BarChart2 className="h-5 w-5 text-yellow-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Sharpe Ratio</p>
                        <p className="text-lg font-semibold">{selectedBacktest.sharpeRatio}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Equity Curve Visualization */}
                <div className="bg-gray-50 rounded-lg p-5 mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Equity Curve</h4>
                  <div className="h-64 flex items-center justify-center bg-white rounded-lg border border-gray-200">
                    <div className="text-center">
                      <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Equity curve visualization</p>
                    </div>
                  </div>
                </div>
                
                {/* Trade List */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Trade List</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {trades.map((trade) => (
                          <tr key={trade.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trade.symbol}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                trade.direction === 'Buy' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {trade.direction}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.size}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${trade.entryPrice}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${trade.exitPrice}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ${trade.profit.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Backtest Results</h3>
                  <button
                    onClick={() => setActiveTab('builder')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Run New Backtest
                  </button>
                </div>
                
                {backtests.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No backtest results yet</p>
                    <button
                      onClick={() => setActiveTab('builder')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Run Your First Backtest
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {backtests.map((backtest) => (
                      <div key={backtest.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <h3 className="text-lg font-medium text-gray-900">{backtest.name}</h3>
                          </div>
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{backtest.strategy}</p>
                          
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-400">Period</p>
                              <p className="text-sm font-medium">{backtest.startDate} to {backtest.endDate}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Initial Capital</p>
                              <p className="text-sm font-medium">${backtest.initialCapital.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Return</p>
                              <p className={`text-lg font-semibold ${
                                backtest.finalCapital >= backtest.initialCapital ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {(((backtest.finalCapital - backtest.initialCapital) / backtest.initialCapital) * 100).toFixed(2)}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Win Rate</p>
                              <p className="text-lg font-semibold">{backtest.winRate}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Trades</p>
                              <p className="text-lg font-semibold">{backtest.totalTrades}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3 flex justify-between">
                          <div className="text-xs text-gray-500">
                            Created {backtest.createdAt}
                          </div>
                          <button
                            onClick={() => viewTrades(backtest)}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </FeaturePageLayout>
  );
}
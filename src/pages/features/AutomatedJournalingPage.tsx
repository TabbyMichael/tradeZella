import React, { useState, useEffect } from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import Button from '../../components/common/Button';
import SEO from '../../components/common/SEO';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Trade {
  id: string;
  userId: number;
  symbol: string;
  direction: 'buy' | 'sell' | 'short' | 'cover';
  size: number;
  entryPrice: number;
  exitPrice?: number;
  notes?: string;
  trade_date: string;
  tags?: string[];
  sentiment?: string;
  screenshots?: string[];
  createdAt: string;
  updatedAt: string;
}

interface AIAnalysis {
  id: string;
  tradeId: string;
  analysisType: string;
  results: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    emotionalState: string;
    riskAssessment: string;
  };
  createdAt: string;
}

export default function AutomatedJournalingPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [aiAnalyses, setAiAnalyses] = useState<Record<string, AIAnalysis>>({});
  const [symbol, setSymbol] = useState('');
  const [direction, setDirection] = useState<'buy' | 'sell' | 'short' | 'cover'>('buy');
  const [size, setSize] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [tradeDate, setTradeDate] = useState('');
  const [tags, setTags] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [screenshots, setScreenshots] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'broker' | 'file'>('manual');

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/trades`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrades(response.data.data);
    } catch (err) {
      setError('Failed to fetch trades.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIAnalysis = async (tradeId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/ai-analysis/${tradeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiAnalyses(prev => ({
        ...prev,
        [tradeId]: response.data.data
      }));
    } catch (err) {
      console.error('Failed to fetch AI analysis.', err);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleSaveTrade = async () => {
    if (!symbol || !tradeDate || !entryPrice || !size) {
      alert('Please fill in all required fields: Symbol, Trade Date, Entry Price, Size.');
      return;
    }

    const newTradeData = {
      symbol,
      direction,
      size: parseFloat(size),
      entryPrice: parseFloat(entryPrice),
      exitPrice: exitPrice ? parseFloat(exitPrice) : undefined,
      notes: notes || undefined,
      tradeDate,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
      sentiment: sentiment || undefined,
      screenshots: screenshots ? screenshots.split(',').map(url => url.trim()) : undefined,
    };

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/trades`, newTradeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrades(prevTrades => [...prevTrades, response.data.data]);
      
      // Trigger AI analysis for the new trade
      await fetchAIAnalysis(response.data.data.id);
      
      // Clear form
      setSymbol('');
      setDirection('buy');
      setSize('');
      setEntryPrice('');
      setExitPrice('');
      setNotes('');
      setTradeDate('');
      setTags('');
      setSentiment('');
      setScreenshots('');
    } catch (err) {
      setError('Failed to save trade.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleBrokerSync = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      // This would connect to actual broker APIs in a real implementation
      const response = await axios.post(`${API_BASE_URL}/api/brokers/sync`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Successfully synced ${response.data.data.tradesCount} trades from your broker.`);
      fetchTrades(); // Refresh the trades list
    } catch (err) {
      setError('Failed to sync with broker.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/trades/import`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      alert(`Successfully imported ${response.data.data.importedCount} trades from file.`);
      fetchTrades(); // Refresh the trades list
    } catch (err) {
      setError('Failed to import trades from file.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const requestAIAnalysis = async (tradeId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/ai-analysis/analyze-trade/${tradeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiAnalyses(prev => ({
        ...prev,
        [tradeId]: response.data.data
      }));
    } catch (err) {
      console.error('Failed to request AI analysis.', err);
    }
  };

  return (
    <>
      <SEO 
        title="Automated Journaling"
        description="AI-powered trade analysis, automated data entry from brokers, and a rich journaling experience with performance tracking."
        keywords="trading journal, automated trading, AI trade analysis, broker integration, trade tracking, performance metrics"
        url="https://tradezella.com/features/journaling"
      />
      <FeaturePageLayout
        title="Automated Journaling"
        description="AI-powered trade analysis, automated data entry from brokers, and a rich journaling experience with performance tracking."
        image="/assets/1.png"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add New Trade</h2>
            
            {/* Tab Navigation */}
            <div className="flex border-b mb-4">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'manual' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('manual')}
              >
                Manual Entry
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'broker' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('broker')}
              >
                Broker Sync
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'file' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('file')}
              >
                File Upload
              </button>
            </div>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            {activeTab === 'manual' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Symbol (e.g., AAPL)"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <input
                  type="date"
                  value={tradeDate}
                  onChange={(e) => setTradeDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as 'buy' | 'sell' | 'short' | 'cover')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                  <option value="short">Short</option>
                  <option value="cover">Cover</option>
                </select>
                <input
                  type="number"
                  placeholder="Size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Entry Price"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Exit Price (optional)"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <select
                  value={sentiment}
                  onChange={(e) => setSentiment(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select Sentiment</option>
                  <option value="confident">Confident</option>
                  <option value="fearful">Fearful</option>
                  <option value="greedy">Greedy</option>
                  <option value="regretful">Regretful</option>
                  <option value="neutral">Neutral</option>
                </select>
                <input
                  type="text"
                  placeholder="Screenshot URLs (comma-separated)"
                  value={screenshots}
                  onChange={(e) => setScreenshots(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <textarea
                  placeholder="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  rows={3}
                />
                <Button 
                  variant="gradient" 
                  onClick={handleSaveTrade} 
                  className={`w-full ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Trade'}
                </Button>
              </div>
            )}
            
            {activeTab === 'broker' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Connect your broker account to automatically import your trades.
                </p>
                <Button 
                  variant="gradient" 
                  onClick={handleBrokerSync} 
                  className="w-full"
                  disabled={saving}
                >
                  {saving ? 'Syncing...' : 'Sync with Broker'}
                </Button>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Connected Brokers:</h3>
                  <ul className="text-sm text-gray-600">
                    <li className="flex items-center justify-between py-1">
                      <span>Interactive Brokers</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Connected</span>
                    </li>
                    <li className="flex items-center justify-between py-1">
                      <span>TD Ameritrade</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'file' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Upload a CSV or Excel file containing your trade data.
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.xls" 
                    onChange={handleFileUpload}
                    className="hidden" 
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer text-purple-600 hover:text-purple-800"
                  >
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Click to upload trade file</span>
                      <p className="text-xs text-gray-500 mt-1">CSV, XLSX, or XLS files only</p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Trade Journal</h2>
              <div className="text-sm text-gray-500">
                {trades.length} trades recorded
              </div>
            </div>
            
            {loading ? (
              <p className="text-gray-500">Loading trades...</p>
            ) : trades.length === 0 ? (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 mb-4">No trades recorded yet</p>
                <p className="text-gray-400 text-sm">Add your first trade using the form or connect your broker</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trades.map((trade) => (
                  <div key={trade.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">{trade.symbol}</h3>
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${
                            trade.direction === 'buy' || trade.direction === 'cover' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.direction.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                          {new Date(trade.trade_date).toLocaleDateString()} • 
                          Size: {trade.size} • 
                          Entry: ${trade.entryPrice}
                          {trade.exitPrice && ` • Exit: $${trade.exitPrice}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <button 
                          onClick={() => requestAIAnalysis(trade.id)}
                          className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                        >
                          AI Analysis
                        </button>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(trade.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {trade.notes && (
                      <p className="mt-2 text-gray-600 text-sm">{trade.notes}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {trade.tags?.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {trade.sentiment && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          {trade.sentiment}
                        </span>
                      )}
                    </div>
                    
                    {aiAnalyses[trade.id] && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-800 text-sm">AI Analysis</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-gray-600">Strengths</p>
                            <ul className="text-xs text-gray-700 list-disc list-inside">
                              {aiAnalyses[trade.id].results.strengths.slice(0, 2).map((strength, i) => (
                                <li key={i}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Recommendations</p>
                            <ul className="text-xs text-gray-700 list-disc list-inside">
                              {aiAnalyses[trade.id].results.recommendations.slice(0, 2).map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-2 text-xs">
                          <span className="font-medium">Risk Assessment:</span> {aiAnalyses[trade.id].results.riskAssessment}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </FeaturePageLayout>
    </>
  );
}
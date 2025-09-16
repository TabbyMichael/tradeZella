import React, { useState, useEffect } from 'react';
import SectionHeading from '../../components/common/SectionHeading';
import Button from '../../components/common/Button';

interface Trade {
  id: string;
  symbol: string;
  date: string;
  action: 'Buy' | 'Sell';
  price: number;
  quantity: number;
  notes: string;
}

export default function AutomatedJournalingPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [symbol, setSymbol] = useState('');
  const [date, setDate] = useState('');
  const [action, setAction] = useState<'Buy' | 'Sell'>('Buy');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      const savedTrades = localStorage.getItem('trades');
      if (savedTrades) {
        setTrades(JSON.parse(savedTrades));
      }
    } catch (error) {
      console.error("Failed to parse trades from localStorage", error);
    }
  }, []);

  const handleSaveTrade = () => {
    if (!symbol || !date || !price || !quantity) {
      alert('Please fill in all required fields.');
      return;
    }

    const newTrade: Trade = {
      id: new Date().toISOString(),
      symbol,
      date,
      action,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      notes,
    };

    const updatedTrades = [...trades, newTrade];
    setTrades(updatedTrades);
    localStorage.setItem('trades', JSON.stringify(updatedTrades));

    // Clear form
    setSymbol('');
    setDate('');
    setAction('Buy');
    setPrice('');
    setQuantity('');
    setNotes('');
  };

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Automated Journaling"
          description="Manually enter and save your trades. Your data is saved locally in your browser."
          centered
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Enter New Trade</h2>
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as 'Buy' | 'Sell')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <Button variant="gradient" onClick={handleSaveTrade} className="w-full">Save Trade</Button>
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Saved Trades</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {trades.length === 0 ? (
                <p className="text-gray-500">No trades saved yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {trades.map((trade) => (
                        <tr key={trade.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trade.symbol}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.action}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

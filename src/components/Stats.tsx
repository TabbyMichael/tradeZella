import React from 'react';

const stats = [
  { number: '20.2B+', label: 'Trades Journaled' },
  { number: '100K+', label: 'Backtested Sessions' },
  { number: '1M+', label: 'Trades Shared' },
  { number: '20K+', label: 'Traders on board' }
];

export default function Stats() {
  return (
    <div className="bg-white dark:bg-navy-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl text-center shadow-sm">
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{stat.number}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

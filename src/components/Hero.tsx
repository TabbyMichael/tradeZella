import React from 'react';
import { Notebook, LineChart, BarChart2, Play, RefreshCw, FileText } from 'lucide-react';
import Button from './common/Button';

const features = [
  { icon: Notebook, label: 'Journal' },
  { icon: LineChart, label: 'Analytics' },
  { icon: FileText, label: 'Notebook', dark: true },
  { icon: BarChart2, label: 'Reporting' },
  { icon: RefreshCw, label: 'Backtesting' },
  { icon: Play, label: 'Replay' }
];

export default function Hero() {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            The Only <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">Tool You Need</span> to<br />
            Become <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">Profitable</span>
          </h1>
          
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            TradeZella helps you discover your strengths and weaknesses to become a
            profitable trader with the power of journaling and analytics.
          </p>
          
          <Button variant="gradient" className="mt-8 text-lg">
            Get Started Now &gt;
          </Button>
          
          <div className="mt-16 grid grid-cols-6 gap-8 justify-items-center">
            {features.map((Feature, index) => (
              <div key={index} className="text-center">
                <div className={`${Feature.dark ? 'bg-navy-900' : 'bg-white'} p-4 rounded-lg shadow-sm`}>
                  <Feature.icon className={`h-6 w-6 ${Feature.dark ? 'text-white' : 'text-gray-700'}`} />
                </div>
                <p className="mt-2 text-sm">{Feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

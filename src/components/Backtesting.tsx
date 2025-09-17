import React from 'react';
import { BarChart2, Play, TrendingUp } from 'lucide-react';
import Button from './common/Button';
import SectionHeading from './common/SectionHeading';

const features = [
  { icon: BarChart2, label: 'Backtesting' },
  { icon: Play, label: 'Replay' },
  { icon: TrendingUp, label: 'Improve' }
];

export default function Backtesting() {
  return (
    <section className="py-24 bg-white dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="5"
          label="BACKTESTING & REPLAY"
          title={
            <>
              Take it one step further.
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-transparent bg-clip-text">
                Backtest. Replay. Improve.
              </span>
            </>
          }
          centered
        />

        <div className="mt-12 text-center">
          <Button variant="gradient">Get Started Today &gt;</Button>
        </div>

        <div className="mt-16 flex justify-center space-x-8">
          {features.map((Feature, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 px-8 py-4 rounded-full">
              <Feature.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span className="mt-2 text-sm font-medium dark:text-gray-300">{Feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

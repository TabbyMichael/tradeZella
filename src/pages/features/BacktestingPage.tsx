import React from 'react';
    import SectionHeading from '../../components/common/SectionHeading';
    
    export default function BacktestingPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Backtesting"
              description="Test your trading strategies on historical data."
              centered
            />
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Strategy Definition: Ability to define trading strategies using a visual interface or code.</li>
                <li>Backtesting Execution: Execution of backtests on historical data.</li>
                <li>Backtesting Results: Detailed performance metrics for backtests.</li>
                <li>Optimization: Ability to optimize strategy parameters for better performance.</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

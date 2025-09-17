import React from 'react';
import FeaturePageLayout from './FeaturePageLayout';

export default function BacktestingPage() {
  return (
    <FeaturePageLayout
      title="Backtesting"
      description="Test your trading strategies on historical data."
      image="/assets/5.png"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Strategy Definition: Ability to define trading strategies using a visual interface or code.</li>
          <li>Backtesting Execution: Execution of backtests on historical data.</li>
          <li>Backtesting Results: Detailed performance metrics for backtests.</li>
          <li>Optimization: Ability to optimize strategy parameters for better performance.</li>
        </ul>
      </div>
    </FeaturePageLayout>
  );
}

import React from 'react';
import FeaturePageLayout from './FeaturePageLayout';

export default function TradeAnalysisPage() {
  return (
    <FeaturePageLayout
      title="Trade Analysis"
      description="Instantly switch between 20 different trading accounts to stay on top of your progress."
      image="/assets/2.png"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Performance Metrics: Total profit/loss, win rate, loss rate, etc.</li>
          <li>Symbol Analysis: Performance metrics for individual symbols.</li>
          <li>Time-Based Analysis: Performance metrics by day, week, month, or year.</li>
          <li>Tag-Based Analysis: Performance metrics for trades with specific tags.</li>
          <li>Risk Analysis: Analysis of risk per trade, risk of ruin calculation.</li>
          <li>Customizable Analysis: Ability to select specific metrics and time periods.</li>
        </ul>
      </div>
    </FeaturePageLayout>
  );
}

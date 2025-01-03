import React from 'react';
    import SectionHeading from '../../components/common/SectionHeading';
    
    export default function TradeAnalysisPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Trade Analysis"
              description="Gain insights into your trading performance and identify areas for improvement."
              centered
            />
            
            <div className="mt-12">
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
          </div>
        </div>
      );
    }

import React from 'react';
import FeaturePageLayout from './FeaturePageLayout';

export default function BrokerIntegrationPage() {
  return (
    <FeaturePageLayout
      title="Broker Integration"
      description="Connect your broker accounts to the application for automated data import."
      image="/assets/6.png"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Broker Connection: Support for multiple broker accounts.</li>
          <li>Data Synchronization: Automatic import of trades from connected broker accounts.</li>
          <li>Trade Execution: (Optional) Ability to execute trades directly from the application.</li>
        </ul>
      </div>
    </FeaturePageLayout>
  );
}

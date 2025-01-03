import React from 'react';
    import SectionHeading from '../../components/common/SectionHeading';
    
    export default function BrokerIntegrationPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Broker Integration"
              description="Connect your broker accounts to the application for automated data import and potentially trade execution."
              centered
            />
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Broker Connection: Support for multiple broker accounts.</li>
                <li>Data Synchronization: Automatic import of trades from connected broker accounts.</li>
                <li>Trade Execution: (Optional) Ability to execute trades directly from the application.</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

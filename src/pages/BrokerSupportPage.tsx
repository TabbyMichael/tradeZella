import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    const supportedBrokers = [
      {
        name: 'Broker A',
        description: 'A leading online broker with a wide range of trading instruments.',
        link: '#'
      },
      {
        name: 'Broker B',
        description: 'A popular broker known for its user-friendly platform and low fees.',
        link: '#'
      },
      {
        name: 'Broker C',
        description: 'A broker specializing in futures and options trading.',
        link: '#'
      }
    ];
    
    export default function BrokerSupportPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Broker Support"
              description="Find information about supported brokers and integration guides. We're committed to providing you with the best possible trading experience."
              centered
            />
            
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Supported Brokers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {supportedBrokers.map((broker, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{broker.name}</h3>
                    <p className="text-gray-600 mb-4">{broker.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <a href={broker.link} className="text-purple-600 hover:text-purple-700 font-medium">Learn More &gt;</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6">Integration Guides</h2>
              <p className="text-gray-600 mb-4">
                Find step-by-step guides on how to integrate your broker with TradeZella.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition-colors flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Integration Guide A</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition-colors flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Integration Guide B</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

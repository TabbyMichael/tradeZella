import React, { useState } from 'react';
import SectionHeading from '../components/common/SectionHeading';
import { motion } from 'framer-motion';
import FAQ from '../components/common/FAQ';

const supportedBrokers = [
  {
    name: 'Broker A',
    description: 'A leading online broker with a wide range of trading instruments.',
    link: '#',
    logo: '/assets/1.png'
  },
  {
    name: 'Broker B',
    description: 'A popular broker known for its user-friendly platform and low fees.',
    link: '#',
    logo: '/assets/2.png'
  },
  {
    name: 'Broker C',
    description: 'A broker specializing in futures and options trading.',
    link: '#',
    logo: '/assets/3.png'
  },
  {
    name: 'Broker D',
    description: 'A broker with a focus on forex and CFD trading.',
    link: '#',
    logo: '/assets/4.png'
  },
    {
    name: 'Broker E',
    description: 'A broker with a focus on forex and CFD trading.',
    link: '#',
    logo: '/assets/5.png'
  },
    {
    name: 'Broker F',
    description: 'A broker with a focus on forex and CFD trading.',
    link: '#',
    logo: '/assets/6.png'
  },

];

export default function BrokerSupportPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrokers = supportedBrokers.filter(broker =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Broker Support"
          description="Find information about supported brokers and integration guides. We're committed to providing you with the best possible trading experience."
          centered
        />

        <div className="mt-12">
          <div className="flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search for your broker..."
              className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredBrokers.map((broker, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img src={broker.logo} alt={`${broker.name} logo`} className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-center">{broker.name}</h3>
                <p className="text-gray-600 mb-4 text-center">{broker.description}</p>
                <div className="flex justify-center items-center mt-auto">
                  <a href={broker.link} className="text-purple-600 hover:text-purple-700 font-medium">Learn More &gt;</a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Integration Guides</h2>
          <p className="text-gray-600 mb-8 text-center">
            Find step-by-step guides on how to integrate your broker with TradeZella.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center text-lg">
              <span className="text-gray-700 font-medium mr-2">Integration Guide A</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </a>
            <a href="#" className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center text-lg">
              <span className="text-gray-700 font-medium mr-2">Integration Guide B</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13..5" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-16">
          <FAQ />
        </div>
      </div>
    </div>
  );
}

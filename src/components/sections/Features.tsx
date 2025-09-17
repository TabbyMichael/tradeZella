import React from 'react';
import SectionHeading from '../common/SectionHeading';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Automated Journaling',
    description: 'Easy methods like broker sync, file upload, or even manual trade adds. Everything is automated.',
    image: '/assets/1.png',
    link: '/features/journaling'
  },
  {
    title: 'Trade Analysis',
    description: 'Instantly switch between 20 different trading accounts to stay on top of your progress.',
    image: '/assets/2.png',
    link: '/features/analysis'
  },
  {
    title: 'Reporting',
    description: 'No more manual calculations. We\'ll automatically present your trading stats in an easy way',
    image: '/assets/3.png',
    link: '/features/reporting'
  },
  {
    title: 'Playbooks',
    description: 'Create playbooks to stay on top of your trading strategy and rules.',
    image: '/assets/4.png',
    link: '/features/playbooks'
  },
  {
    title: 'Backtesting',
    description: 'Test your trading strategies on historical data.',
    image: '/assets/5.png',
    link: '/features/backtesting'
  },
  {
    title: 'Broker Integration',
    description: 'Connect your broker accounts to the application for automated data import.',
    image: '/assets/6.png',
    link: '/features/broker-integration'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="1"
          label="CORE FEATURES"
          title={<>Explore our <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">Powerful Features</span></>}
          description="Discover the tools that will help you become a profitable trader."
          centered
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative">
                <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-50 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                <Link to={feature.link} className="font-medium text-purple-600 hover:text-purple-700 flex items-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

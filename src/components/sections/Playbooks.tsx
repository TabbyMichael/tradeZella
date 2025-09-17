import React from 'react';
import SectionHeading from '../common/SectionHeading';

export default function Playbooks() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="4"
          label="PLAYBOOKS"
          title={<>Do you have a <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">Profitable Strategy</span>?</>}
          description="Create playbooks to stay on top of your trading strategy and rules. Discover if your strategy is working with for you."
          centered
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Set & track your strategy rules</h3>
            <img 
              src="/assets/4.png"
              alt="Strategy Rules"
              className="rounded-lg w-full"
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analyze your strategies performance over time</h3>
            <img 
              src="/assets/5.png"
              alt="Strategy Performance"
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

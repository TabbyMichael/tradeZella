import React from 'react';
import SectionHeading from '../common/SectionHeading';

export default function Analysis() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="2"
          label="TRADE ANALYSIS"
          title={<>Analyze your trading <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">stats</span></>}
          description="Take a moment to understand what mistakes you made, if you risked more than planned, and more trade specific stats."
          centered
        />

        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80" 
              alt="Trading Analysis Dashboard"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';

const reports = [
  {
    title: 'Dive deeper into your strategy',
    description: 'Over 50+ reports to help you visualize your trading performance.',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Understand your trading behaviors',
    description: 'Gain key insights in your trading behaviors by digging deeper into over 50+ reports.',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Get a summary of whats working for you',
    description: 'Curated summaries for you to understand your strengths and weaknesses as a trader.',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80'
  }
];

export default function Reports() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="3"
          label="DATA-DRIVEN REPORTS"
          title={<>Gain key <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">insights</span>.</>}
          description="Leverage 50+ reports to monitor your trading progress, understand your strengths or weaknesses, and improve your trading strategy."
          centered
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {reports.map((report, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">{report.title}</h3>
              <p className="mb-8">{report.description}</p>
              <img 
                src={report.image} 
                alt={report.title}
                className="rounded-lg w-full"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="gradient">Get Started Now &gt;</Button>
        </div>
      </div>
    </section>
  );
}

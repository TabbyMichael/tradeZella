import React from 'react';
import SectionHeading from '../common/SectionHeading';

const features = [
  {
    title: 'Automated Journaling',
    description: 'Easy methods like broker sync, file upload, or even manual trade adds. Everything is automated.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-pink-600 to-purple-600'
  },
  {
    title: 'Connect 20+ Accounts',
    description: 'Instantly switch between 20 different trading accounts to stay on top of your progress.',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-purple-600 to-blue-600'
  },
  {
    title: 'Automated Statistics',
    description: 'No more manual calculations. We\'ll automatically present your trading stats in an easy way',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-blue-600 to-indigo-600'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="1"
          label="AUTOMATED JOURNALING"
          title={<>Powerful and Automated <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">Trade Journaling</span></>}
          description="You focus on trading while we focus on helping you get better. With automated journaling, we do the heavy lifting for you."
          centered
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`rounded-2xl overflow-hidden bg-gradient-to-r ${feature.gradient} p-8 text-white`}
            >
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    export default function AboutPage() {
      return (
        <div className="py-24 bg-white dark:bg-navy-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Our Story"
              description="TradeZella was founded with the mission to empower traders with the tools and insights they need to succeed. We believe that every trader has the potential to be profitable, and we're here to help them unlock that potential."
              centered
            />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold dark:text-white">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To provide traders with the most comprehensive and user-friendly platform for journaling, analysis, and improvement.
                </p>
                
                <h3 className="text-2xl font-bold dark:text-white">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To be the leading platform for trader development, helping traders of all levels achieve their financial goals.
                </p>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80" 
                  alt="Team Collaboration" 
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold mb-2 dark:text-white">Innovation</h4>
                  <p className="text-gray-600 dark:text-gray-400">We are constantly seeking new ways to improve our platform and help our users.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold mb-2 dark:text-white">Transparency</h4>
                  <p className="text-gray-600 dark:text-gray-400">We believe in open communication and honest practices.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold mb-2 dark:text-white">User-Centricity</h4>
                  <p className="text-gray-600 dark:text-gray-400">Our users are at the heart of everything we do.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold mb-2 dark:text-white">Excellence</h4>
                  <p className="text-gray-600 dark:text-gray-400">We strive for the highest standards in all aspects of our work.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    const forumCategories = [
      {
        title: 'General Trading',
        description: 'Discuss general trading topics, strategies, and market analysis.',
        link: '#'
      },
      {
        title: 'Strategy Discussion',
        description: 'Share and discuss your trading strategies with other traders.',
        link: '#'
      },
      {
        title: 'Platform Feedback',
        description: 'Provide feedback on the TradeZella platform and suggest new features.',
        link: '#'
      },
      {
        title: 'Technical Support',
        description: 'Get help with technical issues and platform-related questions.',
        link: '#'
      }
    ];
    
    export default function CommunityPage() {
      return (
        <div className="py-24 bg-white dark:bg-navy-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Community Forum"
              description="Connect with other traders, share your ideas, and discuss trading strategies. Join our community and become part of the TradeZella family."
              centered
            />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {forumCategories.map((category, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{category.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <a href={category.link} className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">Join Discussion &gt;</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

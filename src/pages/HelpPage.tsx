import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    const helpArticles = [
      {
        title: 'Getting Started with TradeZella',
        description: 'Learn how to create an account, set up your profile, and start using the platform.',
        link: '#'
      },
      {
        title: 'How to Use the Journaling Feature',
        description: 'Discover how to use the journaling feature to track your trades and improve your performance.',
        link: '#'
      },
      {
        title: 'Analyzing Your Trading Data',
        description: 'Learn how to use the analysis tools to gain insights into your trading performance.',
        link: '#'
      },
      {
        title: 'Backtesting Your Trading Strategies',
        description: 'Discover how to use the backtesting feature to test your trading strategies.',
        link: '#'
      },
      {
        title: 'Troubleshooting Common Issues',
        description: 'Find solutions to common issues you may encounter while using the platform.',
        link: '#'
      }
    ];
    
    export default function HelpPage() {
      return (
        <div className="py-24 bg-white dark:bg-navy-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Help Center"
              description="Find articles, tutorials, and guides to help you get the most out of TradeZella. If you can't find what you're looking for, please contact our support team."
              centered
            />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {helpArticles.map((article, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{article.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <a href={article.link} className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">Read More &gt;</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    const pressReleases = [
      {
        title: 'TradeZella Announces New Partnership with Leading Broker',
        date: 'May 15, 2024',
        link: '#',
        description: 'TradeZella is excited to announce a new partnership with a leading broker, expanding our reach and providing more value to our users.',
        image: 'https://images.unsplash.com/photo-1590283603948-42461b357991?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'TradeZella Launches New Feature for Automated Journaling',
        date: 'April 20, 2024',
        link: '#',
        description: 'TradeZella has launched a new feature that automates the journaling process, making it easier for traders to track their progress and improve their performance.',
        image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'TradeZella Secures Seed Funding to Accelerate Growth',
        date: 'March 10, 2024',
        link: '#',
        description: 'TradeZella has secured seed funding to accelerate its growth and expand its platform, bringing more innovative tools to traders worldwide.',
        image: 'https://images.unsplash.com/photo-1517245386804-1111d2e49814?auto=format&fit=crop&w=400&q=80'
      }
    ];
    
    const mediaMentions = [
      {
        title: 'TradeZella Featured in Top Trading Magazine',
        date: 'June 1, 2024',
        link: '#',
        source: 'Trading Magazine',
        description: 'TradeZella was recently featured in a top trading magazine, highlighting our innovative approach to trader development.',
        image: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'CEO Interview on Leading Financial Podcast',
        date: 'May 25, 2024',
        link: '#',
        source: 'Financial Podcast',
        description: 'TradeZella\'s CEO was interviewed on a leading financial podcast, discussing the future of trading and the role of technology in trader success.',
        image: 'https://images.unsplash.com/photo-1590283603948-42461b357991?auto=format&fit=crop&w=400&q=80'
      }
    ];
    
    export default function PressPage() {
      return (
        <div className="py-24 bg-white dark:bg-navy-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Press & Media"
              description="Stay up-to-date with the latest news and media coverage about TradeZella. We're committed to transparency and sharing our progress with the world."
              centered
            />
            
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">Press Releases</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pressReleases.map((release, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
                    <img src={release.image} alt={release.title} className="rounded-t-lg mb-4 h-48 w-full object-cover" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 dark:text-white">{release.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{release.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{release.date}</span>
                      <a href={release.link} className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">Read More &gt;</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">Media Mentions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mediaMentions.map((mention, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
                    <img src={mention.image} alt={mention.title} className="rounded-t-lg mb-4 h-48 w-full object-cover" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 dark:text-white">{mention.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{mention.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{mention.date} - {mention.source}</span>
                      <a href={mention.link} className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">Read More &gt;</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">Brand Assets</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Download our brand assets for media use.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium mr-2">Download Logo</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium mr-2">Download Images</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

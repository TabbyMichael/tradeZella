import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    const blogPosts = [
      {
        title: '5 Proven Strategies to Improve Your Trading Performance',
        date: 'June 10, 2024',
        author: 'John Doe',
        link: '#',
        description: 'Learn five proven strategies that can help you improve your trading performance and achieve your financial goals.',
        image: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'The Importance of Journaling in Trading',
        date: 'May 28, 2024',
        author: 'Jane Smith',
        link: '#',
        description: 'Discover why journaling is an essential practice for traders and how it can help you identify your strengths and weaknesses.',
        image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'How to Use TradeZella to Analyze Your Trading Data',
        date: 'May 15, 2024',
        author: 'Mike Johnson',
        link: '#',
        description: 'Learn how to use TradeZella to analyze your trading data and gain valuable insights into your trading performance.',
        image: 'https://images.unsplash.com/photo-1517245386804-1111d2e49814?auto=format&fit=crop&w=400&q=80'
      }
    ];
    
    export default function BlogPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Our Blog"
              description="Stay up-to-date with the latest trading insights, market analysis, and product updates from TradeZella. We're committed to providing you with the knowledge and tools you need to succeed."
              centered
            />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col">
                  <img src={post.image} alt={post.title} className="rounded-t-lg mb-4 h-48 w-full object-cover" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-700 font-medium">{post.date} - {post.author}</span>
                    <a href={post.link} className="text-purple-600 hover:text-purple-700 font-medium">Read More &gt;</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

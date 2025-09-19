import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    const storeLocations = [
      {
        name: 'TradeZella Store - New York',
        address: '123 Main Street, New York, NY 10001',
        phone: '+1 (212) 555-1234',
        hours: 'Mon-Fri: 9am-6pm, Sat: 10am-4pm',
        mapLink: '#'
      },
      {
        name: 'TradeZella Store - Los Angeles',
        address: '456 Oak Avenue, Los Angeles, CA 90001',
        phone: '+1 (310) 555-5678',
        hours: 'Mon-Fri: 10am-7pm, Sat: 11am-5pm',
        mapLink: '#'
      },
      {
        name: 'TradeZella Store - Chicago',
        address: '789 Pine Street, Chicago, IL 60601',
        phone: '+1 (312) 555-9012',
        hours: 'Mon-Fri: 9am-5pm, Sat: Closed',
        mapLink: '#'
      }
    ];
    
    export default function StoresPage() {
      return (
        <div className="py-24 bg-white dark:bg-navy-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Store Locator"
              description="Find a TradeZella store near you. We have locations in major cities across the country."
              centered
            />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {storeLocations.map((store, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{store.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{store.address}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>Phone:</strong> {store.phone}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4"><strong>Hours:</strong> {store.hours}</p>
                  <div className="flex justify-between items-center mt-4">
                    <a href={store.mapLink} className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">View on Map &gt;</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

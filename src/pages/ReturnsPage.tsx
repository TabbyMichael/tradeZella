import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    export default function ReturnsPage() {
      return (
        <div className="py-24 bg-white dark:bg-navy-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Return Policy"
              description="We want you to be completely satisfied with your TradeZella subscription. If you're not, please review our return policy below."
              centered
            />
            
            <div className="mt-12 space-y-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Eligibility for Refunds</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Refunds are available for subscriptions canceled within 30 days of the initial purchase.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Timeframe for Returns</h2>
              <p className="text-gray-600 dark:text-gray-400">
                You must request a refund within 30 days of your initial purchase.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Process for Returns</h2>
              <p className="text-gray-600 dark:text-gray-400">
                To request a refund, please contact our support team at <a href="mailto:support@tradezella.com" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">support@tradezella.com</a> with your order details.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Exceptions</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Refunds are not available for subscriptions canceled after 30 days of the initial purchase.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-400">
                If you have any questions about our return policy, please contact our support team at <a href="mailto:support@tradezella.com" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">support@tradezella.com</a>.
              </p>
            </div>
          </div>
        </div>
      );
    }

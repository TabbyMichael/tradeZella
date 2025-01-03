import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    export default function CookiesPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Cookie Policy"
              description="This policy explains how we use cookies and other tracking technologies on the TradeZella platform."
              centered
            />
            
            <div className="mt-12 space-y-6">
              <h2 className="text-2xl font-bold mb-4">What are Cookies?</h2>
              <p className="text-gray-600">
                Cookies are small text files that are stored on your device when you visit a website. They are used to remember your preferences and track your activity.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Types of Cookies</h2>
              <p className="text-gray-600">
                We use the following types of cookies:
                <ul className="list-disc list-inside mt-2">
                  <li><strong>Essential Cookies:</strong> These cookies are necessary for the platform to function properly.</li>
                  <li><strong>Performance Cookies:</strong> These cookies help us understand how you use the platform and improve its performance.</li>
                  <li><strong>Advertising Cookies:</strong> These cookies are used to show you relevant ads.</li>
                </ul>
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Purpose of Cookies</h2>
              <p className="text-gray-600">
                We use cookies to:
                <ul className="list-disc list-inside mt-2">
                  <li>Remember your preferences</li>
                  <li>Track your activity</li>
                  <li>Improve the platform's performance</li>
                  <li>Show you relevant ads</li>
                </ul>
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Cookie Management</h2>
              <p className="text-gray-600">
                You can manage or disable cookies in your browser settings. Please note that disabling cookies may affect the functionality of the platform.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600">
                We may use third-party cookies to provide certain features or services.
              </p>
            </div>
          </div>
        </div>
      );
    }

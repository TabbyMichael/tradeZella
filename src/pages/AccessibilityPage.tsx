import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    export default function AccessibilityPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Accessibility"
              description="We are committed to making the TradeZella platform accessible to everyone, including users with disabilities. We are continuously working to improve the accessibility of our platform."
              centered
            />
            
            <div className="mt-12 space-y-6">
              <h2 className="text-2xl font-bold mb-4">Accessibility Standards</h2>
              <p className="text-gray-600">
                We strive to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Features for Accessibility</h2>
              <p className="text-gray-600">
                We have implemented the following features to improve accessibility:
                <ul className="list-disc list-inside mt-2">
                  <li>Keyboard navigation</li>
                  <li>Screen reader compatibility</li>
                  <li>Alternative text for images</li>
                  <li>Clear and consistent layout</li>
                </ul>
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions or feedback about the accessibility of our platform, please contact our support team at <a href="mailto:support@tradezella.com" className="text-purple-600 hover:text-purple-700">support@tradezella.com</a>.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Ongoing Efforts</h2>
              <p className="text-gray-600">
                We are continuously working to improve the accessibility of our platform and welcome your feedback.
              </p>
            </div>
          </div>
        </div>
      );
    }

import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    export default function PrivacyPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Privacy Policy"
              description="We are committed to protecting your privacy. Please read our privacy policy carefully to understand how we collect, use, and protect your data."
              centered
            />
            
            <div className="mt-12 space-y-6">
              <h2 className="text-2xl font-bold mb-4">Data Collection</h2>
              <p className="text-gray-600">
                We collect personal information such as your name, email address, and payment information when you create an account or make a purchase. We also collect usage data such as your trading activity and platform interactions.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Data Usage</h2>
              <p className="text-gray-600">
                We use your data to provide you with the services you requested, to improve our platform, and to communicate with you about updates and promotions.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Data Protection</h2>
              <p className="text-gray-600">
                We take reasonable measures to protect your data from unauthorized access, use, or disclosure.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Data Sharing</h2>
              <p className="text-gray-600">
                We may share your data with third-party service providers who help us operate our platform. We will not sell your data to third parties.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">User Rights</h2>
              <p className="text-gray-600">
                You have the right to access, correct, or delete your personal information. You can also opt out of receiving promotional emails.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Cookie Policy</h2>
              <p className="text-gray-600">
                Please see our <a href="/cookies" className="text-purple-600 hover:text-purple-700">Cookie Policy</a> for more information about how we use cookies.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about our privacy policy, please contact our support team at <a href="mailto:support@tradezella.com" className="text-purple-600 hover:text-purple-700">support@tradezella.com</a>.
              </p>
            </div>
          </div>
        </div>
      );
    }

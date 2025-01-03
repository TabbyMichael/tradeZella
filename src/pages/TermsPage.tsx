import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    export default function TermsPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Terms of Service"
              description="Please read these terms of service carefully before using the TradeZella platform. By using the platform, you agree to these terms."
              centered
            />
            
            <div className="mt-12 space-y-6">
              <h2 className="text-2xl font-bold mb-4">User Responsibilities</h2>
              <p className="text-gray-600">
                You are responsible for maintaining the confidentiality of your account and password. You agree to use the platform only for lawful purposes.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              <p className="text-gray-600">
                All content and trademarks on the platform are owned by TradeZella. You may not use our content or trademarks without our permission.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-gray-600">
                TradeZella is not liable for any damages or losses resulting from your use of the platform.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <p className="text-gray-600">
                These terms are governed by the laws of the State of California.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p className="text-gray-600">
                We may update these terms from time to time. We will notify you of any changes by posting the new terms on the platform.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Termination of Account</h2>
              <p className="text-gray-600">
                We may terminate your account if you violate these terms.
              </p>
            </div>
          </div>
        </div>
      );
    }

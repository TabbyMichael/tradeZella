import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    export default function PricingPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Pricing"
              description="Choose the plan that's right for you. We offer flexible subscription options to meet your needs."
              centered
            />
            
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Subscription Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-2">Basic</h3>
                  <p className="text-gray-600 mb-4">
                    Ideal for beginners.
                  </p>
                  <p className="text-2xl font-bold mb-4">$19/month</p>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Access to basic features</li>
                    <li>Limited trade journaling</li>
                    <li>Basic reporting</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-2">Pro</h3>
                  <p className="text-gray-600 mb-4">
                    For serious traders.
                  </p>
                  <p className="text-2xl font-bold mb-4">$49/month</p>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Access to all features</li>
                    <li>Unlimited trade journaling</li>
                    <li>Advanced reporting</li>
                    <li>Playbooks</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-2">Premium</h3>
                  <p className="text-gray-600 mb-4">
                    For professional traders.
                  </p>
                  <p className="text-2xl font-bold mb-4">$99/month</p>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Access to all features</li>
                    <li>Unlimited trade journaling</li>
                    <li>Advanced reporting</li>
                    <li>Playbooks</li>
                    <li>Backtesting</li>
                    <li>Priority support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    import Button from '../components/common/Button';
    
    export default function PartnersPage() {
      return (
        <div className="py-24 bg-white dark:bg-navy-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Partner Program"
              description="Join our partner program and earn commissions by referring new users to TradeZella. We provide you with the resources and support you need to succeed."
              centered
            />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 dark:text-white">Program Benefits</h2>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Earn competitive commissions for every new user you refer.</li>
                  <li>Access to marketing materials and resources.</li>
                  <li>Dedicated partner support.</li>
                  <li>Track your progress and earnings through our partner portal.</li>
                </ul>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80" 
                  alt="Partner Program" 
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">Eligibility Requirements</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                To become a partner, you must have a website or social media presence related to trading or finance.
              </p>
              
              <h2 className="text-3xl font-bold mb-6 dark:text-white">Application Process</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                To apply for the partner program, please fill out the form below. We will review your application and contact you within 7 business days.
              </p>
              
              <Button variant="gradient">
                <a href="#">Apply Now &gt;</a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

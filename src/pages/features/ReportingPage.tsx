import React from 'react';
    import SectionHeading from '../../components/common/SectionHeading';
    
    export default function ReportingPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Reporting"
              description="Generate comprehensive reports on your trading activity and performance."
              centered
            />
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Pre-built Reports: Daily, weekly, monthly, and yearly performance reports.</li>
                <li>Customizable Reports: Ability to select specific data points for reports.</li>
                <li>Report Export: Export reports in PDF, CSV, Excel, or other common formats.</li>
                <li>Report Sharing: Ability to share reports with other users or stakeholders.</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

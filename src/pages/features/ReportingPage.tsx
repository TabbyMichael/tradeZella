import React from 'react';
import FeaturePageLayout from './FeaturePageLayout';

export default function ReportingPage() {
  return (
    <FeaturePageLayout
      title="Reporting"
      description="No more manual calculations. We'll automatically present your trading stats in an easy way."
      image="/assets/3.png"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Pre-built Reports: Daily, weekly, monthly, and yearly performance reports.</li>
          <li>Customizable Reports: Ability to select specific data points for reports.</li>
          <li>Report Export: Export reports in PDF, CSV, Excel, or other common formats.</li>
          <li>Report Sharing: Ability to share reports with other users or stakeholders.</li>
        </ul>
      </div>
    </FeaturePageLayout>
  );
}

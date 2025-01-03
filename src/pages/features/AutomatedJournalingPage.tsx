import React from 'react';
    import SectionHeading from '../../components/common/SectionHeading';
    
    export default function AutomatedJournalingPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Automated Journaling"
              description="Automatically record and organize your trading activity, reducing manual effort and ensuring data accuracy."
              centered
            />
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Broker Sync: Automatically import trades from connected broker accounts.</li>
                <li>File Upload: Support for CSV, Excel, or other common trade data file formats.</li>
                <li>Manual Trade Entry: Form for entering trade details.</li>
                <li>Trade Editing: Ability to edit or delete existing trades.</li>
                <li>Trade Tagging: Ability to add custom tags to trades for categorization.</li>
                <li>Trade Notes: Rich text editor for adding detailed notes to trades.</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

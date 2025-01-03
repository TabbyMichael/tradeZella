import React from 'react';
    import SectionHeading from '../../components/common/SectionHeading';
    
    export default function PlaybooksPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Playbooks"
              description="Define and track your trading strategies and rules."
              centered
            />
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Playbook Creation: Form for defining trading strategies and rules.</li>
                <li>Playbook Tracking: Ability to track trades that match a specific playbook.</li>
                <li>Playbook Editing: Ability to edit or delete existing playbooks.</li>
                <li>Playbook Sharing: Ability to share playbooks with other users.</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

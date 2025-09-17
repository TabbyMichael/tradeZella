import React from 'react';
import FeaturePageLayout from './FeaturePageLayout';

export default function PlaybooksPage() {
  return (
    <FeaturePageLayout
      title="Playbooks"
      description="Create playbooks to stay on top of your trading strategy and rules."
      image="/assets/4.png"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Playbook Creation: Form for defining trading strategies and rules.</li>
          <li>Playbook Tracking: Ability to track trades that match a specific playbook.</li>
          <li>Playbook Editing: Ability to edit or delete existing playbooks.</li>
          <li>Playbook Sharing: Ability to share playbooks with other users.</li>
        </ul>
      </div>
    </FeaturePageLayout>
  );
}

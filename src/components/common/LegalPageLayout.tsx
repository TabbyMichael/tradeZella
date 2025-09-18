import React from 'react';
import SectionHeading from './SectionHeading';

interface LegalPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, description, children }: LegalPageLayoutProps) {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={title}
          description={description}
          centered
        />
        <div className="mt-12 prose lg:prose-xl max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}

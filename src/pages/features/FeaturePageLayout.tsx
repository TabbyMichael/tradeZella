import React from 'react';

interface FeaturePageLayoutProps {
  title: string;
  description: string;
  image: string;
  children: React.ReactNode;
}

const FeaturePageLayout: React.FC<FeaturePageLayoutProps> = ({ title, description, image, children }) => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">{description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {children}
      </div>
    </div>
  );
};

export default FeaturePageLayout;

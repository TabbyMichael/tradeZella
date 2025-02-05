import React from 'react';

interface SectionHeadingProps {
  number?: string;
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({ 
  number, 
  label, 
  title, 
  description, 
  centered = false,
  className = ''
}: SectionHeadingProps) {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      {number && (
        <span className="text-8xl font-light text-purple-100 opacity-50">
          {number}
        </span>
      )}
      {label && (
        <div className="text-sm font-medium tracking-wider text-purple-600 uppercase mb-2">
          {label}
        </div>
      )}
      <h2 className="text-4xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-gray-600 max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
}

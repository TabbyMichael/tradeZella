import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'gradient';
  className?: string;
  onClick?: () => void;
}

export default function Button({ children, variant = 'primary', className = '', onClick }: ButtonProps) {
  const baseStyles = 'px-6 py-2.5 rounded-md font-medium transition-all duration-200';
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    gradient: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

import React from 'react';
    
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'gradient';
  className?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-6 py-2.5 rounded-md font-medium transition-all duration-200';
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    gradient: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? disabledStyles : ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
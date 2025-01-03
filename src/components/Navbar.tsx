import React from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import Button from './common/Button';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-bold">TradeZella</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                Resources <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                Features <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900">Pricing</a>
            <a href="#support" className="text-gray-700 hover:text-gray-900">Broker Support</a>
            <a href="#login" className="text-gray-700 hover:text-gray-900">Log In</a>
            <Button variant="gradient">Get Started &gt;</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

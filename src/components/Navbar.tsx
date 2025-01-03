import React, { useState } from 'react';
    import { BookOpen, ChevronDown } from 'lucide-react';
    import Button from './common/Button';
    import AuthModal from './AuthModal';
    import { Link } from 'react-router-dom';
    
    const resourcesLinks = [
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Community Forum', href: '/community' },
    ];
    
    const featuresLinks = [
      { label: 'Automated Journaling', href: '/features/journaling' },
      { label: 'Trade Analysis', href: '/features/analysis' },
      { label: 'Reporting', href: '/features/reporting' },
      { label: 'Playbooks', href: '/features/playbooks' },
      { label: 'Backtesting', href: '/features/backtesting' },
      { label: 'Broker Integration', href: '/features/broker-integration' },
    ];
    
    export default function Navbar() {
      const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
      const [isResourcesOpen, setIsResourcesOpen] = useState(false);
      const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
    
      const handleGetStartedClick = () => {
        setIsAuthModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsAuthModalOpen(false);
      };
    
      const toggleResources = () => {
        setIsResourcesOpen(!isResourcesOpen);
        setIsFeaturesOpen(false);
      };
    
      const toggleFeatures = () => {
        setIsFeaturesOpen(!isFeaturesOpen);
        setIsResourcesOpen(false);
      };
    
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
                  <button 
                    className="flex items-center text-gray-700 hover:text-gray-900"
                    onClick={toggleResources}
                  >
                    Resources <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {isResourcesOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {resourcesLinks.map((link, index) => (
                        <Link key={index} to={link.href} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative group">
                  <button 
                    className="flex items-center text-gray-700 hover:text-gray-900"
                    onClick={toggleFeatures}
                  >
                    Features <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {isFeaturesOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {featuresLinks.map((link, index) => (
                        <Link key={index} to={link.href} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link to="/pricing" className="text-gray-700 hover:text-gray-900">Pricing</Link>
                <Link to="/broker-support" className="text-gray-700 hover:text-gray-900">Broker Support</Link>
                <a href="#login" className="text-gray-700 hover:text-gray-900">Log In</a>
                <Button variant="gradient" onClick={handleGetStartedClick}>Get Started &gt;</Button>
              </div>
            </div>
          </div>
          <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} />
        </nav>
      );
    }

import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, Sun, Moon } from 'lucide-react';
import Button from './common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './common/ThemeContext';

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
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
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
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 z-50 border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-bold dark:text-white">TradeZella</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={toggleResources}
              >
                Resources <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isResourcesOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {resourcesLinks.map((link, index) => (
                    <Link key={index} to={link.href} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="relative group">
              <button
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={toggleFeatures}
              >
                Features <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isFeaturesOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {featuresLinks.map((link, index) => (
                    <Link key={index} to={link.href} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</Link>
            <Link to="/broker-support" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Broker Support</Link>

            {isAuthenticated ? (
              <>
                <Link to="/trades" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">My Trades</Link>
                <Button variant="secondary" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Log In</Link>
                <Link to="/signup">
                  <Button variant="gradient">Get Started &gt;</Button>
                </Link>
              </>
            )}
          </div>
          <button onClick={toggleTheme} data-testid="theme-switcher" className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

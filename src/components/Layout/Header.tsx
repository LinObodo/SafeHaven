import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Sun, Moon, Type, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, darkMode, fontSize, setDarkMode, setFontSize, logout, quickExit } = useAuthStore();

  const navigation = [
    { name: 'Home', href: '/', public: true },
    { name: 'About', href: '/about', public: true },
    { name: 'Get Help', href: '/help', public: true },
    { name: 'Resources', href: '/resources', public: true },
    { name: 'SafeSpeak', href: '/chat', public: false },
    { name: 'Emergency', href: '/emergency', public: false },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.public || isAuthenticated
  );

  const handleQuickExit = () => {
    quickExit();
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Safe Haven
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-4 xl:space-x-8">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Accessibility Controls */}
            <div className="relative">
              <button
                onClick={() => setShowAccessibility(!showAccessibility)}
                className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Type className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              
              {showAccessibility && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-3 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
                      >
                        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </button>
                    </div>
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Font Size</span>
                      <div className="flex space-x-1 mt-1">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            onClick={() => setFontSize(size as any)}
                            className={`px-2 py-1 text-xs rounded touch-target ${
                              fontSize === size
                                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300 truncate max-w-24 lg:max-w-none">
                  {user?.isAnonymous ? 'Anonymous' : user?.email}
                </span>
                <button
                  onClick={logout}
                  className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white touch-target"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors touch-target"
              >
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1.5 text-gray-600 dark:text-gray-400 touch-target"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="px-3 pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-3 rounded-md text-base font-medium touch-target ${
                  location.pathname === item.href
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile user info */}
            {isAuthenticated && (
              <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3">
                {user?.isAnonymous ? 'Anonymous User' : user?.email}
              </div>
            )}
            
            <button
              onClick={handleQuickExit}
              className="w-full text-left px-3 py-3 text-base font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md touch-target"
            >
              Quick Exit
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
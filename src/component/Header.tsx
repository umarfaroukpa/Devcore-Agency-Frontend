import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ChevronDown, User, LogOut, Settings } from 'lucide-react';

// Header Component - Modern Desktop Design
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' 
          : 'bg-white py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Devcore
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <a 
              href="/" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Home
            </a>
            <a 
              href="/projects" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Projects
            </a>
            <a 
              href="/services" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Services
            </a>
            <a 
              href="/team" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Team
            </a>
            <a 
              href="/about" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              About
            </a>
          </nav>

          {/* Right Side - Auth & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <span className="text-sm font-medium text-gray-700">John Doe</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">john@devcore.com</p>
                    </div>
                    <a href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={16} />
                      Dashboard
                    </a>
                    <a href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings size={16} />
                      Settings
                    </a>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            <a 
              href="/" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Home
            </a>
            <a 
              href="/projects" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Projects
            </a>
            <a 
              href="/services" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Services
            </a>
            <a 
              href="/team" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Team
            </a>
            <a 
              href="/about" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              About
            </a>
            
            <div className="pt-4 space-y-2">
              <a 
                href="/dashboard" 
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/contact"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Get Started
                <ArrowRight size={18} />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ChevronDown, User, LogOut, Settings, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store';

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Use Zustand store - automatically reactive!
  const { user, token, logout } = useAuthStore();
  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Reset state
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    
    // Call Zustand logout (this updates store and localStorage)
    logout();
    
    // Redirect to home
    router.push('/');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return '/dashboard/admin';
      case 'DEVELOPER':
        return '/dashboard/developer';
      case 'CLIENT':
        return '/dashboard/clients';
      default:
        return '/dashboard';
    }
  };

  // Get the home route based on authentication
  const getHomeRoute = () => {
    if (isAuthenticated && user) {
      return getDashboardRoute(user.role);
    }
    return '/';
  };

  // Handle home click with proper navigation
  const handleHomeClick = (e: React.MouseEvent) => {
    if (isAuthenticated && user) {
      e.preventDefault();
      router.push(getDashboardRoute(user.role));
    }
  };

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
          <Link 
            href={getHomeRoute()} 
            className="flex items-center gap-2"
            onClick={handleHomeClick}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Devcore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link 
              href={getHomeRoute()} 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-1"
              onClick={handleHomeClick}
            >
              <Home size={16} />
              {isAuthenticated ? 'Dashboard' : 'Home'}
            </Link>
            <Link 
              href="/projects" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
            >
              Projects
            </Link>
            <Link 
              href="/services" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
            >
              Contact
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
            >
              About
            </Link>
          </nav>

          {/* Right Side - Auth & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-900 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName || user.email}
                  </span>
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
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-full">
                          {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role}
                        </span>
                      </div>
                      <Link
                        href={getDashboardRoute(user.role)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-900 hover:bg-gray-500"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User size={16} />
                        Dashboard
                      </Link>
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-900 hover:bg-gray-500"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={16} />
                        Profile Settings
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-500 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium hover:text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
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
            <Link 
              href={getHomeRoute()} 
              className="flex items-center gap-2 px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={(e) => {
                setIsMenuOpen(false);
                handleHomeClick(e);
              }}
            >
              <Home size={18} />
              {isAuthenticated ? 'Dashboard' : 'Home'}
            </Link>
            <Link 
              href="/projects" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href="/services" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            
            <div className="pt-4 space-y-2">
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role}
                    </span>
                  </div>
                  <Link 
                    href={getDashboardRoute(user.role)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile"
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                    <ArrowRight size={18} />
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
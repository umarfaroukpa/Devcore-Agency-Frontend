'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/api';
import { useAuthStore } from '../../lib/store';
import GoogleSignInButton from '../../component/GoogleSignInButton';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
  // This prevents clearing data when redirected from pending approval page
  const hasPendingUser = localStorage.getItem('pendingUser');
  
  if (!hasPendingUser) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In your login page handleSubmit function, update the error handling:

// Update your handleSubmit function in the login page to this:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setIsLoading(true);
  setErrors({});

  try {
    const response = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password
    });

    console.log('✅ Login response:', response.data);

    if (response.data.success && response.data.token) {
       const { user, token } = response.data;
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('✅ Stored token and user data');

      // Use Zustand store - this will update all components automatically!
        setAuth(user, token);


      // Redirect based on role
      const role = response.data.user.role;
      if (role === 'CLIENT') {
        router.push('/dashboard/clients');
      } else if (role === 'DEVELOPER') {
        router.push('/dashboard/developer');
      } else if (role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (role === 'SUPER_ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
    }
    } else {
      setErrors({ form: 'Login failed. Please try again.' });
    }                                           
  } catch (err: any) {
    console.error('❌ Login error:', err);
    console.log('Error response:', err.response);
    
    // Check if this is a "needs approval" error (403 with needsApproval flag)
    if (err.response?.status === 403) {
      // Check if it's a pending approval error
      if (err.response?.data?.needsApproval === true) {
        console.log('⏳ Account pending approval');
        const userData = err.response.data.user;
        localStorage.setItem('pendingUser', JSON.stringify(userData));
        router.push('/pending-approval');
        return;
      }
      
      // Other 403 errors (account deactivated, etc.)
      const errorMessage = err.response?.data?.error || 'Access denied';
      setErrors({ form: errorMessage });
      return;
    }
    
    // Handle other errors
    const errorMessage = 
      err.response?.data?.error || 
      err.response?.data?.message ||
      'Login failed. Please check your credentials.';
    
    setErrors({ form: errorMessage });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center px-6 py-12 mt-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form-level Error */}
            {errors.form && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-red-700 font-medium">{errors.form}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="you@company.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-gray-700 hover:text-gray-900 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold cursor-pointer rounded-xl hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className='mt-6'>
              <GoogleSignInButton />
            </div>
          </form>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-gray-900 hover:text-gray-600 cursor-pointer font-semibold">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
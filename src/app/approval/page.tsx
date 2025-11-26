'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function PendingApprovalPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkApprovalStatus();
  }, []);

  const checkApprovalStatus = () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!userData || !token) {
        // No user data, redirect to login
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Check if user is approved
      if (parsedUser.isApproved === true) {
        // User is approved! Redirect to appropriate dashboard
        const dashboardRoute = getDashboardRoute(parsedUser.role);
        router.push(dashboardRoute);
        return;
      }

      // Check if user is CLIENT (auto-approved)
      if (parsedUser.role === 'CLIENT') {
        router.push('/dashboard/clients');
        return;
      }

      // User is still pending approval
      setChecking(false);
    } catch (error) {
      console.error('Error checking approval status:', error);
      setChecking(false);
    }
  };

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'ADMIN': return '/dashboard/admin';
      case 'DEVELOPER': return '/dashboard/developer';
      case 'CLIENT': return '/dashboard/clients';
      default: return '/';
    }
  };

  // Show loading while checking
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking approval status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          {/* Pending Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="text-orange-600" size={40} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>
          
          <p className="text-gray-600 mb-2">
            Thank you for applying as a <span className="font-semibold text-blue-600">{user?.role}</span>.
          </p>
          <p className="text-gray-600 mb-8">
            Your application is being reviewed by our team.
          </p>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-orange-700 text-sm font-medium mb-8">
            <AlertCircle size={16} />
            Approval Pending
          </div>

          {/* What's Next Section */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-4">What&apos;s Next?</h3>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Our team will review your application within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <span>You&apos;ll receive an email notification once approved</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <span>After approval, you can log in and access your dashboard</span>
              </li>
            </ul>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm">
              <p className="text-gray-600 mb-1">Application Details:</p>
              <p className="text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>
            
            <button
              onClick={checkApprovalStatus}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Check Status Again
            </button>

            <Link
              href="/contact"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Have questions? Contact us
            </Link>
          </div>
        </div>

        {/* Additional Help Card */}
        <div className="mt-6 bg-white/80 backdrop-blur rounded-xl p-4 text-center text-sm text-gray-600">
          <p>
            <strong>Note:</strong> If you believe there&apos;s been an error or need urgent access, 
            please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
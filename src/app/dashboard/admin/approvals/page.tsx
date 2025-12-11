'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function PendingApprovalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkApprovalStatus();
  }, []);

  const checkApprovalStatus = () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('pendingUser');

      if (!userData) {
        console.log('❌ No pending user data found, redirecting to login');
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      console.log('📋 Pending user data:', parsedUser);

      // This page is only for DEVELOPER and ADMIN awaiting approval
      if (parsedUser.role === 'CLIENT') {
        console.log('⚠️ CLIENT should not be on this page, redirecting');
        router.push('/dashboard/clients');
        return;
      }

      // If somehow they have isApproved: true, redirect to login
      if (parsedUser.isApproved === true) {
        console.log('✅ User is approved, redirecting to login');
        localStorage.removeItem('pendingUser');
        router.push('/login');
        return;
      }

      // Stay on pending approval page
      console.log('⏳ User pending approval, displaying page');
      setUser(parsedUser);
    } catch (error) {
      console.error('❌ Error checking approval status:', error);
      router.push('/login');
    }
  };

  const handleCheckAgain = () => {
    // In a real app, you might want to ping an API endpoint here
    // For now, just show a message
    alert('Your application is still being reviewed. You will receive an email once approved. Please try logging in after approval.');
  };

  const handleLogout = () => {
    localStorage.removeItem('pendingUser');
    router.push('/login');
  };

  // Show loading while checking
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-12 py-16">
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
            Thank you for applying as a <span className="font-semibold text-gray-900">{user.role}</span>.
          </p>
          <p className="text-gray-600 mb-8">
            Your application is being reviewed by our team.
          </p>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 text-yellow-600 px-4 py-2 bg-gray-50 border border-gray-300 rounded-full text-gray-700 text-sm font-medium mb-8">
            <AlertCircle size={16} />
            Approval Pending
          </div>

          {/* What's Next Section */}
          <div className="bg-yellow-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-yellow-800 mb-4">What&apos;s Next?</h3>
            <ul className="space-y-3 text-sm text-yellow-800">
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>Our team will review your application within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>You&apos;ll receive an email notification once approved</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>After approval, log in with your credentials to access your dashboard</span>
              </li>
            </ul>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm">
            <p className="text-gray-600 mb-1">Application Details:</p>
            <p className="text-gray-900 font-medium">{user.firstName} {user.lastName || ''}</p>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-500 text-xs mt-2">Role: {user.role}</p>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important:</p>
                <p>Once approved, you can log in using your email and password. You cannot log in until your application is approved.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckAgain}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer font-semibold rounded-xl hover:bg-gray-500 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Clock size={16} />
              Check Status
            </button>

            <Link
              href="/"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>
            
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Close
            </button>
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
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Mail, Shield, Code, CheckCircle, AlertCircle } from 'lucide-react';

interface PendingUser {
  email: string;
  role: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function PendingApprovalPage() {
  const router = useRouter();
  const [registrationData, setRegistrationData] = React.useState<PendingUser | null>(null);

  useEffect(() => {
    // Try to get registration data from localStorage - check both keys
    const storedData = localStorage.getItem('pendingRegistration') || 
                      localStorage.getItem('pendingApproval');
    
    if (!storedData) {
      console.log('No pending registration data found, redirecting to signup');
      router.push('/signup');
      return;
    }

    try {
      const data: PendingUser = JSON.parse(storedData);
      console.log('Found pending registration data:', data);
      setRegistrationData(data);
      
      // Clean up the other key if it exists
      localStorage.removeItem('pendingRegistration');
      localStorage.removeItem('pendingApproval');
      
      // Set the correct key for consistency
      localStorage.setItem('pendingRegistration', storedData);
    } catch (error) {
      console.error('Error parsing pending registration data:', error);
      router.push('/signup');
    }
  }, [router]);

  const handleClearAndRedirect = () => {
    // Clean up all possible keys
    localStorage.removeItem('pendingRegistration');
    localStorage.removeItem('pendingApproval');
    router.push('/login');
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
          
          {/* Icon based on role */}
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6">
            {registrationData.role === 'DEVELOPER' ? (
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Code className="text-white" size={40} />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl flex items-center justify-center">
                <Shield className="text-white" size={40} />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Application Submitted!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your {registrationData.role.toLowerCase()} account is pending admin approval
          </p>

          {/* Status Card */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="text-yellow-600" size={24} />
              <span className="font-semibold text-yellow-800">Awaiting Approval</span>
            </div>
            
            <div className="space-y-3 text-sm text-yellow-700">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{registrationData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Application submitted successfully</span>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="space-y-4 text-left mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm text-gray-700">
                An admin will review your application within 24-48 hours. You'll receive an email notification once your account is approved.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm text-gray-700">
                If you need immediate access, please contact your organization's administrator.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleClearAndRedirect}
              className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              Go to Login
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Return Home
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Questions? Contact support at{" "}
              <a href="mailto:support@devcore.com" className="text-blue-600 hover:underline">
                support@devcore.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
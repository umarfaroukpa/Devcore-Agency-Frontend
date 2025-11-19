'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="text-blue-600" size={40} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Thank you for applying. Your application is being reviewed by our team.
          </p>

          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-4">What&apos;s Next?</h3>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Our team will review your application within 1-2 business days</span>
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

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Have questions? Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
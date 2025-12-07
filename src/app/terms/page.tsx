'use client';

import React from 'react';
import { FileText, AlertCircle, Scale, Shield, Ban } from 'lucide-react';

export default function TermsOfServicePage() {
  const lastUpdated = "December 7, 2024";

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Scale size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-xl text-gray-300">
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Please Read Carefully</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                These Terms of Service constitute a legally binding agreement between you and YourCompany. By accessing or using our platform, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</span>
            Acceptance of Terms
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed ml-11">
            <p>
              By creating an account, accessing, or using YourCompany's project management platform (the "Service"), you agree to comply with and be legally bound by these Terms of Service, whether or not you become a registered user of the services.
            </p>
            <p>
              These terms apply to all users of the Service, including users who are also contributors of content, information, and other materials or services on the platform.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">2</span>
            Description of Service
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed ml-11">
            <p>
              YourCompany provides a cloud-based project management platform that enables teams to collaborate, manage projects, assign tasks, and track progress. The Service includes:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Project and task management tools</li>
              <li>Team collaboration features</li>
              <li>File sharing and document management</li>
              <li>Reporting and analytics</li>
              <li>Third-party integrations</li>
              <li>Mobile and web access</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">3</span>
            User Accounts
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed ml-11">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Account Registration</h3>
              <p>
                To use certain features of the Service, you must register for an account. When you register, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Account Types</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Super Admin:</strong> Full system access and administrative privileges</li>
                <li><strong>Admin:</strong> Can manage users, projects, and organizational settings</li>
                <li><strong>Developer:</strong> Can work on assigned tasks and collaborate on projects</li>
                <li><strong>Client:</strong> Limited access to view projects and communicate with teams</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Account Security</h3>
              <p>
                You must immediately notify us of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to protect your account information.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">4</span>
            Acceptable Use Policy
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed ml-11">
            <p className="font-semibold text-gray-900">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Upload or transmit viruses, malware, or any malicious code</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Engage in any automated use of the system (bots, scrapers, etc.) without permission</li>
              <li>Impersonate any person or entity, or falsely represent your affiliation</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">5</span>
            Intellectual Property Rights
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed ml-11">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Our Content</h3>
              <p>
                The Service and its original content, features, and functionality are owned by YourCompany and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Content</h3>
              <p>
                You retain all rights to any content you submit, post, or display on or through the Service ("Your Content"). By submitting Your Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute Your Content solely for the purpose of providing and improving the Service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Feedback</h3>
              <p>
                Any feedback, comments, or suggestions you provide regarding the Service may be used by us without any obligation to you.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">6</span>
            Payment and Billing
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed ml-11">
            <p>
              If you purchase a paid subscription plan, you agree to pay all fees associated with your plan. Subscription fees are billed in advance on a recurring basis (monthly or annually) and are non-refundable except as required by law or as explicitly stated in our refund policy.
            </p>
            <p>
              We reserve the right to change our pricing at any time. Price changes will be communicated to you at least 30 days in advance and will take effect at the start of your next billing cycle.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">7</span>
            Termination
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed ml-11">
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms of Service.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may do so by contacting our support team or through your account settings.
            </p>
            <p>
              All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">8</span>
            Limitation of Liability
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed ml-11">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="font-semibold text-red-900 mb-2">DISCLAIMER OF WARRANTIES</p>
              <p className="text-sm text-red-800">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
            </div>
            <p>
              In no event shall YourCompany, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, or other intangible losses, resulting from your use of the Service.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">9</span>
            Indemnification
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed ml-11">
            <p>
              You agree to defend, indemnify, and hold harmless YourCompany and its licensees and licensors, and their employees, contractors, agents, officers, and directors from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses arising from:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your use of and access to the Service</li>
              <li>Your violation of any term of these Terms</li>
              <li>Your violation of any third-party right, including intellectual property rights</li>
              <li>Any harm caused to any third party through your use of the Service</li>
            </ul>
          </div>
        </section>

        {/* Section 10 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">10</span>
            Governing Law
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed ml-11">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
            <p>
              Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
          </div>
        </section>

        {/* Section 11 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">11</span>
            Changes to Terms
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed ml-11">
            <p>
              We reserve the right to modify or replace these Terms at any time at our sole discretion. We will provide notice of any material changes by posting the new Terms on this page and updating the "Last updated" date.
            </p>
            <p>
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms. We encourage you to review these Terms periodically.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> <a href="mailto:legal@yourcompany.com" className="text-blue-600 hover:underline">legal@yourcompany.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+1234567890" className="text-blue-600 hover:underline">+1 (234) 567-890</a></p>
            <p><strong>Address:</strong> 123 Business Street, Tech City, TC 12345, United States</p>
          </div>
        </section>
      </div>
    </div>
  );
}
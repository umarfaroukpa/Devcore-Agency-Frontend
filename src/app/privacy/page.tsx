'use client';

import React from 'react';
import { Shield, Eye, Lock, Database, Users, FileText, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 7, 2024";

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl text-blue-100">
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-4 overflow-x-auto">
            <a href="#collection" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
              Information Collection
            </a>
            <a href="#usage" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
              How We Use Data
            </a>
            <a href="#sharing" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
              Data Sharing
            </a>
            <a href="#security" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
              Security
            </a>
            <a href="#rights" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
              Your Rights
            </a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            At <strong>YourCompany</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our project management platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </div>

        {/* Section 1 */}
        <section id="collection" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Database size={20} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
              <p className="leading-relaxed">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Create an account (name, email address, phone number)</li>
                <li>Complete your profile (job title, company name, profile photo)</li>
                <li>Use our services (project data, task information, comments)</li>
                <li>Contact our support team</li>
                <li>Subscribe to our newsletter or marketing communications</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Automatically Collected Information</h3>
              <p className="leading-relaxed">
                When you access our platform, we automatically collect:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Log data (access times, error logs)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Information from Third Parties</h3>
              <p className="leading-relaxed">
                We may receive information from third-party services you connect to our platform, such as GitHub, Google Drive, or Slack, in accordance with their terms of service and privacy policies.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="usage" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Eye size={20} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong>Provide and maintain our services:</strong> Create and manage your account, process transactions, and deliver the features you use</li>
              <li><strong>Improve our platform:</strong> Analyze usage patterns, fix bugs, and develop new features</li>
              <li><strong>Communicate with you:</strong> Send service updates, security alerts, and respond to your inquiries</li>
              <li><strong>Ensure security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
              <li><strong>Marketing:</strong> Send promotional materials (only if you've opted in)</li>
              <li><strong>Legal compliance:</strong> Comply with legal obligations and protect our legal rights</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section id="sharing" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">3. How We Share Your Information</h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              We do not sell your personal information. We may share your information in the following situations:
            </p>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">With Your Consent</h3>
              <p className="leading-relaxed">
                We share your information when you explicitly agree to it, such as when connecting third-party integrations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Within Your Organization</h3>
              <p className="leading-relaxed">
                Information you create or share (projects, tasks, comments) is visible to team members within your organization according to the permissions you set.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Providers</h3>
              <p className="leading-relaxed">
                We work with third-party service providers who help us operate our platform (hosting, analytics, customer support). These providers have access to your information only to perform these tasks on our behalf.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
              <p className="leading-relaxed">
                We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Business Transfers</h3>
              <p className="leading-relaxed">
                If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="security" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Lock size={20} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">4. Data Security</h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong>Encryption:</strong> All data in transit is encrypted using SSL/TLS. Sensitive data at rest is encrypted.</li>
              <li><strong>Access Controls:</strong> Access to personal information is restricted to authorized personnel only.</li>
              <li><strong>Regular Security Audits:</strong> We conduct regular security assessments and penetration testing.</li>
              <li><strong>Secure Infrastructure:</strong> Our servers are hosted in secure, certified data centers.</li>
              <li><strong>Password Protection:</strong> User passwords are hashed using industry-standard algorithms.</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-sm text-yellow-900">
                <strong>Note:</strong> While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="rights" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <FileText size={20} className="text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">5. Your Privacy Rights</h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              Depending on your location, you may have the following rights:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Access</h3>
                <p className="text-sm">Request a copy of your personal information</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Correction</h3>
                <p className="text-sm">Update or correct inaccurate information</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Deletion</h3>
                <p className="text-sm">Request deletion of your information</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Portability</h3>
                <p className="text-sm">Export your data in a structured format</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Objection</h3>
                <p className="text-sm">Object to certain data processing activities</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Restriction</h3>
                <p className="text-sm">Limit how we use your information</p>
              </div>
            </div>

            <p className="leading-relaxed mt-4">
              To exercise these rights, please contact us at <a href="mailto:privacy@yourcompany.com" className="text-blue-600 hover:underline">privacy@yourcompany.com</a>. We will respond to your request within 30 days.
            </p>
          </div>
        </section>

        {/* Section 6 - Additional Sections */}
        <div className="space-y-8 mb-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some features of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete or anonymize your information within 30 days, except where we are required to retain it for legal or regulatory purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Your information may be transferred to and maintained on servers located outside of your country where data protection laws may differ. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.
            </p>
          </section>
        </div>

        {/* Contact Section */}
        <section id="contact" className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> <a href="mailto:privacy@yourcompany.com" className="text-blue-600 hover:underline">privacy@yourcompany.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+1234567890" className="text-blue-600 hover:underline">+1 (234) 567-890</a></p>
            <p><strong>Address:</strong> 123 Business Street, Tech City, TC 12345, United States</p>
          </div>
        </section>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Search, Clock, ChevronRight, Book, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupportPage() {
  const router = useRouter(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I get started with Devcore?',
      answer: 'Getting started is easy! Simply sign up for an account, complete the onboarding process, and you\'ll be ready to create your first project.'
    },
    {
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major currencies, credit cards, PayPal, and bank transfers for enterprise customers.'
    },
    {
      category: 'technical',
      question: 'How do I integrate with my existing tools?',
      answer: 'Devcore offers seamless integrations with popular tools through our API and pre-built connectors. Check our documentation for detailed guides.'
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email, and we\'ll send you instructions to reset your password.'
    }
  ];

  const supportChannels = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      availability: 'Available 24/7',
      action: 'Start Chat',
      color: 'teal'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      availability: 'Response in 24h',
      action: 'Send Email',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for urgent issues',
      availability: 'Mon-Sat, 9AM-9PM WAT',
      action: 'Call Now',
      color: 'purple'
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Browse our comprehensive guides and tutorials',
      availability: 'Always Available',
      action: 'View Docs',
      color: 'green'
    }
  ];

  // Also fixed the dynamic color classes issue
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' }
    };
    return colorMap[color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-r from-gray-500 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">How can we help you?</h1>
          <p className="text-xl text-gray-300 mb-8">
            Search our knowledge base or get in touch with our support team
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get Support</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              const colorClasses = getColorClasses(channel.color);
              return (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-400 hover:shadow-xl transition-all">
                  <div className={`w-12 h-12 ${colorClasses.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={colorClasses.text} size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{channel.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{channel.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock size={14} />
                    <span>{channel.availability}</span>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-gray-500 to-gray-900 text-white cursor-pointer rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                    {channel.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 mb-12">Quick answers to common questions</p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 group">
                <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <ChevronRight className="group-open:rotate-90 transition-transform" size={20} />
                </summary>
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-gray-600">Send us a message and we'll get back to you within a short period of time</p>
          </div>
          
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-900 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-900 outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-900 outline-none"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-900 outline-none"
                  placeholder="Describe your issue..."
                />
              </div>
              <button 
                onClick={() => router.push('/contact')}
                className="w-full py-3 bg-gradient-to-r from-gray-500 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2">
                Send Message
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
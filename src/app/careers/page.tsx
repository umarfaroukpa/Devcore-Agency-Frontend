'use client';

import React, { useState } from 'react';
import { Heart, Clock, MapPin, DollarSign, Trophy, Coffee, Mail, Linkedin, Github, Bell, CheckCircle, Users, Target, Lightbulb, Rocket } from 'lucide-react';

export default function CareersPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    // Here you would typically send this to your backend
    console.log('Email submitted:', email);
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 3000);
  };

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision insurance with mental health support.'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Work when you\'re most productive. We trust our team to manage their time.'
    },
    {
      icon: MapPin,
      title: 'Remote First',
      description: 'Work from anywhere. We provide equipment and home office support.'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pay',
      description: 'Industry-leading salaries with equity options and regular reviews.'
    },
    {
      icon: Trophy,
      title: 'Growth & Learning',
      description: 'Annual learning budget for courses, conferences, and professional development.'
    },
    {
      icon: Coffee,
      title: 'Time Off',
      description: 'Generous PTO, paid parental leave, and company-wide recharge days.'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'We encourage creative thinking and aren\'t afraid to try new approaches.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We believe the best work happens when diverse perspectives come together.'
    },
    {
      icon: Lightbulb,
      title: 'Transparency',
      description: 'We communicate openly and honestly with our team and customers.'
    },
    {
      icon: Rocket,
      title: 'Impact',
      description: 'We measure success by the positive impact we have on our users.'
    }
  ];

  const roleTypes = [
    {
      title: 'Engineering',
      description: 'Full Stack, Frontend, Backend, DevOps',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Design',
      description: 'UI/UX, Product Design, Visual Design',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Product',
      description: 'Product Management, Analytics',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Business',
      description: 'Sales, Marketing, Customer Success',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-500 to-gray-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Build the Future With Us
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            We're building something special. While we don't have open positions right now, we're always looking for exceptional talent to join our journey.
          </p>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <Bell className="text-yellow-300" size={20} />
            <span className="text-sm font-medium">No open positions at the moment • Get notified when we're hiring</span>
          </div>
        </div>
      </div>

      {/* Notify Me Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-blue-600" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay in the Loop</h2>
            <p className="text-gray-600">
              Be the first to know when new positions open up. We'll send you an email with opportunities that match your interests.
            </p>
          </div>

          {!submitted ? (
            <div className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                />
                <button
                  onClick={handleNotifyMe}
                  disabled={!email || !email.includes('@')}
                  className="px-6 py-3 cursor-pointer bg-gray-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Notify Me
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-6 py-3 rounded-xl">
                <CheckCircle size={20} />
                <span className="font-medium">Thanks! We'll notify you when positions open up.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-lg text-gray-600">These principles guide everything we do</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="text-blue-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Types We're Interested In */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Roles We're Looking For</h2>
            <p className="text-lg text-gray-600">When we do hire, these are the types of positions we typically need</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleTypes.map((role, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${role.color}`}></div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{role.title}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
          <p className="text-lg text-gray-600">What you can expect when you join our team</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spontaneous Application CTA */}
      <div className="bg-gradient-to-r from-gray-500 to-gray-900 text-white py-16 px-6 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Think You'd Be a Great Fit?</h2>
          <p className="text-xl text-gray-100 mb-8">
            We're always open to meeting talented people. Send us your resume and tell us why you'd like to work with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@devcore.com?subject=Spontaneous Application"
              className="inline-flex items-center justify-center cursor-pointer gap-2 px-8 py-4 bg-white text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Mail size={20} />
              Send Your Application
            </a>
            <button
              onClick={() => window.scrollTo({ top: 250, behavior: 'smooth' })}
              className="inline-flex items-center justify-center cursor-pointer gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              <Bell size={20} />
              Get Notified
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-100 mb-4">Connect with us</p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://linkedin.com/company/yourcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://github.com/yourcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="mailto:careers@devcore.com"
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
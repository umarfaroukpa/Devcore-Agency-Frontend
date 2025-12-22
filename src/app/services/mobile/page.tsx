'use client';

import React, { useState } from 'react';
import { Smartphone, CheckCircle, ArrowRight, Zap, Users, Globe, Bell, Mail, Phone } from 'lucide-react';

export default function MobileAppDevelopmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const technologies = [
    { name: 'React Native', description: 'Cross-platform mobile development' },
    { name: 'Flutter', description: 'Beautiful native apps' },
    { name: 'iOS Development', description: 'Native Swift applications' },
    { name: 'Android Development', description: 'Native Kotlin/Java apps' },
    { name: 'Firebase', description: 'Backend & authentication' },
    { name: 'Redux & MobX', description: 'State management' }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Native Performance',
      description: 'Smooth, fast apps that feel native on every device'
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Intuitive interfaces designed for mobile users'
    },
    {
      icon: Globe,
      title: 'Cross-Platform',
      description: 'One codebase for iOS and Android'
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Keep users engaged with timely updates'
    }
  ];

  const projects = [
    {
      title: 'Social Media App',
      description: 'Instagram-style photo sharing app with real-time chat, stories, and advanced filters',
      tech: ['React Native', 'Firebase', 'Redux']
    },
    {
      title: 'E-Commerce App',
      description: 'Full-featured shopping app with payment gateway, order tracking, and product reviews',
      tech: ['Flutter', 'Stripe', 'Node.js']
    },
    {
      title: 'Fitness Tracker',
      description: 'Health and fitness app with workout plans, calorie tracking, and progress analytics',
      tech: ['React Native', 'HealthKit', 'Charts']
    }
  ];

  const packages = [
    {
      name: 'MVP',
      price: 'From $8,000',
      description: 'Launch your app idea',
      features: [
        'Single platform (iOS or Android)',
        'Up to 10 screens',
        'Basic functionality',
        'App store deployment',
        '3 months support'
      ]
    },
    {
      name: 'Professional',
      price: 'From $15,000',
      description: 'Full-featured mobile app',
      features: [
        'iOS & Android (cross-platform)',
        'Up to 25 screens',
        'Advanced features',
        'Push notifications',
        'Backend integration',
        '6 months support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Complex mobile solutions',
      features: [
        'Native iOS & Android',
        'Unlimited screens',
        'Custom APIs',
        'Third-party integrations',
        'Offline functionality',
        '12 months support'
      ]
    }
  ];

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    console.log('Form submitted:', formData);
    alert('Thank you! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Smartphone size={16} />
                Mobile App Development
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Build Apps Your Users Will Love
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Native and cross-platform mobile applications for iOS and Android. We create beautiful, fast, and reliable apps that deliver exceptional user experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Get Started
                </a>
                <a
                  href="#packages"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all text-center"
                >
                  View Packages
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-3xl p-6 shadow-lg aspect-[9/16] max-w-xs mx-auto">
                  <div className="h-3 bg-gray-200 rounded-full w-1/3 mx-auto mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-24 bg-gray-100 rounded-xl"></div>
                      <div className="h-24 bg-gray-100 rounded-xl"></div>
                    </div>
                    <div className="h-16 bg-gray-100 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Mobile Development</h2>
            <p className="text-xl text-gray-600">We build apps that users love</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Tech Stack</h2>
            <p className="text-xl text-gray-600">Cutting-edge mobile technologies</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition-all">
                <CheckCircle className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{tech.name}</h3>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Projects */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Build</h2>
            <p className="text-xl text-gray-600">Examples of mobile apps we create</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-6">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Packages</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 ${
                  pkg.popular ? 'border-purple-600 shadow-xl' : 'border-gray-200'
                } hover:shadow-lg transition-all`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="text-3xl font-bold text-purple-600 mb-6">{pkg.price}</div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-colors ${
                    pkg.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600'
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Your App?</h2>
            <p className="text-xl text-purple-100">Tell us about your app idea and we'll get back to you within 24 hours</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                placeholder="+234 800 000 0000"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">App Details</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                placeholder="Tell us about your app idea..."
              ></textarea>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Send Message
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Mail className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Email Us</p>
              <a href="mailto:info@devcore.com" className="text-purple-100 hover:text-white">
                info@devcore.com
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Phone className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Call Us</p>
              <a href="tel:+2348024471928" className="text-purple-100 hover:text-white">
                +234 802 447 1928
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Search, TrendingUp, Link as LinkIcon, MapPin, CheckCircle, ArrowRight, BarChart, Target, Globe, TrendingUpIcon, Mail, Phone, FileText } from 'lucide-react';

export default function SEOPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    goals: ''
  });

  const services = [
    { name: 'Technical SEO Audit', description: 'Comprehensive analysis of website structure and performance' },
    { name: 'Keyword Research', description: 'Strategic keyword identification and competitive analysis' },
    { name: 'On-Page Optimization', description: 'Content optimization, meta tags, and schema markup' },
    { name: 'Link Building', description: 'High-quality backlink acquisition and outreach' },
    { name: 'Local SEO', description: 'Google My Business optimization and local citations' },
    { name: 'Content Strategy', description: 'SEO-driven content creation and optimization' }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Organic Growth',
      description: 'Sustainable traffic increases through search engine rankings'
    },
    {
      icon: Target,
      title: 'Targeted Traffic',
      description: 'Reach the right audience with high-intent keywords'
    },
    {
      icon: BarChart,
      title: 'Performance Tracking',
      description: 'Comprehensive analytics and regular reporting'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Optimize for local, national, and international markets'
    }
  ];

  const metrics = [
    {
      stat: '300%',
      label: 'Traffic Increase',
      description: 'Average organic growth in 6 months'
    },
    {
      stat: '#1',
      label: 'Ranking Target',
      description: 'First-page Google rankings'
    },
    {
      stat: '24/7',
      label: 'Visibility',
      description: 'Continuous search presence'
    }
  ];

  const packages = [
    {
      name: 'Local',
      price: '$800/mo',
      description: 'For small businesses targeting local markets',
      features: [
        'Local SEO optimization',
        'Google My Business management',
        'Basic keyword research (10 keywords)',
        'Monthly performance report',
        'On-page optimization',
        'Citation building'
      ]
    },
    {
      name: 'Growth',
      price: '$1,500/mo',
      description: 'For businesses scaling their online presence',
      features: [
        'Comprehensive SEO audit',
        'Advanced keyword research (50 keywords)',
        'Technical SEO implementation',
        'Content optimization',
        'Link building (10 links/month)',
        'Competitor analysis',
        'Weekly performance updates'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with complex needs',
      features: [
        'Full SEO strategy development',
        'Unlimited keyword research',
        'Advanced technical optimization',
        'International SEO',
        'Dedicated SEO manager',
        'Custom reporting dashboard',
        'Priority support',
        'Competitor monitoring'
      ]
    }
  ];

  const process = [
    {
      step: '1',
      title: 'Discovery & Audit',
      description: 'Comprehensive website analysis and goal setting'
    },
    {
      step: '2',
      title: 'Strategy Development',
      description: 'Custom SEO plan with keyword mapping'
    },
    {
      step: '3',
      title: 'Implementation',
      description: 'Technical optimization and content improvements'
    },
    {
      step: '4',
      title: 'Link Building',
      description: 'Authority building through quality backlinks'
    },
    {
      step: '5',
      title: 'Monitoring',
      description: 'Performance tracking and analytics review'
    },
    {
      step: '6',
      title: 'Optimization',
      description: 'Continuous improvement based on data insights'
    }
  ];

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    console.log('Form submitted:', formData);
    alert('Thank you! Our SEO experts will analyze your website and get back to you with recommendations within 24 hours.');
    setFormData({ name: '', email: '', phone: '', company: '', website: '', goals: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Search size={16} />
                Search Engine Optimization
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Dominate Search Rankings
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Increase your online visibility, drive qualified traffic, and grow your business with our data-driven SEO strategies. From technical audits to content optimization, we deliver measurable results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Get Free SEO Audit
                </a>
                <a
                  href="#packages"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-600 hover:text-green-600 transition-all text-center"
                >
                  View Packages
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[85, 70, 90].map((rank, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-200 to-blue-200 rounded-full flex items-center justify-center text-xs font-bold">
                            #{i + 1}
                          </div>
                          <span className="text-sm text-gray-600">Keyword {i + 1}</span>
                        </div>
                        <div className="text-sm font-semibold text-green-600">+{rank}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Organic Traffic</span>
                      <span className="font-bold text-green-600">↑ 245%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven SEO Results</h2>
            <p className="text-xl text-gray-600">What our SEO strategies deliver</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">{metric.stat}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{metric.label}</h3>
                <p className="text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our SEO Approach</h2>
            <p className="text-xl text-gray-600">Comprehensive strategies for sustainable growth</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our SEO Services</h2>
            <p className="text-xl text-gray-600">End-to-end optimization for maximum impact</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our SEO Process</h2>
            <p className="text-xl text-gray-600">Methodical approach for guaranteed results</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform translate-x-full -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">SEO Packages</h2>
            <p className="text-xl text-gray-600">Choose the right plan for your growth goals</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 ${
                  pkg.popular ? 'border-green-600 shadow-xl' : 'border-gray-200'
                } hover:shadow-lg transition-all`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">{pkg.price}</div>
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
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600'
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
      <section id="contact" className="py-20 px-6 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Get Your Free SEO Audit</h2>
            <p className="text-xl text-green-100">Discover your website's ranking potential</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="Your company"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Goals</label>
                <select
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="">Select your main goal</option>
                  <option value="traffic">Increase Website Traffic</option>
                  <option value="leads">Generate More Leads</option>
                  <option value="sales">Boost Online Sales</option>
                  <option value="branding">Improve Brand Visibility</option>
                  <option value="local">Dominate Local Search</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Get Free SEO Audit
              <ArrowRight size={20} />
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              We'll analyze your website and provide a comprehensive SEO report within 24 hours
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Mail className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Email Us</p>
              <a href="mailto:seo@devcore.com" className="text-green-100 hover:text-white">
                seo@devcore.com
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Phone className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Call Us</p>
              <a href="tel:+2348024471928" className="text-green-100 hover:text-white">
                +234 802 447 1928
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
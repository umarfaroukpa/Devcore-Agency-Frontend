'use client';

import React, { useState } from 'react';
import { BarChart, TrendingUp, Target, PieChart, CheckCircle, ArrowRight, Zap, LineChart, Activity, Filter, Mail, Phone, Download } from 'lucide-react';

export default function GrowthPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    currentMetrics: '',
    goals: ''
  });

  const services = [
    { name: 'Conversion Rate Optimization', description: 'A/B testing, funnel analysis, and optimization strategies' },
    { name: 'Custom Analytics Dashboards', description: 'Real-time KPI tracking and business intelligence' },
    { name: 'User Behavior Analysis', description: 'Heatmaps, session recordings, and user journey mapping' },
    { name: 'ROI Tracking & Attribution', description: 'Multi-channel attribution modeling and campaign analysis' },
    { name: 'Predictive Analytics', description: 'Machine learning models for forecasting and trend analysis' },
    { name: 'Data Pipeline Development', description: 'ETL pipelines and data warehouse integration' }
  ];

  const metrics = [
    {
      icon: TrendingUp,
      title: 'Data-Driven Decisions',
      description: 'Make informed choices with actionable insights from your data'
    },
    {
      icon: Target,
      title: 'Performance Optimization',
      description: 'Continuously improve based on real-time metrics and feedback'
    },
    {
      icon: PieChart,
      title: 'Customer Insights',
      description: 'Understand your audience and personalize experiences'
    },
    {
      icon: Activity,
      title: 'Growth Forecasting',
      description: 'Predict trends and plan for sustainable expansion'
    }
  ];

  const tools = [
    {
      category: 'Analytics Platforms',
      items: ['Google Analytics 4', 'Mixpanel', 'Amplitude', 'Heap'],
      icon: BarChart
    },
    {
      category: 'Testing & Optimization',
      items: ['Optimizely', 'VWO', 'Google Optimize', 'Hotjar'],
      icon: Zap
    },
    {
      category: 'Data Visualization',
      items: ['Tableau', 'Looker Studio', 'Power BI', 'Metabase'],
      icon: LineChart
    }
  ];

  const packages = [
    {
      name: 'Starter',
      price: '$600,/mo',
      description: 'Basic analytics implementation',
      features: [
        'Google Analytics setup',
        'Basic conversion tracking',
        'Monthly performance report',
        '5 key metrics dashboard',
        'Basic A/B testing',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      price: '$1000,/mo',
      description: 'Comprehensive growth strategy',
      features: [
        'Advanced analytics implementation',
        'Custom dashboard development',
        'Weekly performance reviews',
        'A/B testing program',
        'Funnel optimization',
        'User behavior analysis',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Full-scale growth transformation',
      features: [
        'Custom data pipeline development',
        'Predictive analytics models',
        'Real-time monitoring',
        'Dedicated growth team',
        'Executive dashboard',
        'Strategic consulting',
        '24/7 support'
      ]
    }
  ];

  const caseStudies = [
    {
      client: 'E-commerce Retailer',
      challenge: 'Low conversion rate (1.2%)',
      solution: 'Implemented A/B testing and funnel optimization',
      results: 'Increased conversion rate to 3.8% in 3 months'
    },
    {
      client: 'SaaS Platform',
      challenge: 'High churn rate (25% monthly)',
      solution: 'User behavior analysis and personalized onboarding',
      results: 'Reduced churn to 12% and increased LTV by 45%'
    },
    {
      client: 'Fintech Startup',
      challenge: 'Poor user engagement',
      solution: 'Built custom analytics dashboard with real-time metrics',
      results: 'Improved user engagement by 300% in 6 months'
    }
  ];

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    console.log('Form submitted:', formData);
    alert('Thank you! Our growth experts will analyze your needs and provide recommendations within 24 hours.');
    setFormData({ name: '', email: '', phone: '', company: '', currentMetrics: '', goals: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BarChart size={16} />
                Growth & Analytics
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Data-Driven Growth That Scales
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Turn data into your competitive advantage. We help businesses optimize conversions, track ROI, and drive sustainable growth through advanced analytics and strategic insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Start Growing Now
                </a>
                <a
                  href="#packages"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-amber-600 hover:text-amber-600 transition-all text-center"
                >
                  View Solutions
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-amber-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[45, 28, 62].map((value, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Metric {i + 1}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-yellow-600"
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-amber-600">{value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Overall Growth</span>
                      <span className="font-bold text-green-600">↑ 85%</span>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Analytics Matters</h2>
            <p className="text-xl text-gray-600">Transform data into actionable intelligence</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-amber-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{metric.title}</h3>
                  <p className="text-gray-600 text-sm">{metric.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Analytics Stack</h2>
            <p className="text-xl text-gray-600">Industry-leading tools for maximum insights</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-amber-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{tool.category}</h3>
                  <div className="space-y-2">
                    {tool.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Growth Services</h2>
            <p className="text-xl text-gray-600">End-to-end analytics solutions for every stage</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-md transition-all">
                <CheckCircle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven Results</h2>
            <p className="text-xl text-gray-600">Real businesses, real growth</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center mb-6">
                  <Target className="text-amber-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{study.client}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Challenge</h4>
                    <p className="text-sm text-gray-600">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Solution</h4>
                    <p className="text-sm text-gray-600">{study.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Results</h4>
                    <p className="text-sm text-green-600 font-semibold">{study.results}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Growth Packages</h2>
            <p className="text-xl text-gray-600">Choose the right plan for your growth journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 ${
                  pkg.popular ? 'border-amber-600 shadow-xl' : 'border-gray-200'
                } hover:shadow-lg transition-all`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent mb-6">{pkg.price}</div>
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
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:opacity-90'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-amber-600 hover:text-amber-600'
                  }`}
                >
                  Start Growing
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-r from-amber-500 to-yellow-600">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Get Your Growth Audit</h2>
            <p className="text-xl text-amber-100">Discover opportunities to accelerate your business</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="Your company"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Metrics</label>
                <select
                  value={formData.currentMetrics}
                  onChange={(e) => setFormData({ ...formData, currentMetrics: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                >
                  <option value="">Select current analytics level</option>
                  <option value="basic">Basic (Google Analytics)</option>
                  <option value="intermediate">Intermediate (Multiple tools)</option>
                  <option value="advanced">Advanced (Custom dashboards)</option>
                  <option value="none">No analytics in place</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Goals</label>
                <select
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                >
                  <option value="">Select main growth goal</option>
                  <option value="conversion">Increase Conversion Rate</option>
                  <option value="retention">Improve Customer Retention</option>
                  <option value="revenue">Boost Revenue</option>
                  <option value="efficiency">Optimize Marketing Spend</option>
                  <option value="insights">Better Data Insights</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Get Growth Strategy Session
              <ArrowRight size={20} />
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              We'll analyze your current setup and provide a custom growth roadmap within 24 hours
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Mail className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Email Us</p>
              <a href="mailto:growth@devcore.com" className="text-amber-100 hover:text-white">
                growth@devcore.com
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Phone className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Call Us</p>
              <a href="tel:+2348024471928" className="text-amber-100 hover:text-white">
                +234 802 447 1928
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
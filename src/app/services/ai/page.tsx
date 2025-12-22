'use client';

import React, { useState } from 'react';
import { Bot, CheckCircle, ArrowRight, Zap, Clock, DollarSign, Workflow, Mail, Phone } from 'lucide-react';

export default function AIAutomationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const solutions = [
    { name: 'Workflow Automation', description: 'Automate repetitive business processes' },
    { name: 'AI Chatbots', description: '24/7 customer support automation' },
    { name: 'Data Processing', description: 'Extract insights from large datasets' },
    { name: 'Document Analysis', description: 'Automated document processing & extraction' },
    { name: 'Predictive Analytics', description: 'Forecast trends and outcomes' },
    { name: 'Custom AI Models', description: 'Tailored solutions for your business' }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate hours of manual work in minutes'
    },
    {
      icon: DollarSign,
      title: 'Reduce Costs',
      description: 'Cut operational expenses by up to 60%'
    },
    {
      icon: Zap,
      title: 'Increase Efficiency',
      description: 'Process data 10x faster than manual methods'
    },
    {
      icon: Workflow,
      title: 'Smart Workflows',
      description: 'Intelligent automation that adapts and learns'
    }
  ];

  const useCases = [
    {
      title: 'Customer Support Automation',
      description: 'AI chatbot that handles common inquiries, tickets routing, and provides instant responses 24/7',
      benefits: ['90% reduction in response time', 'Handle 1000+ conversations simultaneously', 'Seamless human handoff']
    },
    {
      title: 'Sales Process Automation',
      description: 'Automate lead qualification, follow-ups, scheduling, and CRM updates with intelligent AI assistants',
      benefits: ['2x more qualified leads', 'Automatic meeting scheduling', 'Smart email sequences']
    },
    {
      title: 'Data Entry & Processing',
      description: 'Extract, process, and organize data from documents, emails, and forms automatically',
      benefits: ['99% accuracy rate', '10x faster processing', 'Eliminate manual data entry']
    }
  ];

  const packages = [
    {
      name: 'Starter',
      price: 'From $2,000',
      description: 'Simple automation solutions',
      features: [
        'Single workflow automation',
        'Basic AI chatbot',
        'Email & form automation',
        'Up to 1,000 actions/month',
        '3 months support'
      ]
    },
    {
      name: 'Professional',
      price: 'From $5,000',
      description: 'Advanced AI solutions',
      features: [
        'Multiple workflow automation',
        'Advanced AI chatbot with NLP',
        'Document processing',
        'Up to 10,000 actions/month',
        'Custom integrations',
        '6 months support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Complete AI transformation',
      features: [
        'Unlimited workflow automation',
        'Custom AI models',
        'Predictive analytics',
        'Unlimited actions',
        'Dedicated AI consultant',
        '12 months support'
      ]
    }
  ];

  const benefits = [
    { stat: '70%', label: 'Time Saved', description: 'On repetitive tasks' },
    { stat: '60%', label: 'Cost Reduction', description: 'In operational expenses' },
    { stat: '10x', label: 'Faster Processing', description: 'Than manual methods' }
  ];

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    console.log('Form submitted:', formData);
    alert('Thank you! We\'ll analyze your automation needs and get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Bot size={16} />
                AI Automation
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Work Smarter with AI Automation
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Transform your business with intelligent automation. Save time, reduce costs, and scale efficiently with custom AI solutions powered by cutting-edge technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Get Started
                </a>
                <a
                  href="#packages"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-orange-600 hover:text-orange-600 transition-all text-center"
                >
                  View Packages
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Bot className="text-orange-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-lg"></div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[90, 75, 85].map((width, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-2 bg-gray-200 rounded flex-1">
                          <div 
                            className="h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded"
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Impact on Your Business</h2>
            <p className="text-xl text-gray-600">See what AI automation can do for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="text-5xl font-bold text-orange-600 mb-2">{benefit.stat}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.label}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AI Automation</h2>
            <p className="text-xl text-gray-600">Transform your operations with intelligent solutions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-orange-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our AI Solutions</h2>
            <p className="text-xl text-gray-600">Comprehensive automation for every business need</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <div key={index} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-md transition-all">
                <CheckCircle className="text-orange-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{solution.name}</h3>
                  <p className="text-sm text-gray-600">{solution.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real-World Use Cases</h2>
            <p className="text-xl text-gray-600">See how AI automation solves business problems</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-6">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Automation Packages</h2>
            <p className="text-xl text-gray-600">Choose the solution that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 ${
                  pkg.popular ? 'border-orange-600 shadow-xl' : 'border-gray-200'
                } hover:shadow-lg transition-all`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="text-3xl font-bold text-orange-600 mb-6">{pkg.price}</div>
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
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600'
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
      <section id="contact" className="py-20 px-6 bg-gradient-to-r from-orange-600 to-yellow-600">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Automate Your Business?</h2>
            <p className="text-xl text-orange-100">Let's discuss how AI can transform your operations</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Your company"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">What would you like to automate?</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="Describe the processes you want to automate..."
              ></textarea>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Get Automation Consultation
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Mail className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Email Us</p>
              <a href="mailto:info@devcore.com" className="text-orange-100 hover:text-white">
                info@devcore.com
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Phone className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Call Us</p>
              <a href="tel:+2348024471928" className="text-orange-100 hover:text-white">
                +234 802 447 1928
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
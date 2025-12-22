'use client';

import React, { useState } from 'react';
import { Code, CheckCircle, ArrowRight, Shield, Mail, Phone, Server, Layout } from 'lucide-react';

export default function WebDevPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirements: ''
  });

  const services = [
    { name: 'Custom Web Applications', description: 'Tailored solutions for unique business needs' },
    { name: 'E-commerce Platforms', description: 'Scalable online stores with secure payment integration' },
    { name: 'Progressive Web Apps', description: 'Native-like web experiences with offline capabilities' },
    { name: 'API Development & Integration', description: 'Robust backend systems and third-party integrations' },
    { name: 'Performance Optimization', description: 'Lightning-fast websites with optimized load times' },
    { name: 'Maintenance & Support', description: 'Ongoing updates, security patches, and technical support' }
  ];

  const technologies = [
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      icon: Layout
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
      icon: Server
    },
    {
      category: 'DevOps',
      items: ['Docker', 'AWS', 'Vercel', 'CI/CD'],
      icon: Shield
    }
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Discovery & Planning',
      description: 'Understanding your goals, target audience, and technical requirements'
    },
    {
      step: '2',
      title: 'Design & Prototyping',
      description: 'Creating wireframes, mockups, and interactive prototypes'
    },
    {
      step: '3',
      title: 'Development',
      description: 'Agile development with regular updates and feedback sessions'
    },
    {
      step: '4',
      title: 'Testing & QA',
      description: 'Comprehensive testing across devices, browsers, and performance metrics'
    },
    {
      step: '5',
      title: 'Deployment',
      description: 'Smooth launch with monitoring, analytics, and support setup'
    },
    {
      step: '6',
      title: 'Maintenance',
      description: 'Ongoing updates, security monitoring, and performance optimization'
    }
  ];

  const packages = [
    {
      name: 'Starter',
      price: '$1000',
      description: 'Basic website or landing page',
      features: [
        'Up to 5 pages',
        'Responsive design',
        'Basic contact form',
        'SEO optimization',
        '1 month support',
        '3 revisions'
      ]
    },
    {
      name: 'Professional',
      price: '$2,000',
      description: 'Full-featured web application',
      features: [
        'Up to 15 pages',
        'Custom design system',
        'CMS integration',
        'Database setup',
        'API development',
        '3 months support',
        'Unlimited revisions'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Complex business solutions',
      features: [
        'Unlimited pages',
        'Enterprise-grade architecture',
        'Advanced security',
        'Scalable infrastructure',
        'Dedicated team',
        '12 months support',
        'Priority development'
      ]
    }
  ];

  const benefits = [
    { stat: '40%', label: 'Faster Load Times', description: 'Than industry average' },
    { stat: '99.9%', label: 'Uptime', description: 'Guaranteed reliability' },
    { stat: '50+', label: 'Optimization Checks', description: 'For peak performance' }
  ];

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    console.log('Form submitted:', formData);
    alert('Thank you! Our web development team will review your requirements and get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', company: '', requirements: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Code size={16} />
                Web Development
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Build Digital Experiences That Convert
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                From sleek landing pages to complex web applications, we craft high-performance, scalable solutions using modern technologies like React, Next.js, and PostgreSQL.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Start Your Project
                </a>
                <a
                  href="#packages"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all text-center"
                >
                  View Pricing
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Code className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg"></div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[95, 80, 90].map((width, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-2 bg-gray-200 rounded flex-1">
                          <div 
                            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Web Development</h2>
            <p className="text-xl text-gray-600">Industry-leading performance and reliability</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{benefit.stat}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.label}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Tech Stack</h2>
            <p className="text-xl text-gray-600">Modern technologies for exceptional results</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{tech.category}</h3>
                  <div className="space-y-2">
                    {tech.items.map((item, i) => (
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Web Development Services</h2>
            <p className="text-xl text-gray-600">Comprehensive solutions for every business need</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Development Process</h2>
            <p className="text-xl text-gray-600">Transparent, collaborative, and results-driven</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-x-full -translate-y-1/2"></div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Web Development Packages</h2>
            <p className="text-xl text-gray-600">Choose the perfect solution for your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 ${
                  pkg.popular ? 'border-blue-600 shadow-xl' : 'border-gray-200'
                } hover:shadow-lg transition-all`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">{pkg.price}</div>
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
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
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
      <section id="contact" className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Your Website?</h2>
            <p className="text-xl text-blue-100">Let's discuss your project requirements</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Your company"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Requirements</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Describe your website needs, features, and timeline..."
              ></textarea>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Get Web Development Quote
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Mail className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Email Us</p>
              <a href="mailto:web@devcore.com" className="text-blue-100 hover:text-white">
                web@devcore.com
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Phone className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Call Us</p>
              <a href="tel:+2348024471928" className="text-blue-100 hover:text-white">
                +234 802 447 1928
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
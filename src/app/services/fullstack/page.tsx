'use client';

import React, { useState } from 'react';
import { Rocket, Layers, Cloud, Server, CheckCircle, ArrowRight, Zap, Shield, Code, Database, Mail, Phone, GitBranch } from 'lucide-react';

export default function FullStackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    timeline: ''
  });

  const services = [
    { name: 'MVP Development', description: 'Rapid prototyping and minimum viable product launch' },
    { name: 'SaaS Platform Development', description: 'Scalable software-as-a-service solutions' },
    { name: 'Cloud Infrastructure', description: 'AWS, Azure, or Google Cloud deployment and management' },
    { name: 'DevOps & CI/CD', description: 'Automated deployment pipelines and infrastructure as code' },
    { name: 'API Development', description: 'RESTful and GraphQL APIs with comprehensive documentation' },
    { name: 'Database Architecture', description: 'PostgreSQL, MongoDB, Redis, and data warehouse solutions' }
  ];

  const stack = [
    {
      category: 'Frontend',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      icon: Layers
    },
    {
      category: 'Backend',
      technologies: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB'],
      icon: Server
    },
    {
      category: 'DevOps & Cloud',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
      icon: Cloud
    }
  ];

  const process = [
    {
      step: '1',
      title: 'Discovery & Strategy',
      description: 'Requirements analysis, technology selection, and architecture planning'
    },
    {
      step: '2',
      title: 'MVP Development',
      description: 'Agile development with continuous feedback and iterations'
    },
    {
      step: '3',
      title: 'Production Deployment',
      description: 'Cloud infrastructure setup and secure deployment'
    },
    {
      step: '4',
      title: 'DevOps Automation',
      description: 'CI/CD pipelines, monitoring, and automated testing'
    },
    {
      step: '5',
      title: 'Scaling & Optimization',
      description: 'Performance optimization and horizontal scaling'
    },
    {
      step: '6',
      title: 'Ongoing Support',
      description: 'Maintenance, updates, and feature enhancements'
    }
  ];

  const packages = [
    {
      name: 'MVP Launch',
      price: 'From $5,000',
      description: 'Minimum viable product development',
      features: [
        'Single application architecture',
        'Basic cloud infrastructure',
        'Essential features only',
        '3 months development',
        'Basic CI/CD pipeline',
        '6 months support'
      ]
    },
    {
      name: 'SaaS Platform',
      price: 'From $7,000',
      description: 'Full-featured SaaS solution',
      features: [
        'Microservices architecture',
        'Advanced cloud infrastructure',
        'Multi-tenant support',
        '6-9 months development',
        'Advanced CI/CD',
        'Monitoring & analytics',
        '12 months support'
      ],
      popular: true
    },
    {
      name: 'Enterprise Suite',
      price: 'Custom',
      description: 'Complete digital transformation',
      features: [
        'Distributed system architecture',
        'Multi-cloud deployment',
        'Enterprise security',
        'Custom DevOps solutions',
        'Dedicated team',
        '24/7 monitoring',
        '2 years support'
      ]
    }
  ];

  const benefits = [
    { stat: '10x', label: 'Faster Launch', description: 'Compared to in-house development' },
    { stat: '99.99%', label: 'Uptime', description: 'Enterprise-grade reliability' },
    { stat: '24/7', label: 'Monitoring', description: 'Proactive issue resolution' }
  ];

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    console.log('Form submitted:', formData);
    alert('Thank you! Our full-stack architects will review your project and provide a detailed proposal within 48 hours.');
    setFormData({ name: '', email: '', phone: '', company: '', projectType: '', timeline: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Rocket size={16} />
                Full-Stack Solutions
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                From MVP to Production-Ready SaaS
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                End-to-end development with cloud infrastructure, DevOps, and ongoing support. We handle everything from initial concept to scalable production deployment and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Start Your Project
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
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Rocket className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Frontend', 'Backend', 'DevOps'].map((item, i) => (
                      <div key={i} className="text-center">
                        <div className="h-16 bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center mb-2">
                          {item === 'Frontend' && <Layers className="text-green-600" size={20} />}
                          {item === 'Backend' && <Server className="text-green-600" size={20} />}
                          {item === 'DevOps' && <Cloud className="text-green-600" size={20} />}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[95, 90, 98].map((width, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-2 bg-gray-200 rounded flex-1">
                          <div 
                            className="h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded"
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-green-600">{width}%</span>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Full-Stack Development</h2>
            <p className="text-xl text-gray-600">Complete solutions for modern businesses</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">{benefit.stat}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.label}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Technology Stack</h2>
            <p className="text-xl text-gray-600">Modern, scalable, and battle-tested technologies</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {stack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{tech.category}</h3>
                  <div className="space-y-2">
                    {tech.technologies.map((technology, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-gray-700">{technology}</span>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Full-Stack Services</h2>
            <p className="text-xl text-gray-600">Comprehensive development from start to finish</p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Development Process</h2>
            <p className="text-xl text-gray-600">Methodical approach for successful delivery</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transform translate-x-full -translate-y-1/2"></div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Full-Stack Packages</h2>
            <p className="text-xl text-gray-600">End-to-end solutions for every scale</p>
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
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-6">{pkg.price}</div>
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
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600'
                  }`}
                >
                  Start Project
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Start Your Full-Stack Project</h2>
            <p className="text-xl text-green-100">Let's build something amazing together</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="">Select project type</option>
                  <option value="mvp">MVP Development</option>
                  <option value="saas">SaaS Platform</option>
                  <option value="webapp">Web Application</option>
                  <option value="mobile">Mobile App with Backend</option>
                  <option value="api">API Development</option>
                  <option value="migration">Legacy System Migration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="">Select preferred timeline</option>
                  <option value="urgent">1-3 months (Urgent)</option>
                  <option value="standard">3-6 months (Standard)</option>
                  <option value="extended">6-12 months (Extended)</option>
                  <option value="ongoing">Ongoing development</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Get Full-Stack Consultation
              <ArrowRight size={20} />
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              We'll schedule a technical consultation and provide a detailed project proposal
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Mail className="mx-auto mb-3 text-white" size={32} />
              <p className="text-white font-medium">Email Us</p>
              <a href="mailto:fullstack@devcore.com" className="text-green-100 hover:text-white">
                fullstack@devcore.com
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
'use client';

import React from 'react';
import { Code, Smartphone, TrendingUp, Bot, CheckCircle, ArrowRight, Zap, Users, Target } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom web applications built with modern frameworks and best practices to bring your vision to life',
      features: [
        'React & Next.js Development',
        'Full-Stack Solutions',
        'RESTful APIs & GraphQL',
        'Database Design & Integration',
        'Progressive Web Apps (PWA)',
        'E-commerce Platforms'
      ],
      color: 'blue',
      link: '/services/webdev'
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile apps for iOS and Android that deliver exceptional user experiences',
      features: [
        'iOS & Android Development',
        'React Native & Flutter',
        'Cross-Platform Solutions',
        'App Store Deployment',
        'Push Notifications',
        'Offline Functionality'
      ],
      color: 'purple',
      link: '/services/mobile'
    },
    {
      icon: TrendingUp,
      title: 'SEO',
      description: 'Search Engine Optimization strategies to increase your visibility and drive organic traffic',
      features: [
        'Technical SEO Audits',
        'On-Page Optimization',
        'Content Strategy',
        'Link Building',
        'Local SEO',
        'Analytics & Reporting'
      ],
      color: 'green',
      link: '/services/seo'
    },
    {
      icon: Bot,
      title: 'AI Automation',
      description: 'Intelligent automation solutions powered by artificial intelligence to streamline your business processes',
      features: [
        'Workflow Automation',
        'Chatbots & Virtual Assistants',
        'Machine Learning Integration',
        'Data Processing & Analysis',
        'Custom AI Solutions',
        'Business Process Optimization'
      ],
      color: 'orange',
      link: '/services/ai'
    }
  ];

  const process = [
    { 
      step: 1, 
      title: 'Discovery', 
      description: 'We understand your business goals, challenges, and requirements through detailed consultation'
    },
    { 
      step: 2, 
      title: 'Planning', 
      description: 'Create a detailed roadmap, timeline, and technical specification for your project'
    },
    { 
      step: 3, 
      title: 'Design', 
      description: 'Design beautiful and functional interfaces with user experience at the forefront'
    },
    { 
      step: 4, 
      title: 'Development', 
      description: 'Build your solution with cutting-edge technologies and industry best practices'
    },
    { 
      step: 5, 
      title: 'Testing', 
      description: 'Rigorous quality assurance and testing to ensure everything works perfectly'
    },
    { 
      step: 6, 
      title: 'Launch & Support', 
      description: 'Deploy your application and provide ongoing maintenance and support'
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Agile development process ensures quick turnaround times'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Experienced developers and designers dedicated to your success'
    },
    {
      icon: Target,
      title: 'Results Driven',
      description: 'We focus on delivering measurable business outcomes'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive digital solutions to transform your business and drive growth
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  <div className={`w-16 h-16 ${
                    service.color === 'blue' ? 'bg-blue-100' :
                    service.color === 'purple' ? 'bg-purple-100' :
                    service.color === 'green' ? 'bg-green-100' :
                    'bg-orange-100'
                  } rounded-2xl flex items-center justify-center ${
                    service.color === 'blue' ? 'text-blue-600' :
                    service.color === 'purple' ? 'text-purple-600' :
                    service.color === 'green' ? 'text-green-600' :
                    'text-orange-600'
                  } mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle size={18} className="text-gray-900 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a 
                    href={service.link}
                    className="inline-flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
                  >
                    Learn More
                    <ArrowRight size={18} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Devcore</h2>
            <p className="text-xl text-gray-600">We deliver excellence in everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600">How we bring your ideas to life</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-600 to-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-green mb-3 mt-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-500 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how we can help transform your business with our services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-4 bg-white text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/about"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Learn About Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
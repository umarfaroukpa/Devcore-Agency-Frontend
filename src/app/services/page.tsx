'use client';

import React, { useState } from 'react';
import { Code, Palette, Smartphone, Globe, Database, Shield, CheckCircle } from 'lucide-react';
  

export default function ServicesPage() {
  const services = [
    {
      icon: <Code size={32} />,
      title: 'Web Development',
      description: 'Custom web applications built with modern frameworks and best practices',
      features: ['React & Next.js', 'Node.js Backend', 'RESTful APIs', 'Database Design'],
      color: 'blue'
    },
    {
      icon: <Smartphone size={32} />,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile apps for iOS and Android',
      features: ['React Native', 'Flutter', 'iOS & Android', 'App Store Deployment'],
      color: 'purple'
    },
    {
      icon: <Palette size={32} />,
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive interfaces that users love',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      color: 'pink'
    },
    {
      icon: <Globe size={32} />,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment',
      features: ['AWS & Azure', 'CI/CD Pipelines', 'Auto-scaling', 'Monitoring'],
      color: 'green'
    },
    {
      icon: <Database size={32} />,
      title: 'Data Engineering',
      description: 'Big data solutions and analytics platforms',
      features: ['ETL Pipelines', 'Data Warehousing', 'Analytics', 'ML Integration'],
      color: 'orange'
    },
    {
      icon: <Shield size={32} />,
      title: 'Security & Testing',
      description: 'Comprehensive security audits and QA testing',
      features: ['Penetration Testing', 'Code Review', 'Automated Testing', 'Compliance'],
      color: 'red'
    }
  ];

  const process = [
    { step: 1, title: 'Discovery', description: 'We understand your business goals and requirements' },
    { step: 2, title: 'Planning', description: 'Create detailed roadmap and timeline' },
    { step: 3, title: 'Design', description: 'Design beautiful and functional interfaces' },
    { step: 4, title: 'Development', description: 'Build with cutting-edge technologies' },
    { step: 5, title: 'Testing', description: 'Rigorous testing for quality assurance' },
    { step: 6, title: 'Launch', description: 'Deploy and monitor your application' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive digital solutions to transform your business
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className={`w-16 h-16 bg-${service.color}-100 rounded-2xl flex items-center justify-center text-${service.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle size={18} className="text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600">How we bring your ideas to life</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 shadow-lg">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
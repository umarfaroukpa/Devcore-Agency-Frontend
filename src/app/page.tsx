'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Code, Zap, Globe, Users, Briefcase, MessageSquare, ChevronRight, Star, TrendingUp, Clock, Pen, Eye, Heart, Sparkles, Target, Rocket, BarChart, Loader2 } from 'lucide-react';
import { FadeIn, SlideIn, ScaleIn, StaggerChildren, CounterAnimation, Parallax } from '../component/Animate';
import Image from 'next/image';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const serviceCards = [
    {
      icon: Pen,
      title: 'Content Marketing',
      description: 'Our team creates engaging and shareable content that resonates with your audience and drives traffic.',
      dark: true,
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Eye,
      title: 'Graphic Design',
      description: 'Unlock the power of visual storytelling with our expert graphic design services that elevate your brand and captivate.',
      dark: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Digital Marketing',
      description: 'Elevate your brand\'s online presence with our data-driven digital strategies. From SEO and content marketing.',
      dark: false,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Code,
      title: 'Web Design',
      description: 'We specialize in creating stunning, user-friendly websites that not only look great but also deliver an exceptional user.',
      dark: false,
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Users,
      title: 'Social Media',
      description: 'Harness the power of social media to connect with your audience and build meaningful relationships.',
      dark: false,
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Heart,
      title: 'Brand Strategy',
      description: 'Our strategic approach helps define your unique value proposition and create a cohesive brand experience.',
      dark: false,
      color: 'from-green-500 to-green-600'
    }
  ];

  const stats = [
    { value: '200+', label: 'Projects Delivered', icon: Briefcase, color: 'text-teal-400' },
    { value: '98%', label: 'Client Satisfaction', icon: Star, color: 'text-blue-400' },
    { value: '24/7', label: 'Support Available', icon: Clock, color: 'text-purple-400' },
    { value: '50+', label: 'Experts Team', icon: Users, color: 'text-pink-400' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', company: '', service: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Parallax */}
      <section className="pt-24 pb-16 px-6 bg-gray-900 text-white relative overflow-hidden">
        <Parallax speed={0.3}>
          <div className="absolute top-16 left-8 grid grid-cols-4 gap-2 opacity-20">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
            ))}
          </div>
        </Parallax>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="pt-8">
              <FadeIn delay={0.2} direction="right">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Ready to take your
                  <span className="block text-teal-400 mt-1">Business Growth</span>
                  <span className="block mt-1">to the next level?</span>
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.4} direction="right">
                <p className="text-gray-300 text-base mb-8 leading-relaxed max-w-md">
                  Streamline your development workflow with our powerful project management platform. 
                  Collaborate seamlessly, track progress, and deliver exceptional results.
                </p>
              </FadeIn>

              <FadeIn delay={0.6} direction="right">
                <button className="group flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 text-sm shadow-lg hover:shadow-xl">
                  <span className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight size={12} className="text-white" />
                  </span>
                  Start your Business With Us
                </button>
              </FadeIn>

              <FadeIn delay={0.8} direction="right">
                <div className="mt-12 pt-8 border-t border-gray-800">
                  <p className="text-xs text-gray-500 mb-4 font-medium">Trusted by Leading Brands</p>
                  <StaggerChildren staggerDelay={0.1}>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <CheckCircle size={18} className="text-gray-600" />
                        <span className="text-sm font-medium">Satcom</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MessageSquare size={18} className="text-gray-600" />
                        <span className="text-sm font-medium">Payhub</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Globe size={18} className="text-gray-600" />
                        <span className="text-sm font-medium">gabas</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Zap size={18} className="text-gray-600" />
                        <span className="text-sm font-medium">Mindfulness</span>
                      </div>
                    </div>
                  </StaggerChildren>
                </div>
              </FadeIn>
            </div>

            <div className="relative flex items-center justify-center">
              <ScaleIn delay={0.4}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 border-2 border-gray-800 rounded-full animate-pulse"></div>
                  <div className="absolute w-80 h-80 border border-gray-800 rounded-full"></div>
                </div>
              </ScaleIn>
              
              <FadeIn delay={0.6} direction="left">
                <div className="relative z-10 w-80 h-80 rounded-full overflow-hidden hover:scale-105 transition-transform duration-500"> 
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="relative z-10 w-80 h-80 rounded-full overflow-hidden border-4 border-gray-800 shadow-2xl group hover:scale-105 transition-transform duration-500">
                      <Image 
                        src="/fotis-fotopoulos-LJ9KY8pIH3E-unsplash.jpg" 
                        alt="Team collaboration"
                        fill
                        className="object-cover mix-blend-overlay"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                    </div>
                  </div>
                </div> 
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-500 text-white mb-6">
                <Target size={16} />
                <span className="text-sm font-medium uppercase tracking-wide">Our Services</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                High-impact services
                <br />
                for your business
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StaggerChildren staggerDelay={0.1}>
              {serviceCards.map((service, index) => {
                const Icon = service.icon;
                return (
                  <ScaleIn key={index} delay={index * 0.1}>
                    <div 
                      className={`${service.dark ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-white to-gray-50'} rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border ${service.dark ? 'border-gray-800' : 'border-gray-200'} group`}
                    >
                      <div className={`w-12 h-12 ${service.dark ? 'bg-white text-gray-900' : `bg-gradient-to-r ${service.color} text-white`} rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={22} />
                      </div>
                      <h3 className={`text-xl font-bold mb-3 ${service.dark ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
                      <p className={`${service.dark ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed`}>
                        {service.description}
                      </p>
                      <div className="mt-6">
                        <button className={`inline-flex items-center gap-2 text-sm font-medium ${service.dark ? 'text-white hover:text-teal-400' : 'text-gray-700 hover:text-teal-600'} transition-colors`}>
                          Learn more
                          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </ScaleIn>
                );
              })}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Stats Section with Counter Animations */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">Our Impact in Numbers</h2>
          </FadeIn>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StaggerChildren staggerDelay={0.15}>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <FadeIn key={index} delay={index * 0.15} direction="up">
                    <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-teal-500/50 transition-all duration-300 hover:scale-105">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
                        <Icon className={stat.color} size={28} />
                      </div>
                      <div className="text-4xl font-bold mb-2">
                        <CounterAnimation 
                          end={stat.value.replace('+', '')} 
                          suffix={stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''}
                          duration={2 + (index * 0.2)}
                        />
                      </div>
                      <div className="text-gray-300 text-sm">{stat.label}</div>
                    </div>
                  </FadeIn>
                );
              })}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Web Design Focus Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-teal-100 shadow-xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <FadeIn direction="right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-500 text-white mb-6">
                    <Rocket size={16} />
                    <span className="text-sm font-medium uppercase">Web Design Specialists</span>
                  </div>
                </FadeIn>
                
                <FadeIn direction="right" delay={0.2}>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    We specialize in creating stunning, user-friendly websites that deliver exceptional results
                  </h3>
                </FadeIn>
                
                <FadeIn direction="right" delay={0.3}>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Our web design services focus on creating visually appealing, intuitive, and high-performing 
                    websites that not only look great but also drive conversions and achieve your business goals.
                  </p>
                </FadeIn>
                
                <StaggerChildren staggerDelay={0.05}>
                  {[
                    'Mobile-first responsive design',
                    'SEO-optimized architecture',
                    'Fast loading performance',
                    'Conversion-focused layouts',
                    'Accessibility compliance',
                    'Ongoing maintenance'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 mb-3">
                      <CheckCircle className="text-teal-500" size={20} />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </StaggerChildren>
              </div>
              
              <SlideIn direction="left" delay={0.4}>
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <BarChart className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Real Results</h3>
                      <p className="text-sm text-gray-600">Average performance improvements</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: 'Conversion Rate', value: '42%', color: 'from-green-400 to-emerald-500', width: 'w-4/5' },
                      { label: 'Page Load Speed', value: '68%', color: 'from-blue-400 to-cyan-500', width: 'w-3/4' },
                      { label: 'User Engagement', value: '55%', color: 'from-purple-400 to-pink-500', width: 'w-5/6' },
                      { label: 'SEO Traffic', value: '300%', color: 'from-orange-400 to-red-500', width: 'w-full' }
                    ].map((metric, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-700 font-medium">{metric.label}</span>
                          <span className="text-sm font-semibold text-gray-900">{metric.value} ↑</span>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${metric.color} ${metric.width}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Contact Form */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Sparkles size={16} />
                <span className="text-sm font-medium uppercase tracking-wide">Ready to Transform?</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Let's Build Something Amazing Together
              </h2>
              <p className="text-lg text-gray-300">
                Schedule a free consultation with our experts. No commitments, just insights.
              </p>
            </div>
          </FadeIn>

          <SlideIn direction="up" delay={0.2}>
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
              {submitStatus === 'success' ? (
                <FadeIn>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </FadeIn>
              ) : (
                <div className="space-y-6">
                  {submitStatus === 'error' && (
                    <FadeIn>
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {errorMessage}
                      </div>
                    </FadeIn>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <FadeIn delay={0.3} direction="right">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-gray-900 text-sm"
                          placeholder="John Smith"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FadeIn>
                    
                    <FadeIn delay={0.4} direction="right">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-gray-900 text-sm"
                          placeholder="john@company.com"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FadeIn>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FadeIn delay={0.5} direction="right">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-gray-900 text-sm"
                          placeholder="Your Company"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FadeIn>
                    
                    <FadeIn delay={0.6} direction="right">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Interest
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all text-gray-900 text-sm"
                          disabled={isSubmitting}
                        >
                          <option value="">Select a service</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Brand Strategy">Business Process and Automation Workflow</option>
                          <option value="Search Engine">Search Engine Optimazition (SEO)</option>
                          <option value="Content Marketing">Content Marketing</option>
                          <option value="Graphic Design">Graphic Design</option>
                          <option value="Social Media Management">Social Media Management</option>
                        </select>
                      </div>
                    </FadeIn>
                  </div>
                  
                  <FadeIn delay={0.7} direction="right">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Details *
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all text-gray-900 text-sm"
                        placeholder="Tell us about your project goals, timeline, and budget..."
                        disabled={isSubmitting}
                      />
                    </div>
                  </FadeIn>
                  
                  <FadeIn delay={0.8} direction="up">
                    <div className="text-center">
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-gray-900 to-gray-500 text-white font-semibold rounded-full hover:from-gray-500 hover:to-gray-900 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Sending...
                          </>
                        ) : (
                          <>
                            Request Free Consultation
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-500 mt-4">
                        We'll respond within 24 hours. No spam, ever.
                      </p>
                    </div>
                  </FadeIn>
                </div>
              )}
            </div>
          </SlideIn>
        </div>
      </section>
    </div>
  );
}
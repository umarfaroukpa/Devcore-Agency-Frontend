'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Globe, Code, Target, Zap, Rocket, BarChart, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { FadeIn, SlideIn, ScaleIn, StaggerChildren, CounterAnimation, Parallax } from '../component/Animate';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import  { useAnalytics } from '../lib/useAnalytics';

export default function LandingPage() {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
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


  interface Service {
    icon: React.ComponentType<{ size?: number }>;
    title: string;
    description: string;
    color: string;
    link: string;
  }

  const handleCardClick = (service: Service): void => {
    trackEvent('service_card_click', {
      service_name: service.title,
      service_link: service.link
    });
    router.push(service.link);
  };

  // Updated services to match your actual agency offering
  const serviceCards = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Custom websites & web applications built with Next.js, React, Node.js. Fast, secure, scalable, and SEO-ready from day one.',
      color: 'from-teal-500 to-cyan-600',
      link: '/services/webdev'
    },
    {
      icon: Code,
      title: 'Mobile App Development',
      description: 'Native and cross-platform apps (iOS & Android) using React Native, Flutter, Swift, or Kotlin for seamless experiences.',
      color: 'from-blue-500 to-indigo-600',
      link: '/services/mobile'
    },
    {
      icon: Target,
      title: 'SEO & Performance Optimization',
      description: 'Technical SEO, Core Web Vitals, content strategy, and link building to dominate search rankings and drive organic traffic.',
      color: 'from-purple-500 to-pink-600',
      link: '/services/seo'
    },
    {
      icon: Zap,
      title: 'AI Automations & Workflows',
      description: 'Custom AI agents, chatbots, process automation (Zapier/Make), data pipelines, and intelligent workflows using LLMs & RPA.',
      color: 'from-orange-500 to-red-600',
      link: '/services/ai'
    },
    {
      icon: Rocket,
      title: 'Full-Stack Solutions',
      description: 'End-to-end development: MVP to production-ready SaaS with cloud infrastructure, DevOps, CI/CD, and ongoing support.',
      color: 'from-green-500 to-emerald-600',
      link: '/services/fullstack'
    },
    {
      icon: BarChart,
      title: 'Growth & Analytics',
      description: 'Conversion tracking, A/B testing, custom dashboards, and data-driven insights to maximize ROI and business growth.',
      color: 'from-amber-500 to-yellow-600',
      link: '/services/growth'
    }
  ];

  const stats = [
    { value: '15+', label: 'Projects Delivered', icon: Rocket, color: 'text-teal-400' },
    { value: '100%', label: 'Client Satisfaction', icon: CheckCircle, color: 'text-blue-400' },
    { value: '24/7', label: 'Support Available', icon: Zap, color: 'text-purple-400' },
    { value: '7+', label: 'Expert Developers', icon: Code, color: 'text-pink-400' }
  ];

  const techStack = ['Next.js', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'React Native', 'PostgreSQL', 'MongoDB', 'Firebase', 'Vercel', 'Supabase'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields');
      return;
    }

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to submit form');

      setSubmitStatus('success');
      setFormData({ name: '', email: '', company: '', service: '', message: '' });
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 bg-gray-900 text-white relative overflow-hidden">
        <Parallax speed={0.3}>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-transparent to-purple-900/20" />
        </Parallax>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="pt-8">
              <FadeIn delay={0.2} direction="right">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  We Build
                  <span className="block text-teal-400 mt-2">High-Performance Websites,</span>
                  <span className="block mt-2">Mobile Apps & AI Automations</span>
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.4} direction="right">
                <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-2xl">
                  Full-stack web & mobile development, SEO optimization, and intelligent AI-powered automations 
                  that help businesses scale faster, reduce costs, and stay ahead of the competition.
                </p>
              </FadeIn>

              <FadeIn delay={0.6} direction="right">
                <div className="flex flex-wrap gap-4 mb-12">
                  <button className="group flex items-center gap-3 px-8 py-4 bg-teal-500 text-gray-900 rounded-full font-semibold hover:bg-teal-400 transition-all shadow-lg hover:shadow-xl">
                    Start Your Project
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                  <button className="flex items-center gap-3 px-8 py-4 border border-gray-500 rounded-full font-medium hover:border-white hover:bg-white/10 transition-all">
                    View Portfolio
                    <ChevronRight size={20} />
                  </button>
                </div>
              </FadeIn>

              {/* Tech Stack Badges */}
              <FadeIn delay={1.0}>
                <div>
                  <p className="text-sm text-gray-400 mb-6">Powered by modern technologies</p>
                  <div className="flex flex-wrap gap-4">
                    {techStack.map((tech) => (
                      <span key={tech} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <ScaleIn delay={0.4}>
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-gray-800">
                  <Image 
                    src="/Devcore-dashboard.png" 
                    alt="Custom web application dashboard built by our agency"
                    width={900}
                    height={600}
                    className="object-cover w-full"
                    priority
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl" />
                <div className="absolute -top-8 -right-8 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
              </ScaleIn>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white mb-6">
                <Target size={16} />
                <span className="text-sm font-medium uppercase tracking-wide">Our Services</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Technical Solutions That Drive Real Results
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StaggerChildren staggerDelay={0.1}>
              {serviceCards.map((service, index) => {
                const Icon = service.icon;
                return (
                  <ScaleIn key={index} delay={index * 0.1}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 group">
                      <div className={`w-14 h-14 bg-gradient-to-r ${service.color} text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <button 
                      onClick={() => handleCardClick(service)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                        Learn more
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </ScaleIn>
                );
              })}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Proven Results in Numbers</h2>
          </FadeIn>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StaggerChildren staggerDelay={0.15}>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <FadeIn key={index} delay={index * 0.15} direction="up">
                    <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-teal-500/50 transition-all hover:scale-105">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
                        <Icon className={stat.color} size={28} />
                      </div>
                      <div className="text-4xl font-bold mb-2">
                        <CounterAnimation 
                          end={stat.value.replace(/[+%]/g, '')} 
                          suffix={stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''}
                          duration={2.5}
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

      {/* CTA / Contact Form Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white mb-6">
                <Sparkles size={16} />
                <span className="text-sm font-medium uppercase tracking-wide">Get Started Today</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                Let's Build Your Next Big Thing
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tell us about your project. We'll reply within 24 hours with insights and next steps — no obligation.
              </p>
            </div>
          </FadeIn>

          <SlideIn direction="up" delay={0.2}>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
              {submitStatus === 'success' ? (
                <FadeIn>
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-8">We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                </FadeIn>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900"
                        placeholder="John Doe"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900"
                        placeholder="john@company.com"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900"
                        placeholder="Acme Corp"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interested Service</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900"
                        disabled={isSubmitting}
                      >
                        <option value="">Select a service</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App">Mobile App Development</option>
                        <option value="SEO">SEO & Performance</option>
                        <option value="AI Automation">AI Automations</option>
                        <option value="Full-Stack">Full-Stack Solution</option>
                        <option value="Other">Other / Consulting</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Details *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 resize-none"
                      placeholder="Describe your project, goals, timeline, budget range..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-full hover:from-teal-600 hover:to-cyan-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Sending...
                        </>
                      ) : (
                        <>
                          Request Free Consultation
                          <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 mt-4">No spam. We respect your privacy.</p>
                  </div>
                </form>
              )}
            </div>
          </SlideIn>
        </div>
      </section>
    </div>
  );
}


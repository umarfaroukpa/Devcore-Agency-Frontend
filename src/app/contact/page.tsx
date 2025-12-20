'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Linkedin, Twitter, Github, MessageSquare } from 'lucide-react';
import api from '../../lib/api';
import Link from 'next/link';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    try {
      console.log('Submitting contact form:', formData);
      
      // Submit the form
      await api.post('/contact', formData);
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        message: ''
      });
      
      // Clear errors
      setErrors({});
      
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      // Show user-friendly error message
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'There was an error submitting the form. Please try again later.';
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const contactInfo = [
    { 
      icon: Mail, 
      title: 'Email', 
      value: 'hello@devcore.com', 
      link: 'mailto:hello@devcore.com' 
    },
    { 
      icon: Phone, 
      title: 'Phone', 
      value: '+234 567 8900', 
      link: 'tel:+2345678900' 
    },
    { 
      icon: MapPin, 
      title: 'Office', 
      value: 'No4 Gombe Road, Layin Shaba Near Makarfi Plaza Kaduna North, Kaduna State, Nigeria', 
      link: '#' 
    }
  ];

  const socialLinks = [
    { icon: Linkedin, name: 'LinkedIn', link: 'https://linkedin.com' },
    { icon: Twitter, name: 'Twitter', link: 'https://twitter.com' },
    { icon: Github, name: 'GitHub', link: 'https://github.com' }
  ];

  const faqs = [
    {
      q: "What is your typical project timeline?",
      a: "Project timelines vary based on scope and complexity. A typical web application takes 3-6 months, while mobile apps may take 4-8 months. We'll provide a detailed timeline during our initial consultation."
    },
    {
      q: "Do you offer ongoing support and maintenance?",
      a: "Yes! We offer comprehensive support packages including bug fixes, updates, security patches, and feature enhancements. Our team is available 24/7 for critical issues."
    },
    {
      q: "What technologies do you specialize in?",
      a: "We specialize in modern tech stacks including React, Next.js, Node.js, React Native, Flutter, AWS, and more. We always choose the best technology for your specific needs."
    },
    {
      q: "How do you handle project communication?",
      a: "We believe in transparent communication. You'll have access to our project management tools, regular status updates, and weekly video calls with your dedicated project manager."
    },
    {
      q: "What is your pricing structure?",
      a: "We offer flexible pricing models including fixed-price projects, time and materials, and dedicated team arrangements. Contact us for a customized quote based on your requirements."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Let&apos;s Build Something <span className="bg-gradient-to-r from-gray-500 to-gray-900 bg-clip-text text-transparent">Amazing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have a project in mind? We&apos;d love to hear from you. Get in touch and let&apos;s make it happen.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {submitSuccess && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Send className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 text-lg">Message Sent Successfully!</h3>
                  <p className="text-green-700">Thank you for your inquiry. We&apos;ll contact you within 24 hours.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                      placeholder="Company Name"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                      placeholder="+234 567 8900"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a service</option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile Development</option>
                    <option value="design">UI/UX Design</option>
                    <option value="cloud">Cloud Solutions</option>
                    <option value="consulting">Consulting</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about your project..."
                    disabled={isSubmitting}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-900 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:from-gray-700 hover:to-gray-900'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Fields marked with * are required
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <p className="text-gray-600 text-lg mb-8">
                  We&apos;re here to help and answer any questions you might have. We look forward to hearing from you!
                </p>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <a
                        key={index}
                        href={info.link}
                        className="flex items-start gap-4 p-6 bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl hover:shadow-lg transition-all group"
                      >
                        <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                          <IconComponent size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                          <p className="text-gray-600">{info.value}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
                <p className="text-gray-600 mb-6">Stay connected on social media</p>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const SocialIcon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:text-gray-600 hover:shadow-lg transition-all"
                        title={social.name}
                      >
                        <SocialIcon size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Map */}
              <div className="bg-gray-200 rounded-2xl overflow-hidden h-64 flex items-center justify-center">
                <p className="text-gray-600">Map Will Appear Here</p>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-gray-500 to-gray-900 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Quick answers to questions you may have
          </p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details 
                key={index} 
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-lg font-semibold text-gray-900">{faq.q}</span>
                  <span className="text-gray-600 transition-transform group-open:rotate-180">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-gray-600 to-gray-900 text-white rounded-3xl p-12 shadow-2xl">
          <MessageSquare className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let&apos;s discuss how we can help bring your vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#"
              className="px-8 py-4 bg-white text-gray-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl"
            >
              Schedule a Call
            </Link>
            <Link
              href="mailto:hello@devcore.com"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-gray-600 transition-all"
            >
              Send Email
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
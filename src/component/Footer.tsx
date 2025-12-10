'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Facebook, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Devcore</h3>
            <p className="text-sm text-gray-400 mb-4">
              Building innovative solutions for modern businesses.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500" />
                <Link href="mailto:magamatechnologies@gmail.com" className="hover:text-blue-400 transition-colors">
                    info@devcore.com
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-500" />
                <Link href="tel:+2348024471928" className="hover:text-blue-400 transition-colors">
                  +234 802 447 1928
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="/support" className="hover:text-blue-400 transition-colors">Support</Link></li>
              <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>
           
           {/*Services*/}
          <div>
                <h3 className="font-bold text-base mb-6">Services</h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li><a href="/services/webdev" className="hover:text-white transition-colors">Web Development</a></li>
                  <li><a href="/services/ai" className="hover:text-white transition-colors">AI Automation</a></li>
                  <li><a href="/services/seo" className="hover:text-white transition-colors">SEO & Marketing</a></li>
                  <li><a href="/services/consulting" className="hover:text-white transition-colors">Digital Consulting</a></li>
                </ul>
              </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
            
            <div className="flex gap-3 mt-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all">
                <Facebook size={16} />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all">
                <Twitter size={16} />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all">
                <Linkedin size={16} />
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all">
                <Github size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          <p>© {currentYear} Devcore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
'use client';

import React, { useState } from 'react';
import { ChevronRight, FileText, Code, Zap, Shield, PlayCircle,  Bookmark, Share2, Copy, Download } from 'lucide-react';

  
export const dynamic = 'force-dynamic';
export default function DocumentationPage() {
  const [selectedSection, setSelectedSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'getting-started', icon: Zap, title: 'Getting Started', badge: null },
    { id: 'installation', icon: Download, title: 'Installation', badge: null },
    { id: 'authentication', icon: Shield, title: 'Authentication', badge: null },
    { id: 'api-reference', icon: Code, title: 'API Reference', badge: 'New' },
    { id: 'components', icon: FileText, title: 'Components', badge: null },
    { id: 'examples', icon: PlayCircle, title: 'Examples', badge: null }
  ];

  const docContent: Record<string, { title: string; content: { heading: string; text?: string; code?: string }[] }> = {
    'getting-started': {
      title: 'Getting Started',
      content: [
        {
          heading: 'Welcome to Canvix',
          text: 'Devcore is a powerful platform for building modern web applications. This guide will help you get started quickly.'
        },
        {
          heading: 'Prerequisites',
          text: 'Before you begin, make sure you have Node.js 16+ and npm installed on your machine.'
        },
        {
          heading: 'Quick Start',
          code: `npm install devcore --save`
        }
      ]
    },
    'installation': {
      title: 'Installation',
      content: [
        {
          heading: 'Install via npm',
          code: `npm install devcore --save`
        },
        {
          heading: 'Install via yarn',
          code: `yarn add devcore`
        },
        {
          heading: 'Verify Installation',
          text: 'Run the following command to verify your installation:',
          code: `devcore --version`
        }
      ]
    },
    'authentication': {
      title: 'Authentication',
      content: [
        {
          heading: 'API Keys',
          text: 'Generate your API key from the dashboard and add it to your environment variables.'
        },
        {
          heading: 'Usage',
          code: `const devcore = require('devcore');
devcore.auth('YOUR_API_KEY');`
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-20 bottom-0 bg-gray-50 border-r border-gray-200 overflow-y-auto p-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 outline-none"
            />
          </div>
          
          <nav className="space-y-1">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSection === section.id 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} />
                    <span>{section.title}</span>
                  </div>
                  {section.badge && (
                    <span className="px-2 py-0.5 bg-teal-500 text-white text-xs rounded-full">
                      {section.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-12 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {docContent[selectedSection]?.title || 'Documentation'}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <button className="flex items-center gap-1 hover:text-gray-900">
                <Bookmark size={14} />
                Bookmark
              </button>
              <button className="flex items-center gap-1 hover:text-gray-900">
                <Share2 size={14} />
                Share
              </button>
              <button className="flex items-center gap-1 hover:text-gray-900">
                <Copy size={14} />
                Copy Link
              </button>
            </div>
          </div>

          <div className="prose max-w-none">
            {docContent[selectedSection]?.content.map((item, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{item.heading}</h2>
                {item.text && <p className="text-gray-600 mb-4">{item.text}</p>}
                {item.code && (
                  <div className="bg-gray-900 text-white rounded-xl p-6 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{item.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronRight size={16} className="rotate-180" />
              Previous
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

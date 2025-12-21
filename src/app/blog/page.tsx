'use client';

import React, { useState } from 'react';
import { ChevronRight, FileText, Clock, Calendar, Filter, ExternalLink } from 'lucide-react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'tutorials', 'news', 'case-studies', 'updates'];

  type GradientKey = 'gradient-1' | 'gradient-2' | 'gradient-3' | 'gradient-4' | 'gradient-5' | 'gradient-6';

  interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    image: GradientKey;
    link: string; 
  }

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Getting Started with Building a Modern Web Portfolio with React',
      excerpt: 'Learn the fundamentals of building modern portfolios with React and Next.js',
      category: 'tutorials',
      author: 'Umar Farouk',
      date: 'Apr 4, 2025',
      readTime: '5 min read',
      image: 'gradient-1',
      link: 'https://blog-phi-five-71.vercel.app/post/building-modern-web-portfolio-react' 
    },
    {
      id: 2,
      title: 'How We Built Our AI-Powered Automation',
      excerpt: 'A deep dive into the architecture and implementation of our automation system',
      category: 'case-studies',
      author: 'Michael Chen',
      date: 'Dec 5, 2024',
      readTime: '8 min read',
      image: 'gradient-2',
      link: 'https://yourblog.com/how-we-built-our-ai-powered-automation'
    },
    {
      id: 3,
      title: 'How to Create Engaging User Interfaces',
      excerpt: '',
      category: 'tutorials',
      author: 'Umar Farouk',
      date: 'Apr 2, 2025',
      readTime: '3 min read',
      image: 'gradient-3',
      link: 'https://blog-phi-five-71.vercel.app/post/create-engaging-user-interfaces'
    },
    {
      id: 4,
      title: 'SEO Best Practices for 2025',
      excerpt: 'Stay ahead with the latest SEO strategies and techniques',
      category: 'tutorials',
      author: 'David Kim',
      date: 'Dec 1, 2024',
      readTime: '6 min read',
      image: 'gradient-4',
      link: 'https://yourblog.com/seo-best-practices-for-2025'
    },
    {
      id: 5,
      title: 'Customer Success Story: TechFlow Inc',
      excerpt: 'How TechFlow increased their conversions by 300% using our platform',
      category: 'case-studies',
      author: 'Lisa Wang',
      date: 'Nov 28, 2024',
      readTime: '7 min read',
      image: 'gradient-5',
      link: 'https://yourblog.com/customer-success-story-techflow-inc'
    },
    {
      id: 6,
      title: 'Industry News: The Future of Web Design',
      excerpt: 'Trends and predictions shaping the future of digital experiences',
      category: 'news',
      author: 'Alex Thompson',
      date: 'Nov 25, 2024',
      readTime: '4 min read',
      image: 'gradient-6',
      link: 'https://yourblog.com/industry-news-future-of-web-design'
    }
  ];

  // Featured post should also have a link
  const featuredPostLink = 'https://yourblog.com/the-ultimate-guide-to-digital-transformation';

  const gradients = {
    'gradient-1': 'from-blue-400 to-purple-500',
    'gradient-2': 'from-green-400 to-teal-500',
    'gradient-3': 'from-orange-400 to-pink-500',
    'gradient-4': 'from-purple-400 to-indigo-500',
    'gradient-5': 'from-teal-400 to-blue-500',
    'gradient-6': 'from-pink-400 to-red-500'
  };

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  // Function to handle external link clicks
  const handleReadArticle = (link: string, isExternal: boolean = true) => {
    if (isExternal) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      // If you had internal routing, you would handle it here
      // router.push(link);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-r from-gray-500 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl text-gray-300">
            Insights, tutorials, and updates from our team
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="grid md:grid-cols-2 gap-8 p-12">
              <div className="text-white">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-4">
                  FEATURED
                </span>
                <h2 className="text-4xl font-bold mb-4">
                  The Ultimate Guide to Digital Transformation
                </h2>
                <p className="text-white/90 mb-6">
                  Everything you need to know about modernizing your business for the digital age
                </p>
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span className="text-sm">Dec 10, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span className="text-sm">10 min read</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleReadArticle(featuredPostLink)}
                  className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 group"
                >
                  Read Article
                  <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl h-full flex items-center justify-center">
                  <FileText size={80} className="text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Latest Posts</h2>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <article 
                key={post.id} 
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all group cursor-pointer"
                onClick={() => handleReadArticle(post.link)}
              >
                <div className={`h-48 bg-gradient-to-br ${gradients[post.image]} relative`}>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-teal-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering parent click
                        handleReadArticle(post.link);
                      }}
                      className="text-teal-600 font-semibold text-sm hover:gap-2 flex items-center gap-1 transition-all group"
                    >
                      Read More
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-500 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-8">
            Get the latest articles and updates delivered to your inbox
          </p>
          <div className="flex gap-4 max-w-md mx-auto text-white">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-500 outline-none"
            />
            <button className="px-6 py-3 bg-gray-900 hover:bg-gray-600 rounded-xl font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
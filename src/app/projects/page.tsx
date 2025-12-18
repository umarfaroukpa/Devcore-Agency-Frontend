'use client';

import React, { useState } from 'react';
import { Briefcase, Clock, Users, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';  
import Image from 'next/image';

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      category: 'web',
      description: 'Full-stack e-commerce solution with payment integration and admin dashboard',
      src: '/AfriDish.png',
      client: 'TechMart Inc.',
      duration: '6 months',
      team: 5,
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      status: 'completed',
      stats: { users: '50K+', revenue: '$2M+', rating: 4.8 }
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      category: 'mobile',
      description: 'Secure mobile banking application with biometric authentication',
      src: '/Academy-hub.png', 
      client: 'FinanceGo',
      duration: '8 months',
      team: 7,
      technologies: ['React Native', 'Firebase', 'Node.js'],
      status: 'completed',
      stats: { downloads: '100K+', rating: 4.9, reviews: '5K+' }
    },
    {
      id: 3,
      title: 'SaaS Analytics Dashboard',
      category: 'web',
      description: 'Real-time analytics platform for business intelligence',
      src: '/asset-manager.png', 
      client: 'DataViz Pro',
      duration: '4 months',
      team: 4,
      technologies: ['Next.js', 'Python', 'MongoDB', 'Chart.js'],
      status: 'in-progress',
      stats: { clients: '500+', data: '1TB+', queries: '10M+' }
    },
    {
      id: 4,
      title: 'Healthcare Management System',
      category: 'web',
      description: 'Comprehensive hospital management and patient care system',
      src: '/care-finder.png', 
      client: 'MediCare Group',
      duration: '12 months',
      team: 10,
      technologies: ['Angular', 'Java', 'MySQL', 'AWS'],
      status: 'completed',
      stats: { hospitals: '25+', patients: '200K+', records: '5M+' }
    },
    {
      id: 5,
      title: 'Social Media App',
      category: 'mobile',
      description: 'Next-generation social networking platform',
      src: '/chatter-app.png', 
      client: 'ConnectHub',
      duration: '10 months',
      team: 8,
      technologies: ['Flutter', 'GraphQL', 'PostgreSQL'],
      status: 'in-progress',
      stats: { users: '1M+', posts: '50M+', engagement: '85%' }
    },
    {
      id: 6,
      title: 'IoT Smart Home Platform',
      category: 'iot',
      description: 'Integrated smart home automation and control system',
      src: '/shorty-app.png', 
      client: 'SmartLife Tech',
      duration: '7 months',
      team: 6,
      technologies: ['React', 'MQTT', 'Python', 'Raspberry Pi'],
      status: 'completed',
      stats: { devices: '10K+', homes: '2K+', automation: '95%' }
    }
  ];

  // Fallback images array for projects without local images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80'
  ];

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'iot', label: 'IoT' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  // Function to check if image exists (will be handled by onError)
  const getImageSrc = (src: string, index: number) => {
    if (!src) return fallbackImages[index % fallbackImages.length];
    return src;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Briefcase size={16} className="mr-2" />
            Our Portfolio
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Projects That <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Make Impact</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our portfolio of successful projects across web, mobile, and IoT platforms
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => {
              const imageSrc = getImageSrc(project.src, index);
              const isLocalImage = project.src && !project.src.startsWith('http');
              
              return (
                <div key={project.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-56 overflow-hidden">
                    {isLocalImage ? (
                      <Image 
                        src={imageSrc}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          // Fallback to Unsplash image if local image doesn't exist
                          e.currentTarget.src = fallbackImages[index % fallbackImages.length];
                        }}
                      />
                    ) : (
                      <img 
                        src={imageSrc}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImages[index % fallbackImages.length];
                        }}
                      />
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-white'
                      }`}>
                        {project.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{project.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{project.team} people</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                      {Object.entries(project.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-sm font-bold text-gray-900">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => router.push(`/projects/use-case/${project.id}`)}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-500 text-white cursor-pointer rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      View Use Cases
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's build something amazing together
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}
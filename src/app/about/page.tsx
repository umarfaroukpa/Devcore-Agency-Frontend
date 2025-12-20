'use client';

import React from 'react';
import { Users, Target, Heart, Zap } from 'lucide-react';
import Image from 'next/image';

export default function AboutUsPage() {
  const stats = [
    { number: '10+', label: 'Projects Completed' },
    { number: '15+', label: 'Happy Clients' },
    { number: '7+', label: 'Team Members' },
    { number: '2+', label: 'Years Experience' }
  ];

  const values = [
    { icon: <Target />, title: 'Excellence', description: 'We strive for perfection in every project' },
    { icon: <Heart />, title: 'Passion', description: 'We love what we do and it shows' },
    { icon: <Zap />, title: 'Innovation', description: 'Pushing boundaries with cutting-edge solutions' },
    { icon: <Users />, title: 'Collaboration', description: 'Working together to achieve greatness' }
  ];

  const team = [
    {
      name: 'Umar Farouk',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3' 
      // powerful futuristic CEO in dark suit + neon city
    },
    {
      name: 'Kaltuma Isa',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3' 
      // cyberpunk woman with holographic code
    },
    {
      name: 'Zahra Ilyas',
      role: 'Lead Designer',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3' 
      // creative designer with tablet + glowing UI
    },
    {
      name: 'Abdurrahman Sudais',
      role: 'Project Manager',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3' 
      // confident woman leading a high-tech meeting
    },
    {
      name: 'ilyas Khalifa',
      role: 'Senior Developer',
      image: 'https://images.stockcake.com/public/c/1/0/c10e9f56-ee79-41dd-a612-97ae5ebb575b_large/futuristic-code-station-stockcake.jpg' 
      // developer in front of huge code screens at night
    },
    {
      name: 'Ammar Hassan',
      role: 'UX Researcher',
      image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3' 
      // woman testing futuristic VR interface
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - you can also replace this one if you want */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Building the <span className="bg-gradient-to-r from-gray-500 to-gray-900 bg-clip-text text-transparent">Future</span> Together
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're a passionate team of developers, designers, and innovators committed to creating exceptional digital experiences.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-3xl font-bold text-gray-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission - unchanged */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            To empower businesses with innovative technology solutions that drive growth, enhance user experiences, and create lasting impact.
          </p>
        </div>
      </section>

      {/* Values - unchanged */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team – now looks incredible */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-gray-500 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Users, Heart, Zap, Trophy, Coffee, Code, Palette, BarChart, Send } from 'lucide-react';

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const jobs = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote / San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $180k',
      icon: Code,
      description: 'We\'re looking for an experienced full stack developer to help build and scale our project management platform.',
      responsibilities: [
        'Design and develop new features for our web application',
        'Write clean, maintainable code following best practices',
        'Collaborate with product and design teams',
        'Mentor junior developers and contribute to code reviews',
        'Optimize application performance and scalability'
      ],
      requirements: [
        '5+ years of experience with React and Node.js',
        'Strong understanding of TypeScript',
        'Experience with PostgreSQL or similar databases',
        'Familiarity with cloud platforms (AWS, GCP, or Azure)',
        'Excellent problem-solving and communication skills'
      ]
    },
    {
      id: 2,
      title: 'Product Designer (UI/UX)',
      department: 'Design',
      location: 'Remote / New York, NY',
      type: 'Full-time',
      salary: '$100k - $150k',
      icon: Palette,
      description: 'Join our design team to create beautiful, intuitive experiences that delight our users.',
      responsibilities: [
        'Design user interfaces for web and mobile applications',
        'Create wireframes, prototypes, and high-fidelity mockups',
        'Conduct user research and usability testing',
        'Collaborate with developers to ensure design implementation',
        'Maintain and evolve our design system'
      ],
      requirements: [
        '4+ years of product design experience',
        'Strong portfolio demonstrating UI/UX skills',
        'Proficiency in Figma or similar design tools',
        'Understanding of design systems and accessibility',
        'Excellent visual design and interaction skills'
      ]
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k - $170k',
      icon: Zap,
      description: 'Help us build and maintain robust infrastructure to support our growing platform.',
      responsibilities: [
        'Manage and optimize cloud infrastructure',
        'Implement CI/CD pipelines and automation',
        'Monitor system performance and reliability',
        'Ensure security best practices across infrastructure',
        'Collaborate with development teams on deployment strategies'
      ],
      requirements: [
        '3+ years of DevOps or SRE experience',
        'Strong knowledge of AWS, Docker, and Kubernetes',
        'Experience with Infrastructure as Code (Terraform, CloudFormation)',
        'Proficiency in scripting languages (Python, Bash)',
        'Understanding of monitoring and logging tools'
      ]
    },
    {
      id: 4,
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote / Austin, TX',
      type: 'Full-time',
      salary: '$80k - $110k',
      icon: Users,
      description: 'Be the advocate for our customers and help them achieve success with our platform.',
      responsibilities: [
        'Build and maintain strong customer relationships',
        'Onboard new customers and provide training',
        'Identify opportunities for account growth',
        'Gather customer feedback and communicate to product team',
        'Create help documentation and best practice guides'
      ],
      requirements: [
        '3+ years in customer success or account management',
        'Experience with B2B SaaS products',
        'Excellent communication and presentation skills',
        'Strong problem-solving abilities',
        'Passion for helping customers succeed'
      ]
    },
    {
      id: 5,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Remote / Boston, MA',
      type: 'Full-time',
      salary: '$90k - $130k',
      icon: BarChart,
      description: 'Drive our marketing strategy and help grow our brand in the project management space.',
      responsibilities: [
        'Develop and execute marketing campaigns',
        'Manage content strategy across multiple channels',
        'Analyze marketing metrics and optimize performance',
        'Collaborate with sales team on lead generation',
        'Oversee social media and community engagement'
      ],
      requirements: [
        '5+ years of marketing experience in tech/SaaS',
        'Strong understanding of digital marketing',
        'Experience with marketing automation tools',
        'Data-driven approach to decision making',
        'Excellent writing and communication skills'
      ]
    },
    {
      id: 6,
      title: 'Junior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$70k - $95k',
      icon: Code,
      description: 'Start your career with us and learn from experienced developers while contributing to real projects.',
      responsibilities: [
        'Build user-facing features with React and TypeScript',
        'Write clean, well-tested code',
        'Participate in code reviews and team meetings',
        'Learn and grow your technical skills',
        'Collaborate with designers and backend developers'
      ],
      requirements: [
        '1-2 years of frontend development experience',
        'Knowledge of React, HTML, CSS, and JavaScript',
        'Understanding of responsive design principles',
        'Willingness to learn and grow',
        'Good communication and teamwork skills'
      ]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision insurance. Mental health support and gym membership.'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Work when you\'re most productive. We trust our team to manage their time effectively.'
    },
    {
      icon: MapPin,
      title: 'Remote First',
      description: 'Work from anywhere. We provide equipment and a home office stipend.'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pay',
      description: 'Industry-leading salaries with equity options. Regular compensation reviews.'
    },
    {
      icon: Trophy,
      title: 'Growth & Learning',
      description: '$2,000 annual learning budget for courses, conferences, and books.'
    },
    {
      icon: Coffee,
      title: 'Time Off',
      description: 'Unlimited PTO, paid parental leave, and company-wide recharge days.'
    }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We encourage creative thinking and aren\'t afraid to try new approaches.'
    },
    {
      title: 'Collaboration',
      description: 'We believe the best work happens when diverse perspectives come together.'
    },
    {
      title: 'Transparency',
      description: 'We communicate openly and honestly with our team and customers.'
    },
    {
      title: 'Impact',
      description: 'We measure success by the positive impact we have on our users.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Join Our Team
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Help us build the future of project management. Work with talented people who are passionate about making a difference.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <strong>{jobs.length}</strong> Open Positions
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <strong>50+</strong> Team Members
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <strong>15+</strong> Countries
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-lg text-gray-600">These principles guide everything we do</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
            <p className="text-lg text-gray-600">We take care of our team</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
          <p className="text-lg text-gray-600">Find your next opportunity</p>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => {
            const Icon = job.icon;
            const isExpanded = selectedJob === job.id;

            return (
              <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setSelectedJob(isExpanded ? null : job.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-blue-600" size={24} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Briefcase size={14} />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <DollarSign size={14} />
                              {job.salary}
                            </span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap">
                          {isExpanded ? 'Close' : 'View Details'}
                        </button>
                      </div>

                      <p className="text-gray-600">{job.description}</p>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="grid md:grid-cols-2 gap-8 pt-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Responsibilities</h4>
                        <ul className="space-y-2">
                          {job.responsibilities.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600 flex gap-2">
                              <span className="text-blue-600">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600 flex gap-2">
                              <span className="text-blue-600">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                        Apply for this position
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-8 -mb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see the right role?</h2>
          <p className="text-xl text-blue-100 mb-8">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@yourcompany.com"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Send Your Resume
            </a>
            <a
              href="#open-positions"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
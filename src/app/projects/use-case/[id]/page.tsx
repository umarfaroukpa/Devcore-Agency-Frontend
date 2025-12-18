
'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle,  Target, Users, DollarSign, Clock, BarChart, Shield, Smartphone, Heart, Zap, Globe, MessageSquare, TrendingUp, Cpu} from 'lucide-react';
import Image from 'next/image';

// Define the project use cases data
const projectUseCases = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'web',
    src: '/AfriDish.png',
    client: 'TechMart Inc.',
    problem: 'Traditional retail struggling with online presence and customer retention',
    overview: 'A modern e-commerce platform designed to handle high traffic, multiple payment options, and personalized shopping experiences.',
    useCases: [
      {
        title: 'Personalized Shopping Experience',
        description: 'AI-powered product recommendations based on browsing history and purchase behavior',
        icon: Users,
        benefits: ['35% increase in average order value', '50% higher customer retention'],
        example: 'Customers who viewed laptops were shown complementary items like bags and accessories'
      },
      {
        title: 'One-Click Checkout',
        description: 'Streamlined checkout process reducing cart abandonment',
        icon: Zap,
        benefits: ['45% reduction in cart abandonment', '60% faster checkout completion'],
        example: 'Registered users can complete purchases in under 30 seconds'
      },
      {
        title: 'Multi-Vendor Marketplace',
        description: 'Platform supporting multiple sellers with individual storefronts',
        icon: Store,
        benefits: ['300+ active vendors', '5000+ product listings added monthly'],
        example: 'Small businesses can create their own branded store within the platform'
      },
      {
        title: 'Real-time Inventory Management',
        description: 'Automatic stock tracking and alert system',
        icon: BarChart,
        benefits: ['99% inventory accuracy', 'Zero overselling incidents'],
        example: 'Automated alerts when products reach low stock levels'
      }
    ],
    targetUsers: ['Online retailers', 'Small business owners', 'Dropshippers', 'Consumers'],
    keyFeatures: [
      'Payment gateway integration (Stripe, PayPal)',
      'Multi-language support',
      'Mobile-responsive design',
      'Advanced search filters',
      'Customer review system'
    ]
  },
  {
    id: 2,
    title: 'Mobile Banking App',
    category: 'mobile',
    src: '/Academy-hub.png',
    client: 'FinanceGo',
    problem: 'Traditional banking apps with poor UX and security concerns',
    overview: 'Secure mobile banking application with biometric authentication and real-time transaction monitoring.',
    useCases: [
      {
        title: 'Biometric Authentication',
        description: 'Face ID and fingerprint recognition for secure login',
        icon: Shield,
        benefits: ['95% reduction in fraud attempts', '100% faster login process'],
        example: 'Users can access their accounts instantly with facial recognition'
      },
      {
        title: 'Real-time Money Transfers',
        description: 'Instant peer-to-peer and bank transfers',
        icon: DollarSign,
        benefits: ['90% faster transfers', '24/7 transaction processing'],
        example: 'Send money to friends instantly using phone numbers'
      },
      {
        title: 'Budget Tracking',
        description: 'Automatic spending categorization and budget monitoring',
        icon: BarChart,
        benefits: ['40% better budget adherence', 'Monthly spending insights'],
        example: 'Users receive weekly spending reports and budget recommendations'
      },
      {
        title: 'Bill Payment Automation',
        description: 'Schedule and automate recurring bill payments',
        icon: Clock,
        benefits: ['Zero late payments', 'Time savings of 3 hours/month'],
        example: 'Automatically pay rent, utilities, and subscriptions'
      }
    ],
    targetUsers: ['Bank customers', 'Small business owners', 'Students', 'Freelancers'],
    keyFeatures: [
      'Push notifications for transactions',
      'Investment portfolio tracking',
      'Loan application processing',
      'ATM/branch locator',
      'Customer support chatbot'
    ]
  },
  {
    id: 3,
    title: 'SaaS Analytics Dashboard',
    category: 'web',
    src: '/asset-manager.png',
    client: 'DataViz Pro',
    problem: 'Businesses struggling with data visualization and decision-making',
    overview: 'Real-time analytics platform providing actionable insights through interactive dashboards.',
    useCases: [
      {
        title: 'Sales Performance Tracking',
        description: 'Monitor sales metrics and team performance in real-time',
        icon: TrendingUp,
        benefits: ['30% increase in sales conversions', 'Better team performance visibility'],
        example: 'Sales managers can track individual rep performance and identify top performers'
      },
      {
        title: 'Customer Behavior Analysis',
        description: 'Track user interactions and identify patterns',
        icon: Users,
        benefits: ['25% higher customer retention', 'Improved product features'],
        example: 'Identify which features are most used and optimize accordingly'
      },
      {
        title: 'Marketing ROI Tracking',
        description: 'Measure effectiveness of marketing campaigns',
        icon: DollarSign,
        benefits: ['40% better marketing spend allocation', 'Clear campaign performance metrics'],
        example: 'Track which marketing channels bring the highest ROI'
      },
      {
        title: 'Operational Efficiency Monitoring',
        description: 'Track system performance and resource utilization',
        icon: Cpu,
        benefits: ['20% reduction in operational costs', 'Better resource allocation'],
        example: 'Monitor server uptime and response times'
      }
    ],
    targetUsers: ['Business executives', 'Marketing teams', 'Sales departments', 'Operations managers'],
    keyFeatures: [
      'Customizable dashboards',
      'Real-time data updates',
      'Export to PDF/Excel',
      'Team collaboration tools',
      'API integration capabilities'
    ]
  },
  {
    id: 4,
    title: 'Healthcare Management System',
    category: 'web',
    src: '/care-finder.png',
    client: 'MediCare Group',
    problem: 'Hospitals managing patient records manually leading to errors',
    overview: 'Comprehensive healthcare management system streamlining patient care and hospital operations.',
    useCases: [
      {
        title: 'Electronic Health Records (EHR)',
        description: 'Digital patient records accessible across departments',
        icon: Heart,
        benefits: ['80% reduction in paperwork', 'Instant access to patient history'],
        example: 'Doctors can access patient allergies and medications instantly'
      },
      {
        title: 'Appointment Scheduling',
        description: 'Automated appointment booking and reminders',
        icon: Clock,
        benefits: ['90% appointment adherence', 'No-show rate reduced by 60%'],
        example: 'Patients receive SMS/email reminders 24 hours before appointments'
      },
      {
        title: 'Billing & Insurance Processing',
        description: 'Automated billing and insurance claim processing',
        icon: DollarSign,
        benefits: ['70% faster claim processing', 'Reduced billing errors'],
        example: 'Automatic insurance eligibility verification'
      },
      {
        title: 'Pharmacy Management',
        description: 'Track medication inventory and prescriptions',
        icon: Pill,
        benefits: ['99% medication availability', 'Reduced wastage'],
        example: 'Automatic alerts for low-stock medications'
      }
    ],
    targetUsers: ['Hospitals', 'Clinics', 'Pharmacies', 'Insurance companies', 'Patients'],
    keyFeatures: [
      'Telemedicine integration',
      'Lab report management',
      'Staff scheduling',
      'Inventory management',
      'Patient portal'
    ]
  },
  {
    id: 5,
    title: 'Social Media App',
    category: 'mobile',
    src: '/chatter-app.png',
    client: 'ConnectHub',
    problem: 'Existing platforms lacking meaningful connections and privacy',
    overview: 'Next-generation social networking focusing on authentic connections and privacy.',
    useCases: [
      {
        title: 'Interest-Based Communities',
        description: 'Connect with people sharing similar interests',
        icon: Users,
        benefits: ['85% higher engagement', 'Meaningful conversations'],
        example: 'Photography enthusiasts sharing tips and organizing meetups'
      },
      {
        title: 'Content Creation Tools',
        description: 'Advanced editing tools for photos and videos',
        icon: Camera,
        benefits: ['2x more user-generated content', 'Higher quality posts'],
        example: 'Built-in filters and editing tools for photos'
      },
      {
        title: 'Privacy-First Design',
        description: 'Granular control over content visibility',
        icon: Shield,
        benefits: ['Users feel safer sharing', 'Reduced harassment cases'],
        example: 'Choose exactly who can see each post'
      },
      {
        title: 'Event Organization',
        description: 'Create and manage social events',
        icon: Calendar,
        benefits: ['Easy event discovery', 'Higher attendance rates'],
        example: 'Local meetups and virtual hangouts'
      }
    ],
    targetUsers: ['Social media users', 'Content creators', 'Community managers', 'Event organizers'],
    keyFeatures: [
      'End-to-end encryption',
      'Story features',
      'Live streaming',
      'Direct messaging',
      'Analytics for creators'
    ]
  },
  {
    id: 6,
    title: 'IoT Smart Home Platform',
    category: 'iot',
    src: '/shorty-app.png',
    client: 'SmartLife Tech',
    problem: 'Home automation systems working in isolation',
    overview: 'Integrated smart home platform connecting all devices through a single interface.',
    useCases: [
      {
        title: 'Energy Management',
        description: 'Automated control of heating, cooling, and lighting',
        icon: Zap,
        benefits: ['30% energy savings', 'Reduced carbon footprint'],
        example: 'Lights automatically turn off when room is empty'
      },
      {
        title: 'Security Monitoring',
        description: '24/7 surveillance and alert system',
        icon: Shield,
        benefits: ['90% faster incident response', 'Peace of mind'],
        example: 'Motion detection alerts sent to phone'
      },
      {
        title: 'Voice Control Integration',
        description: 'Control devices using voice commands',
        icon: Mic,
        benefits: ['Hands-free operation', 'Accessibility for all'],
        example: "Turn on lights with 'Hey Google, lights on'"
      },
      {
        title: 'Routine Automation',
        description: 'Create custom automation scenarios',
        icon: Clock,
        benefits: ['Daily time savings', 'Consistent routines'],
        example: 'Morning routine: lights gradually brighten, coffee starts brewing'
      }
    ],
    targetUsers: ['Homeowners', 'Property managers', 'Elderly/disabled individuals', 'Tech enthusiasts'],
    keyFeatures: [
      'Cross-platform compatibility',
      'Remote access',
      'Energy usage reports',
      'Device health monitoring',
      'Family sharing'
    ]
  }
];

// Icons that need to be imported
import { Store, Camera,  Calendar, Mic, Pill } from 'lucide-react';
   
  
export default function UseCasePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  
  const project = projectUseCases.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Use Case Not Found</h2>
          <p className="text-gray-600 mb-6">The requested project use case doesn't exist.</p>
          <button
            onClick={() => router.push('/projects')}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-900 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-500 text-white">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
              <Image
                src={project.src}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 96px, 128px"
              />
            </div>
            
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-3">
                {project.category.toUpperCase()}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h1>
              <p className="text-blue-100 mb-4">Client: {project.client}</p>
              <p className="text-lg max-w-3xl">{project.overview}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-50 to-pink-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Problem Statement</h2>
            </div>
            <p className="text-gray-700 text-lg">{project.problem}</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Key Use Cases
          </h2>
          
          <div className="space-y-6">
            {project.useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-900 to-gray-500 text-white cursor-pointer rounded-xl flex items-center justify-center mb-4">
                        <Icon className="text-white" size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{useCase.title}</h3>
                      <div className="text-sm text-blue-600 font-medium">Use Case #{index + 1}</div>
                    </div>
                    
                    <div className="md:w-3/4 space-y-4">
                      <p className="text-gray-700">{useCase.description}</p>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-600" />
                          Benefits Achieved:
                        </h4>
                        <ul className="space-y-1">
                          {useCase.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Real-world Example:</h4>
                        <p className="text-gray-700">{useCase.example}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Users & Features */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Target Users */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Target Users</h3>
              </div>
              <ul className="space-y-3">
                {project.targetUsers.map((user, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {user}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="text-purple-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Key Features</h3>
              </div>
              <ul className="space-y-3">
                {project.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-gray-900 to-gray-500 text-white cursor-pointer">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Need a Similar Solution?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how we can build something amazing for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/contact')}
              className="px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-500 text-white cursor-pointer rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl"
            >
              Start Your Project
            </button>
            <button
              onClick={() => router.push('/projects')}
              className="px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-500 text-white cursor-pointer rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              View More Projects
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
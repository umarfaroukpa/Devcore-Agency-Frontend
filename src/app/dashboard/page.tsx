'use client';

import React, { useState, useEffect } from 'react';
import { Users, Layers, Clock, Settings, Zap, ArrowRight, Bell, FileText, CheckCircle, Lock, LucideIcon } from 'lucide-react';
  

interface IUser {
  firstName?: string;
  email: string;
  role?: string | null;
  
}

interface IStatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface IActivityItem {
  time: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

interface IServiceStatusProps {
    name: string;
    status: 'Operational' | 'Degraded';
}

interface IStatCardProps extends IStatItem {}
interface IActivityItemProps extends IActivityItem {}
interface ILinkProps {
    href: string;
    children: React.ReactNode;
    className: string;
}

// Mock the useRouter functionality
const useRouter = () => {
    const navigate = (path: string) => {
        if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    return { push: navigate };
};

// Mock the Link component to handle navigation manually
const Link = ({ href, children, className }: ILinkProps) => (
    <a href={href} className={className} onClick={(e) => {
        e.preventDefault();
        window.location.href = href;
    }}>
        {children}
    </a>
);

// Mocking the data structure for general stats
const mockStats: IStatItem[] = [
  { 
    title: "Active Users", 
    value: "1,293", 
    icon: Users, 
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  { 
    title: "Total Projects", 
    value: "154", 
    icon: Layers, 
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  { 
    title: "Pending Approvals", 
    value: "12", 
    icon: FileText, 
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  { 
    title: "System Uptime", 
    value: "99.9%", 
    icon: Zap, 
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
];

// Mocking recent activity data
const mockActivity: IActivityItem[] = [
  { time: "2 min ago", description: "Updated profile information.", icon: Settings, color: "text-blue-500" },
  { time: "1 hour ago", description: "Created a new support ticket.", icon: FileText, color: "text-amber-500" },
  { time: "3 hours ago", description: "System health check passed.", icon: CheckCircle, color: "text-emerald-500" },
  { time: "Yesterday", description: "Logged in from a new device.", icon: Lock, color: "text-red-500" },
];

// Utility function to get user data from localStorage
const getClientUser = (): IUser | null => {
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem('user');
    //  user object stored in localStorage matches the IUser interface
    return userJson ? JSON.parse(userJson) as IUser : null;
  }
  return null;
};

const StatCard: React.FC<IStatCardProps> = ({ title, value, icon: Icon, color, bgColor }) => (
  <div className={`p-5 ${bgColor} rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg`}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    <div className={`mt-2 text-sm font-medium ${color}`}>
      {title === "System Uptime" ? "Status OK" : "View Details"}
    </div>
  </div>
);

const ActivityItem: React.FC<IActivityItemProps> = ({ time, description, icon: Icon, color }) => (
  <li className="flex items-start space-x-4 py-3 border-b border-gray-100 last:border-b-0">
    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${color} bg-opacity-10 flex-shrink-0`}>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-700 truncate">{description}</p>
      <p className="text-xs text-gray-500 mt-0.5">{time}</p>
    </div>
  </li>
);

export default function GeneralDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    // Run only on client side
    setIsClient(true);
    const clientUser = getClientUser();
    
    // Simple check for unauthorized access
    if (!clientUser || !localStorage.getItem('token')) {
        // Redirect to login if not authenticated
        router.push('/login'); 
        return;
    }
    
    setUser(clientUser);

    // If the role IS defined, redirect to the specific dashboard (as a failsafe)
    const role = clientUser.role?.toUpperCase();
    if (role === 'ADMIN') {
      router.push('/dashboard/admin');
    } else if (role === 'DEVELOPER') {
      router.push('/dashboard/developer');
    } else if (role === 'CLIENT') {
      router.push('/dashboard/clients');
    } 
    // If the role is null or not recognized, we stay on this general page ('/dashboard')
    
  }, []);
  
  if (!isClient || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Type safe access to user properties
  const firstName = user.firstName || user.email.split('@')[0];
  const userRole = user.role || 'General User';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      
      {/* Sidebar (Simple Mock) */}
      <aside className="lg:w-64 w-full bg-white border-r border-gray-100 p-6 shadow-xl lg:shadow-none sticky top-0 z-10">
        <div className="mb-10 hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Devcore</span>
          </Link>
        </div>

        <nav className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Navigation</h4>
            {[
                { name: 'Dashboard', href: '/dashboard', icon: Layers, current: true },
                { name: 'Notifications', href: '/notifications', icon: Bell, current: false },
                { name: 'Settings', href: '/settings', icon: Settings, current: false },
            ].map((item) => (
                <Link key={item.name} href={item.href} className={`flex items-center p-3 rounded-xl transition-colors ${item.current ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                </Link>
            ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Hello, {firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome to your **{userRole}** Overview Dashboard. Here’s what’s happening across the platform.
          </p>
        </header>

        {/* 1. Key Metrics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {mockStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                Recent Platform Activity
              </h2>
              <ul className="divide-y divide-gray-100">
                {mockActivity.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </ul>
              <button 
                className="mt-4 text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
                onClick={() => router.push('/activity-log')}
              >
                View Full Log <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Quick Actions (Call to Action) */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl">
              <h2 className="2xl font-bold mb-2">Need Help Getting Started?</h2>
              <p className="mb-6 opacity-90">
                Access our detailed documentation or file a support ticket instantly.
              </p>
              <div className="flex space-x-4">
                <button className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition-colors">
                  Read Documentation
                </button>
                <button className="px-5 py-2.5 bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:bg-blue-800 transition-colors">
                  File Support Ticket
                </button>
              </div>
            </div>

          </div>
          
          {/* Right Column (1/3 width on large screens) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* User Profile Summary */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-700 border-4 border-white shadow-md">
                {firstName.charAt(0)}
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">{firstName}</h3>
              <p className="text-sm text-blue-600 font-medium">{userRole}</p>
              <p className="text-sm text-gray-500 mt-1 truncate">{user.email}</p>
              <button 
                className="mt-4 w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm"
                onClick={() => router.push('/settings/profile')}
              >
                Edit Profile
              </button>
            </div>
            
            {/* System Health Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" />
                API & Service Health
              </h2>
              <div className="space-y-3">
                <ServiceStatus name="Authentication Service" status="Operational" />
                <ServiceStatus name="Database (Prisma)" status="Operational" />
                <ServiceStatus name="File Storage" status="Degraded" />
                <ServiceStatus name="Notification Queue" status="Operational" />
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

// Separate component for readability
const ServiceStatus: React.FC<IServiceStatusProps> = ({ name, status }) => {
    const isOperational: boolean = status === 'Operational';
    const color: string = isOperational ? 'text-emerald-500' : 'text-amber-500';
    const dot: string = isOperational ? 'bg-emerald-500' : 'bg-amber-500';

    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">{name}</span>
            <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${dot}`}></span>
                <span className={`font-medium ${color}`}>{status}</span>
            </div>
        </div>
    );
}
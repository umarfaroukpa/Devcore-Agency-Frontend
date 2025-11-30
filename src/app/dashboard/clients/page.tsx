'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { Briefcase, DollarSign, CheckCircle, Plus, Users, Calendar } from 'lucide-react';

interface Member {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  members?: Member[]; 
}

export default function ClientDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clients/projects');
      setProjects(response.data.projects || response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to count members
  const getTotalMembers = () => {
    return projects.reduce((sum, p) => sum + (p.members?.length || 0), 0);
  };

  const stats = [
    { 
      label: 'Active Projects', 
      value: projects.filter(p => p.status === 'IN_PROGRESS').length,
      icon: Briefcase,
      color: 'blue'
    },
    { 
      label: 'Completed', 
      value: projects.filter(p => p.status === 'COMPLETED').length,
      icon: CheckCircle,
      color: 'green'
    },
    { 
      label: 'Total Budget', 
      value: `$${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'purple'
    },
    { 
      label: 'Team Members', 
      value: getTotalMembers(),
      icon: Users,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Dashboard</h1>
            <p className="text-gray-600">Track your projects and progress</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/clients/projects/new')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            <Plus size={20} />
            Create New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className={`text-${stat.color}-600`} size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h2>
          
          {projects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first project</p>
              <button
                onClick={() => router.push('/dashboard/clients/projects/new')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                <Plus size={20} />
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/dashboard/clients/projects/${project.id}`)}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                      project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      project.status === 'REVIEW' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-gray-600">
                    {project.budget !== undefined && project.budget !== null && (
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="flex-shrink-0" />
                        <span>${project.budget.toLocaleString()}</span>
                      </div>
                    )}
                    {project.startDate && (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="flex-shrink-0" />
                        <span>{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {project.members && project.members.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="flex-shrink-0" />
                        <span>
                          {project.members.length} {project.members.length === 1 ? 'member' : 'members'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
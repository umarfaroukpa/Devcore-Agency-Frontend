'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, CheckCircle, DollarSign,  Plus, MessageSquare, FileText, Calendar } from 'lucide-react';
  

export default function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalInvestment: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch projects
      const projectsRes = await fetch('/api/client/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const projectsData = await projectsRes.json();
      setProjects(projectsData.projects);

      // Calculate stats
      const stats = {
        activeProjects: projectsData.projects.filter((p: any) => p.status === 'IN_PROGRESS').length,
        completedProjects: projectsData.projects.filter((p: any) => p.status === 'COMPLETED').length,
        totalInvestment: projectsData.projects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0),
        pendingTasks: 12 // Mock
      };
      setStats(stats);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching client data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Active Projects', value: stats.activeProjects, icon: Briefcase, color: 'blue' },
    { title: 'Completed', value: stats.completedProjects, icon: CheckCircle, color: 'green' },
    { title: 'Total Investment', value: `$${stats.totalInvestment.toLocaleString()}`, icon: DollarSign, color: 'purple' },
    { title: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'orange' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Dashboard</h1>
            <p className="text-gray-600">Track your projects and progress</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
            <Plus size={20} />
            New Project
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className={`text-${stat.color}-600`} size={24} />
                </div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your Projects</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project: any) => (
              <div key={project.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    <span>${project.budget?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <FileText size={16} />
                    View Details
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
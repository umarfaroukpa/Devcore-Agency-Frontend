'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import { ArrowLeft, DollarSign, Calendar, Users, Mail } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  clientName: string;
  clientEmail: string;
  tasks?: any[];
  members?: any[];
}

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/clients/projects/${projectId}`);
      setProject(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to load project:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project doesn't exist or you don't have access.</p>
          <button
            onClick={() => router.push('/dashboard/clients')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push('/dashboard/clients')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-lg text-gray-600 mt-2">
            {project.description || 'No description provided.'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-2xl font-bold mt-2 text-blue-600">
              {project.status.replace('_', ' ')}
            </p>
          </div>
          
          {project.budget && (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <DollarSign size={16} />
                Budget
              </p>
              <p className="text-2xl font-bold mt-2">
                ${project.budget.toLocaleString()}
              </p>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500">Client</p>
            <p className="text-xl font-medium mt-2">{project.clientName}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Mail size={16} />
              Email
            </p>
            <p className="text-sm font-medium mt-2 truncate">{project.clientEmail}</p>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Tasks</h2>
          {project.tasks && project.tasks.length > 0 ? (
            <div className="space-y-4">
              {project.tasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    {task.priority && (
                      <span className="text-xs text-gray-500">Priority: {task.priority}</span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No tasks added yet.</p>
          )}
        </div>

        {/* Members Section */}
        {project.members && project.members.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users size={24} />
              Team Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.members.map((member: any) => (
                <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.user?.firstName} {member.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{member.user?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
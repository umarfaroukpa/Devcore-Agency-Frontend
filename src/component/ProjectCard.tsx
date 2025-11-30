'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api'; 
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  clientName: string;
  clientEmail: string;
  tasks?: any[];
  members?: any[];
}

export default function ProjectClient({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/clients/projects/${projectId}`);
        setProject(res.data.data || res.data);
      } catch (err: any) {
        console.error('Failed to load project:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or you don't have access.</p>
          <Link
            href="/dashboard/clients/projects"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-lg text-gray-600 mt-2">
            {project.description || 'No description provided.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-2xl font-bold mt-2 text-blue-600">
              {project.status.replace('_', ' ')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500">Budget</p>
            <p className="text-2xl font-bold mt-2">
              ${project.budget?.toLocaleString() || '—'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500">Client</p>
            <p className="text-xl font-medium mt-2">{project.clientName}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-xl font-medium mt-2">{project.clientEmail}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold mb-6">Tasks</h2>
          {project.tasks && project.tasks.length > 0 ? (
            <div className="space-y-4">
              {project.tasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    {task.priority && <span className="text-xs text-gray-500">Priority: {task.priority}</span>}
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
      </div>
    </div>
  );
}
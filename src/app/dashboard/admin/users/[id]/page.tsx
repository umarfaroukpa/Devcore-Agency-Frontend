'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import { ArrowLeft, Mail, Phone, Calendar, CheckCircle, XCircle,  Briefcase, CheckSquare, Code, Shield, Github, Globe, Award, Edit, Trash2, UserCheck } from 'lucide-react';
  
 
interface User {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  isApproved: boolean | null;
  companyName?: string;
  industry?: string;
  position?: string;
  skills?: string;
  experience?: string;
  githubUsername?: string;
  portfolio?: string;
  createdAt: string;
  updatedAt: string;
  assignedTasks?: Array<{ id: string; title: string; status: string }>;
  projects?: Array<{ id: string; name: string; status: string }>;
}

export default function ViewUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users/${userId}`);
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('User deleted successfully');
      router.push('/dashboard/admin');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-8">The user doesn't exist or you don't have access.</p>
          <button
            onClick={() => router.push('/dashboard/admin')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const skills = user.skills ? JSON.parse(user.skills) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push('/dashboard/admin')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0) || ''}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'DEVELOPER' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                  {user.isApproved ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <UserCheck size={16} />
                      Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      <XCircle size={16} />
                      Pending
                    </span>
                  )}
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    user.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/dashboard/admin/users/${userId}/edit`)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700"
              >
                <Edit size={18} />
                Edit User
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900 font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="text-gray-900 font-medium">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-900 font-medium">
                  {new Date(user.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role-Specific Information */}
          {user.role === 'CLIENT' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase size={24} />
                Company Information
              </h2>
              <div className="space-y-4">
                {user.companyName && (
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="text-gray-900 font-medium">{user.companyName}</p>
                  </div>
                )}
                {user.industry && (
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="text-gray-900 font-medium">{user.industry}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {user.role === 'DEVELOPER' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Code size={24} />
                Developer Profile
              </h2>
              <div className="space-y-4">
                {skills.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {user.experience && (
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Experience Level</p>
                      <p className="text-gray-900 font-medium">{user.experience}</p>
                    </div>
                  </div>
                )}
                
                {user.githubUsername && (
                  <div className="flex items-center gap-2">
                    <Github size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">GitHub</p>
                      <a 
                        href={`https://github.com/${user.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        @{user.githubUsername}
                      </a>
                    </div>
                  </div>
                )}
                
                {user.portfolio && (
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Portfolio</p>
                      <a 
                        href={user.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {user.portfolio}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {user.role === 'ADMIN' && user.position && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={24} />
                Admin Information
              </h2>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="text-gray-900 font-medium">{user.position}</p>
              </div>
            </div>
          )}

          {/* Projects */}
          {user.projects && user.projects.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase size={24} />
                Projects ({user.projects.length})
              </h2>
              <div className="space-y-3">
                {user.projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">{project.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {user.assignedTasks && user.assignedTasks.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckSquare size={24} />
                Assigned Tasks ({user.assignedTasks.length})
              </h2>
              <div className="space-y-3">
                {user.assignedTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
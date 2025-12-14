'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import ProtectedRoute from '../../../../../component/protectedRoutes';
import { 
  ArrowLeft, Edit2, Trash2, Calendar, Users, Briefcase, 
  CheckCircle, Clock, FileText, Target, DollarSign, 
  ChevronRight, User, Mail, Phone, Building, 
  Activity, CheckSquare, AlertCircle
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate?: string;
  endDate?: string;
  budget?: number;
  progress: number;
  clientId: string;
  client: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone?: string | null;
    companyName?: string | null;
  };
  tasks: Array<{
    id: string;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
    priority: string;
    dueDate?: string;
    assignee?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
  }>;
  activityLogs?: Array<{
    id: string;
    type: string;
    details: any;
    createdAt: string;
    performer?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  _count?: {
    tasks: number;
    members: number;
  };
}

// Helper function to get initials
const getInitials = (firstName: string | null, lastName: string | null, email: string) => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  } else if (firstName) {
    return firstName[0].toUpperCase();
  } else if (lastName) {
    return lastName[0].toUpperCase();
  } else {
    return email[0].toUpperCase();
  }
};

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/projects/${projectId}`);
      setProject(response.data.data);
    } catch (error: any) {
      console.error('Error fetching project:', error);
      alert(error.response?.data?.error || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await api.delete(`/admin/projects/${projectId}`);
      alert('Project deleted successfully');
      router.push('/dashboard/admin/projects');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete project');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS': return 'bg-green-100 text-green-700';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED': return 'bg-purple-100 text-purple-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-700';
      case 'DONE': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getClientName = () => {
    if (!project?.client) return 'Unknown Client';
    const { firstName, lastName, email } = project.client;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return email;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <button
            onClick={() => router.push('/dashboard/admin/projects')}
            className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/dashboard/admin/projects')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft size={20} />
              Back to Projects
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority} Priority
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/dashboard/admin/projects/${projectId}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-blue-700"
                >
                  <Edit2 size={18} />
                  Edit Project
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 cursor-pointer"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Project Progress</h2>
              <span className="text-2xl font-bold text-gray-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-gray-600 to-gray-900 h-4 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Project Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {project.description && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Description
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">{project.description}</p>
                </div>
              )}

              {/* Tasks */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CheckSquare size={20} />
                    Tasks ({project.tasks?.length || 0})
                  </h3>
                  <button
                    onClick={() => router.push('/dashboard/admin/tasks?project=' + projectId)}
                    className="text-sm text-gray-900 hover:text-gray-500 cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
                
                {project.tasks && project.tasks.length > 0 ? (
                  <div className="space-y-3">
                    {project.tasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => router.push(`/dashboard/admin/tasks/${task.id}`)}
                        className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            {task.assignee && (
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                {task.assignee.firstName} {task.assignee.lastName}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-3">No tasks yet</p>
                    <button
                      onClick={() => router.push('/dashboard/admin/tasks?newProjectId=' + projectId)}
                      className="text-sm text-gray-900 hover:text-gray-500 cursor-pointer"
                    >
                      Create first task
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              {project.activityLogs && project.activityLogs.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Activity size={20} />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {project.activityLogs.map((log) => (
                      <div key={log.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Activity size={14} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 capitalize">
                              {log.type.toLowerCase().replace('_', ' ')}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {log.performer && (
                            <p className="text-sm text-gray-600">
                              By {log.performer.firstName} {log.performer.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Info & Members */}
            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium text-gray-900">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium text-gray-900">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                  </div>
                  {project.budget && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-medium text-gray-900">
                          ${project.budget.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {getClientName()}
                      </p>
                      <p className="text-sm text-gray-600">Primary Contact</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">{project.client.email}</p>
                      <p className="text-sm text-gray-600">Email</p>
                    </div>
                  </div>
                  {project.client.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">{project.client.phone}</p>
                        <p className="text-sm text-gray-600">Phone</p>
                      </div>
                    </div>
                  )}
                  {project.client.companyName && (
                    <div className="flex items-center gap-3">
                      <Building className="text-gray-400" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">{project.client.companyName}</p>
                        <p className="text-sm text-gray-600">Company</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users size={20} />
                    Team ({project.members?.length || 0 + 1})
                  </h3>
                  <button
                    onClick={() => router.push(`/dashboard/admin/projects/${projectId}/edit#members`)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Manage
                  </button>
                </div>
                <div className="space-y-3">
                  {/* Client */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium">
                      {getInitials(project.client.firstName, project.client.lastName, project.client.email)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {getClientName()}
                      </p>
                      <p className="text-xs text-gray-600">Client</p>
                    </div>
                  </div>

                  {/* Team Members */}
                  {project.members && project.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium">
                        {getInitials(member.user.firstName, member.user.lastName, member.user.email)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-600">{member.role}</p>
                          <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">
                            {member.user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Delete Project</h2>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-500" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Are you sure?</p>
                  <p className="text-sm text-gray-600 mt-1">
                    This will permanently delete "{project.name}" and all associated data.
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/api';
import ProtectedRoute from '../../../../../../component/protectedRoutes';
import { 
  ArrowLeft, Save, X, Plus, Trash2, User, Mail, 
  Briefcase, Calendar, DollarSign, AlertCircle,
  Users, CheckCircle
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
  progress?: number;
  clientId: string;
  client: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone?: string | null;
    companyName?: string | null;
  };
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
}

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
}

interface MemberForm {
  userId: string;
  role: string;
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

const getClientName = (client: Project['client']) => {
  if (!client) return 'Unknown Client';
  const { firstName, lastName, email } = client;
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return email;
};

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [clients, setClients] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMember, setNewMember] = useState<MemberForm>({ userId: '', role: 'Developer' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    status: 'PLANNING' as const,
    priority: 'MEDIUM' as const,
    startDate: '',
    endDate: '',
    budget: '',
    progress: '0'
  });

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch project details
      const projectRes = await api.get(`/admin/projects/${projectId}`);
      const projectData = projectRes.data.data;
      setProject(projectData);

      // Set form data with null safety
      setFormData({
        name: projectData.name || '',
        description: projectData.description || '',
        clientId: projectData.clientId || '',
        status: projectData.status || 'PLANNING',
        priority: projectData.priority || 'MEDIUM',
        startDate: projectData.startDate ? projectData.startDate.split('T')[0] : '',
        endDate: projectData.endDate ? projectData.endDate.split('T')[0] : '',
        budget: projectData.budget?.toString() || '',
        progress: projectData.progress?.toString() || '0' //Added optional chaining
      });

      // Fetch users for dropdowns
      const usersRes = await api.get('/admin/users');
      const usersData = usersRes.data.data || [];

      setClients(usersData.filter((user: User) => user.role === 'CLIENT'));
      setManagers(usersData.filter((user: User) => 
        user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'DEVELOPER'
      ));
      
      // Get available team members (exclude current members)
      const currentMemberIds = new Set(projectData.members?.map((m: any) => m.user.id) || []);
      setTeamMembers(
        usersData.filter((user: User) => 
          (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'DEVELOPER') &&
          !currentMemberIds.has(user.id)
        )
      );

    } catch (error: any) {
      console.error('Error fetching data:', error);
      alert(error.response?.data?.error || 'Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const updateData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        progress: parseInt(formData.progress) || 0 //Default to 0 if parsing fails
      };

      // Remove empty fields that shouldn't be sent
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === '') {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await api.patch(`/admin/projects/${projectId}`, updateData);
      alert('Project updated successfully');
      router.push(`/dashboard/admin/projects/${projectId}`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.userId) {
      alert('Please select a team member');
      return;
    }

    try {
      await api.post(`/admin/projects/${projectId}/members`, newMember);
      alert('Team member added successfully');
      setShowMemberModal(false);
      setNewMember({ userId: '', role: 'Developer' });
      fetchData(); // Refresh project data
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add team member');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      await api.delete(`/admin/projects/${projectId}/members/${memberId}`);
      alert('Team member removed successfully');
      fetchData(); // Refresh project data
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to remove team member');
    }
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
      <div className="min-h-screen flex items-center justify-center mt-8">
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push(`/dashboard/admin/projects/${projectId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft size={20} />
              Back to Project
            </button>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Project</h1>
                <p className="text-gray-600">Update project details and team members</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    placeholder="Project description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client *
                    </label>
                    <select
                      required
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    >
                      <option value="">Select Client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {getClientName({
                              firstName: client.firstName,
                              lastName: client.lastName,
                              email: client.email,
                              id: ''
                          })} ({client.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Progress
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="absolute right-0 top-0 text-sm font-medium text-gray-700">
                        {formData.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Project Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    >
                      <option value="PLANNING">Planning</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Team Members Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                <button
                  type="button"
                  onClick={() => setShowMemberModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add Member
                </button>
              </div>

              {/* Current Client */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Client</h3>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium">
                    {getInitials(project.client.firstName, project.client.lastName, project.client.email)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {getClientName(project.client)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={14} className="text-gray-400" />
                      <p className="text-sm text-gray-600">{project.client.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Client
                  </span>
                </div>
              </div>

              {/* Team Members List */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Team Members ({project.members?.length || 0})</h3>
                {project.members && project.members.length > 0 ? (
                  <div className="space-y-3">
                    {project.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium">
                            {getInitials(member.user.firstName, member.user.lastName, member.user.email)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.user.firstName} {member.user.lastName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-600">{member.role}</p>
                              <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">
                                {member.user.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.user.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                    <Users className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-gray-600 mb-2">No team members added yet</p>
                    <button
                      type="button"
                      onClick={() => setShowMemberModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Add your first team member
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push(`/dashboard/admin/projects/${projectId}`)}
                className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Save size={20} />
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer">Add Team Member</h2>
                <button
                  onClick={() => setShowMemberModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Team Member *
                  </label>
                  <select
                    value={newMember.userId}
                    onChange={(e) => setNewMember({ ...newMember, userId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select a team member</option>
                    {teamMembers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {getClientName({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            id: ''
                        })} ({user.role})
                      </option>
                    ))}
                  </select>
                  {teamMembers.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      All available team members are already added to this project.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Developer, Designer, Manager"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!newMember.userId || !newMember.role}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import ProtectedRoute from '../../../component/protectedRoutes';
import {  Users, Briefcase, CheckSquare, Shield, Search, Eye, Trash2, Edit,  UserPlus, ArrowRight, Clock, FileText, Settings, BarChart, Users as UsersIcon, CheckSquare as TasksIcon, FolderGit2 } from 'lucide-react';
 
 

interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DEVELOPER' | 'CLIENT' | 'SUPER_ADMIN';
  createdAt: string;
  isApproved?: boolean;
  isActive?: boolean;
}

interface Stats {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
  pendingApprovals: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    pendingApprovals: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const usersResponse = await api.get('/admin/users');
      const usersData = usersResponse.data.data || usersResponse.data || [];

      const formattedUsers: User[] = usersData.map((user: any) => ({
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed',
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        isApproved: user.isApproved,
        isActive: user.isActive ?? true,
      }));

      setUsers(formattedUsers);

      // TODO: Fetch actual project and task counts
      // const projectsResponse = await api.get('/admin/projects');
      // const tasksResponse = await api.get('/admin/tasks');

      setStats({
        totalUsers: formattedUsers.length,
        totalProjects: 0, // Replace with actual count
        totalTasks: 0, // Replace with actual count
        pendingApprovals: formattedUsers.filter((u: User) => 
          (u.role === 'DEVELOPER' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN') && u.isApproved !== true
        ).length
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'blue',
      change: '+12%'
    },
    { 
      title: 'Projects', 
      value: stats.totalProjects, 
      icon: Briefcase, 
      color: 'green',
      change: '+8%'
    },
    { 
      title: 'Tasks', 
      value: stats.totalTasks, 
      icon: CheckSquare, 
      color: 'purple',
      change: '+15%'
    },
    { 
      title: 'Pending Approvals', 
      value: stats.pendingApprovals, 
      icon: Shield, 
      color: 'orange',
      change: '-3%'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View, edit, and manage all users',
      icon: UsersIcon,
      color: 'bg-blue-500',
      iconColor: 'text-blue-100',
      route: '/dashboard/admin/users'
    },
    {
      title: 'Task Management',
      description: 'Create and assign tasks',
      icon: TasksIcon,
      color: 'bg-green-500',
      iconColor: 'text-green-100',
      route: '/dashboard/admin/task'
    },
    {
      title: 'Project Management',
      description: 'Manage all projects',
      icon: FolderGit2,
      color: 'bg-purple-500',
      iconColor: 'text-purple-100',
      route: '/dashboard/admin/projects'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      color: 'bg-gray-600',
      iconColor: 'text-gray-100',
      route: '/dashboard/admin/settings'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'created a new project', time: '2 hours ago', type: 'project' },
    { id: 2, user: 'Jane Smith', action: 'completed task #245', time: '4 hours ago', type: 'task' },
    { id: 3, user: 'Mike Johnson', action: 'updated profile', time: '6 hours ago', type: 'user' },
    { id: 4, user: 'Sarah Wilson', action: 'submitted a ticket', time: '1 day ago', type: 'ticket' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage users, projects, tasks, and system settings</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/dashboard/admin/reports')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <BarChart size={18} />
                  Reports
                </button>
                <button
                  onClick={() => router.push('/dashboard/admin/users/invite')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <UserPlus size={18} />
                  Invite User
                </button>
              </div>
            </div>
          </div>

          {/* Pending Approvals Banner */}
          {stats.pendingApprovals > 0 && (
            <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="text-orange-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-900 text-lg">
                      {stats.pendingApprovals} {stats.pendingApprovals === 1 ? 'User' : 'Users'} Awaiting Approval
                    </h3>
                    <p className="text-sm text-orange-700">
                      Review and approve new developer and admin applications
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/dashboard/admin/approvals')}
                  className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  Review Now
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 ${stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'green' ? 'bg-green-100' : stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'} rounded-xl`}>
                          <IconComponent className={stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'} size={22} />
                        </div>
                        <span className="text-xs font-medium text-green-600">{stat.change}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                  <span className="text-sm text-gray-500">Manage your workspace</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => router.push(action.route)}
                        className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                      >
                        <div className={`${action.color} p-3 rounded-xl`}>
                          <Icon className={action.iconColor} size={22} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">{action.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-full">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'project' ? 'bg-blue-100' : 
                        activity.type === 'task' ? 'bg-green-100' : 
                        activity.type === 'user' ? 'bg-purple-100' : 'bg-orange-100'
                      }`}>
                        {activity.type === 'project' && <FolderGit2 className="text-blue-600" size={18} />}
                        {activity.type === 'task' && <CheckSquare className="text-green-600" size={18} />}
                        {activity.type === 'user' && <Users className="text-purple-600" size={18} />}
                        {activity.type === 'ticket' && <FileText className="text-orange-600" size={18} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push('/dashboard/admin/activity')}
                  className="w-full mt-6 py-2.5 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View All Activity →
                </button>
              </div>
            </div>
          </div>

          {/* Users Management Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage all users in your organization</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/dashboard/admin/users')}
                    className="px-4 py-2.5 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    View All Users
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/admin/users/invite')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus size={18} />
                    Invite User
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="DEVELOPER">Developer</option>
                  <option value="CLIENT">Client</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.slice(0, 5).map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 block">{user.name}</span>
                            <span className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-700' :
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'DEVELOPER' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/admin/users/${user.id}`)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/admin/users/${user.id}/edit`)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit size={18} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  <Users className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600">No users found</p>
                  <p className="text-sm text-gray-500 mt-1">Try changing your search or filter criteria</p>
                </div>
              )}
              
              {filteredUsers.length > 5 && (
                <div className="p-6 border-t border-gray-100 text-center">
                  <button
                    onClick={() => router.push('/dashboard/admin/users')}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 mx-auto"
                  >
                    View All {filteredUsers.length} Users
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
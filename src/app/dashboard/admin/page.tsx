'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import ProtectedRoute from '../../../component/protectedRoutes';
import { Users, Briefcase, CheckSquare, Search, Eye, Trash2, Edit, UserPlus, ArrowRight, Clock, FileText, Settings, BarChart, Users as UsersIcon, CheckSquare as TasksIcon, FolderGit2, TrendingUp, TrendingDown, Mail } from 'lucide-react';
   

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
  activeUsers: number;
  totalProjects: number;
  totalTasks: number;
  pendingApprovals: number;
  adminCount: number;
  developerCount: number;
}

interface ActivityLog {
  id: string;
  type: string;
  details: any;
  createdAt: string;
  performer?: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

interface Project {
  id: string;
  name: string;
  status: string;
  description?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    pendingApprovals: 0,
    adminCount: 0,
    developerCount: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
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
      
      // Fetch all data in parallel
      const [statsResponse, usersResponse, projectsResponse, activityResponse] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/projects'),
        api.get('/admin/activity?limit=4')
      ]);

      // Process stats data
      const statsData = statsResponse.data.data || {};
      setStats({
        totalUsers: statsData.totalUsers || 0,
        activeUsers: statsData.activeUsers || 0,
        totalProjects: statsData.totalProjects || 0,
        totalTasks: statsData.totalTasks || 0,
        pendingApprovals: statsData.pendingApprovals || 0,
        adminCount: statsData.adminCount || 0,
        developerCount: statsData.developerCount || 0
      });

      // Process users data
      const usersData = usersResponse.data.data || usersResponse.data || [];
      const formattedUsers: User[] = usersData.map((user: any) => ({
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed',
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        isApproved: user.isApproved,
        isActive: user.isActive ?? true,
      }));

      setUsers(formattedUsers);

      // Process projects data
      const projectsData = projectsResponse.data.data || projectsResponse.data || [];
      setProjects(projectsData);

      // Process activity logs
      const activityData = activityResponse.data.data || [];
      setActivityLogs(activityData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Fallback to only users if other endpoints fail
      try {
        const usersResponse = await api.get('/admin/users');
        const usersData = usersResponse.data.data || usersResponse.data || [];
        
        const formattedUsers: User[] = usersData.map((user: any) => ({
          id: user.id,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed',
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          isApproved: user.isApproved,
          isActive: user.isActive ?? true,
        }));

        setUsers(formattedUsers);
        
        // Calculate basic stats from users data
        setStats({
          totalUsers: formattedUsers.length,
          activeUsers: formattedUsers.filter(u => u.isActive).length,
          totalProjects: 0,
          totalTasks: 0,
          pendingApprovals: formattedUsers.filter((u: User) => 
            (u.role === 'DEVELOPER' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN') && u.isApproved !== true
          ).length,
          adminCount: formattedUsers.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
          developerCount: formattedUsers.filter(u => u.role === 'DEVELOPER').length
        });
      } catch (usersError) {
        console.error('Error fetching users:', usersError);
      }
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
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return '+100%';
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
  };

  // Mock previous stats for demonstration (in real app, fetch from analytics)
  const previousStats = {
    totalUsers: Math.floor(stats.totalUsers * 0.88),
    totalProjects: Math.floor(stats.totalProjects * 0.92),
    totalTasks: Math.floor(stats.totalTasks * 0.85),
    pendingApprovals: Math.floor(stats.pendingApprovals * 1.03)
  };

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'blue',
      change: calculateChange(stats.totalUsers, previousStats.totalUsers),
      trend: stats.totalUsers >= previousStats.totalUsers ? 'up' : 'down'
    },
    { 
      title: 'Active Users', 
      value: stats.activeUsers, 
      icon: UsersIcon, 
      color: 'green',
      change: `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(0)}% active`,
      trend: 'up'
    },
    { 
      title: 'Projects', 
      value: stats.totalProjects, 
      icon: Briefcase, 
      color: 'purple',
      change: calculateChange(stats.totalProjects, previousStats.totalProjects),
      trend: stats.totalProjects >= previousStats.totalProjects ? 'up' : 'down'
    },
    { 
      title: 'Tasks', 
      value: stats.totalTasks, 
      icon: CheckSquare, 
      color: 'orange',
      change: calculateChange(stats.totalTasks, previousStats.totalTasks),
      trend: stats.totalTasks >= previousStats.totalTasks ? 'up' : 'down'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View, edit, and manage all users',
      icon: UsersIcon,
      color: 'bg-blue-500',
      iconColor: 'text-blue-100',
      route: '/dashboard/admin/users',
      count: stats.totalUsers
    },
    {
      title: 'Task Management',
      description: 'Create and assign tasks',
      icon: TasksIcon,
      color: 'bg-green-500',
      iconColor: 'text-green-100',
      route: '/dashboard/admin/tasks',
      count: stats.totalTasks
    },
    {
      title: 'Project Management',
      description: 'Manage all projects',
      icon: FolderGit2,
      color: 'bg-purple-500',
      iconColor: 'text-purple-100',
      route: '/dashboard/admin/projects',
      count: stats.totalProjects
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      color: 'bg-gray-600',
      iconColor: 'text-gray-100',
      route: '/dashboard/admin/settings'
    },
    {
    title: 'Contact Messages',
    description: 'View and respond to inquiries',
    icon: Mail, 
    color: 'bg-indigo-500',
    iconColor: 'text-indigo-100',
    route: '/dashboard/admin/contact',
    count: 0 
  }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'USER_CREATED':
      case 'USER_UPDATED':
      case 'USER_APPROVED':
        return Users;
      case 'PROJECT_CREATED':
      case 'PROJECT_UPDATED':
        return FolderGit2;
      case 'TASK_CREATED':
      case 'TASK_UPDATED':
      case 'TASK_COMPLETED':
        return CheckSquare;
      default:
        return FileText;
    }
  };

  const getActivityColor = (type: string) => {
    if (type.includes('USER')) return 'bg-purple-100 text-purple-600';
    if (type.includes('PROJECT')) return 'bg-blue-100 text-blue-600';
    if (type.includes('TASK')) return 'bg-green-100 text-green-600';
    return 'bg-orange-100 text-orange-600';
  };

  const formatActivityMessage = (activity: ActivityLog) => {
  const user = activity.performer;
  
  // Handle cases where performer is null or undefined
  if (!user) {
    return `System action: ${activity.type.replace('_', ' ').toLowerCase()}`;
  }
  
  // Safely get the user's name
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const userName = firstName || lastName 
    ? `${firstName} ${lastName}`.trim() 
    : user.email?.split('@')[0] || 'Unknown User';
  
  switch (activity.type) {
    case 'USER_CREATED':
      return `${userName} created a new user`;
    case 'USER_UPDATED':
      return `${userName} updated user profile`;
    case 'USER_APPROVED':
      return `${userName} approved a user`;
    case 'USER_DELETED':
      return `${userName} deleted a user`;
    case 'PROJECT_CREATED':
      return `${userName} created a new project`;
    case 'PROJECT_UPDATED':
      return `${userName} updated project details`;
    case 'TASK_CREATED':
      return `${userName} created a new task`;
    case 'TASK_UPDATED':
      return `${userName} updated a task`;
    case 'TASK_COMPLETED':
      return `${userName} completed a task`;
    default:
      return `${userName} performed an action`;
  }
};

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
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
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <BarChart size={18} />
                  Reports
                </button>
                <button
                  onClick={() => router.push('/dashboard/admin/users/invite')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <UserPlus size={18} />
                  Invite User
                </button>
              </div>
            </div>
          </div>

          {/* Pending Approvals Banner */}
          {stats.pendingApprovals > 0 && (
            <div className="mb-6 bg-gray-50 border border-gray-300 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="text-orange-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {stats.pendingApprovals} {stats.pendingApprovals === 1 ? 'User' : 'Users'} Awaiting Approval
                    </h3>
                    <p className="text-sm text-gary-700">
                      Review and approve new developer and admin applications
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/dashboard/admin/approvals')}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer font-semibold rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 whitespace-nowrap"
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
                  const ChangeIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
                  return (
                    <div key={index} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 ${stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'green' ? 'bg-green-100' : stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'} rounded-xl`}>
                          <IconComponent className={stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'} size={22} />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          <ChangeIcon size={14} />
                          {stat.change}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
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
                        className="flex items-start gap-4 p-4 cursor-pointer rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                      >
                        <div className={`${action.color} p-3 rounded-xl`}>
                          <Icon className={action.iconColor} size={22} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{action.title}</h3>
                            {action.count !== undefined && (
                              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {action.count}
                              </span>
                            )}
                          </div>
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <span className="text-sm text-gray-500">System-wide</span>
                </div>
                <div className="space-y-4">
                  {activityLogs.length > 0 ? (
                    activityLogs.map((activity) => {
                      const ActivityIcon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type).split(' ')[0]}`}>
                            <ActivityIcon className={getActivityColor(activity.type).split(' ')[1]} size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              {formatActivityMessage(activity)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTimeAgo(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      <Clock className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-sm text-gray-600">No recent activity</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => router.push('/dashboard/admin/activity')}
                  className="w-full mt-6 py-2.5 text-sm text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
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
                  <p className="text-sm text-gray-600 mt-1">
                    {stats.totalUsers} total users • {stats.activeUsers} active • {stats.pendingApprovals} pending
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/dashboard/admin/users')}
                    className="px-4 py-2.5 text-gray-900 font-medium hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
                  >
                    View All Users
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/admin/users/invite')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-gray-700 transition-colors"
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
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {user.isApproved === false && (
                            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                              Pending
                            </span>
                          )}
                        </div>
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
                    className="text-gray-900 hover:text-gray-600 font-medium flex items-center justify-center gap-2 mx-auto"
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
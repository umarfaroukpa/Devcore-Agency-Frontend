'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import ProtectedRoute from '../../../../component/protectedRoutes';
import {  Clock, ArrowLeft, Filter, Search, Calendar, User, Users, FolderGit2, CheckSquare, Shield, Eye, Download, RefreshCw, AlertCircle, CheckCircle, XCircle, Info, TrendingUp } from 'lucide-react';


interface ActivityLog {
  id: string;
  type: string;
  performedBy: string;
  performer: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  targetId: string | null;
  targetType: string | null;
  details: any;
  ipAddress: string | null;
  createdAt: string;
}

interface ActivityFilters {
  type: string;
  dateRange: string;
  performer: string;
  targetType: string;
}

export default function ActivityLogsPage() {
  const router = useRouter();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ActivityFilters>({
    type: 'all',
    dateRange: 'all',
    performer: 'all',
    targetType: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchActivityLogs();
  }, [currentPage]);

  useEffect(() => {
    filterActivityLogs();
  }, [searchTerm, filters, activityLogs]);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/activity?page=${currentPage}&limit=${itemsPerPage}`);
      const data = response.data.data || [];
      setActivityLogs(data);
      setFilteredLogs(data);
      
      // Calculate total pages (you might need to adjust based on your API response)
      const totalCount = response.data.count || data.length;
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterActivityLogs = () => {
    let filtered = [...activityLogs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.performer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.targetType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.performer?.firstName + ' ' + log.performer?.lastName).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(log => log.type === filters.type);
    }

    // Performer filter
    if (filters.performer !== 'all') {
      filtered = filtered.filter(log => log.performedBy === filters.performer);
    }

    // Target type filter
    if (filters.targetType !== 'all') {
      filtered = filtered.filter(log => log.targetType === filters.targetType);
    }

    // Date range filter (simplified)
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(log => new Date(log.createdAt) >= cutoffDate);
    }

    setFilteredLogs(filtered);
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'USER_CREATED':
      case 'USER_UPDATED':
      case 'USER_APPROVED':
        return Users;
      case 'USER_DELETED':
        return XCircle;
      case 'PROJECT_CREATED':
      case 'PROJECT_UPDATED':
        return FolderGit2;
      case 'PROJECT_DELETED':
        return XCircle;
      case 'TASK_CREATED':
      case 'TASK_UPDATED':
      case 'TASK_COMPLETED':
      case 'TASK_ASSIGNED':
        return CheckSquare;
      case 'ROLE_CHANGED':
        return Shield;
      default:
        return Info;
    }
  };

  const getActivityTypeColor = (type: string) => {
    if (type.includes('USER')) {
      if (type.includes('DELETED')) return 'bg-red-100 text-red-700';
      if (type.includes('APPROVED')) return 'bg-green-100 text-green-700';
      return 'bg-blue-100 text-blue-700';
    }
    if (type.includes('PROJECT')) {
      if (type.includes('DELETED')) return 'bg-red-100 text-red-700';
      return 'bg-purple-100 text-purple-700';
    }
    if (type.includes('TASK')) return 'bg-green-100 text-green-700';
    if (type.includes('ROLE')) return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const formatActivityMessage = (log: ActivityLog) => {
    const performerName = log.performer?.firstName && log.performer?.lastName 
      ? `${log.performer.firstName} ${log.performer.lastName}`
      : log.performer?.email || 'Unknown User';
    
    switch (log.type) {
      case 'USER_CREATED':
        return `${performerName} created a new user`;
      case 'USER_UPDATED':
        return `${performerName} updated a user profile`;
      case 'USER_APPROVED':
        return `${performerName} approved a user`;
      case 'USER_DELETED':
        return `${performerName} deleted a user`;
      case 'PROJECT_CREATED':
        return `${performerName} created a new project`;
      case 'PROJECT_UPDATED':
        return `${performerName} updated project details`;
      case 'PROJECT_DELETED':
        return `${performerName} deleted a project`;
      case 'TASK_CREATED':
        return `${performerName} created a new task`;
      case 'TASK_UPDATED':
        return `${performerName} updated a task`;
      case 'TASK_COMPLETED':
        return `${performerName} completed a task`;
      case 'TASK_ASSIGNED':
        return `${performerName} assigned a task`;
      case 'ROLE_CHANGED':
        return `${performerName} changed a user role`;
      default:
        return `${performerName} performed an action`;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    }
  };

  const getActivityTypes = () => {
    const types = new Set(activityLogs.map(log => log.type));
    return Array.from(types).sort();
  };

  const getPerformers = () => {
    const performers = activityLogs.reduce((acc: any[], log) => {
      if (log.performer && !acc.find(p => p.id === log.performedBy)) {
        acc.push({
          id: log.performedBy,
          name: log.performer.firstName && log.performer.lastName 
            ? `${log.performer.firstName} ${log.performer.lastName}`
            : log.performer.email
        });
      }
      return acc;
    }, []);
    return performers.sort((a, b) => a.name.localeCompare(b.name));
  };

  const getTargetTypes = () => {
    const types = new Set<string>(
      activityLogs
        .map(log => log.targetType)
        .filter((t): t is string => t !== null && t !== undefined)
    );
    return Array.from(types).sort();
  };

  const exportActivityLogs = () => {
    const csvContent = [
      ['ID', 'Type', 'Performer', 'Target Type', 'Target ID', 'Details', 'IP Address', 'Timestamp'],
      ...filteredLogs.map(log => [
        log.id,
        log.type,
        log.performer?.email || 'Unknown',
        log.targetType || 'N/A',
        log.targetId || 'N/A',
        JSON.stringify(log.details || {}),
        log.ipAddress || 'N/A',
        log.createdAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading && activityLogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/admin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Logs</h1>
                <p className="text-gray-600">Monitor all system activities and user actions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportActivityLogs}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={filteredLogs.length === 0}
              >
                <Download size={18} />
                Export CSV
              </button>
              <button
                onClick={fetchActivityLogs}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Clock className="text-blue-600" size={20} />
                <span className="text-xs text-gray-500">Total Logs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{activityLogs.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-purple-600" size={20} />
                <span className="text-xs text-gray-500">Unique Users</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{getPerformers().length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <FolderGit2 className="text-green-600" size={20} />
                <span className="text-xs text-gray-500">Project Actions</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {activityLogs.filter(log => log.type.includes('PROJECT')).length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <CheckSquare className="text-orange-600" size={20} />
                <span className="text-xs text-gray-500">Task Actions</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {activityLogs.filter(log => log.type.includes('TASK')).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Types</option>
                  {getActivityTypes().map(type => (
                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                  ))}
                </select>
                <select
                  value={filters.performer}
                  onChange={(e) => setFilters({ ...filters, performer: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Users</option>
                  {getPerformers().map(performer => (
                    <option key={performer.id} value={performer.id}>{performer.name}</option>
                  ))}
                </select>
                <select
                  value={filters.targetType}
                  onChange={(e) => setFilters({ ...filters, targetType: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Targets</option>
                  {getTargetTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="year">Past Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <Clock className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-gray-600">No activity logs found</p>
                        <p className="text-sm text-gray-500 mt-1">Try changing your filters or search criteria</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const ActivityIcon = getActivityTypeIcon(log.type);
                      return (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityTypeColor(log.type)}`}>
                                <ActivityIcon size={18} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{formatActivityMessage(log)}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(log.type)}`}>
                                  {log.type.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {log.performer?.email?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <p className="text-sm text-gray-900">
                                  {log.performer?.firstName && log.performer?.lastName 
                                    ? `${log.performer.firstName} ${log.performer.lastName}`
                                    : log.performer?.email || 'Unknown User'}
                                </p>
                                <p className="text-xs text-gray-500">{log.performedBy.substring(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {log.targetType ? (
                              <div>
                                <p className="text-sm text-gray-900 capitalize">{log.targetType}</p>
                                {log.targetId && (
                                  <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                    ID: {log.targetId.substring(0, 8)}...
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {log.details ? (
                              <div className="max-w-[200px]">
                                <p className="text-sm text-gray-900 truncate">
                                  {JSON.stringify(log.details)}
                                </p>
                                <button
                                  onClick={() => {
                                    alert(JSON.stringify(log.details, null, 2));
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                >
                                  View Details
                                </button>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No details</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-900">{formatDateTime(log.createdAt)}</p>
                              <p className="text-xs text-gray-500">{formatTimeAgo(log.createdAt)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {log.ipAddress ? (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                                {log.ipAddress}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">N/A</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredLogs.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredLogs.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">About Activity Logs</h4>
                <p className="text-sm text-blue-700">
                  Activity logs track all important system actions including user management, 
                  project updates, task assignments, and role changes. Only Super Admins can 
                  view these logs for security and auditing purposes.
                </p>
                <ul className="text-xs text-blue-600 mt-2 space-y-1">
                  <li>• Logs are retained for security auditing</li>
                  <li>• Each log includes timestamp, performer, and details</li>
                  <li>• IP addresses are recorded for security monitoring</li>
                  <li>• Export logs for external analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
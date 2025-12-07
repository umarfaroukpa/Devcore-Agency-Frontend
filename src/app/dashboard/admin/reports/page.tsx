'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import ProtectedRoute from '../../../../component/protectedRoutes';
import { Download, Calendar, BarChart3, TrendingUp, TrendingDown, Users, Briefcase, CheckSquare, DollarSign, FileText, LineChart, Clock, CheckCircle, AlertCircle, User, Target, FileSpreadsheet, FileType, RefreshCw, AlertTriangle} from 'lucide-react';
  
  

interface ReportStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalRevenue: number;
  averageProjectDuration: number;
  userGrowthRate: number;
  projectCompletionRate: number;
  taskCompletionRate: number;
}

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

interface UserReport {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  projectCount: number;
  taskCount: number;
  lastActive?: string;
}

interface ProjectReport {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  budget: number;
  startDate: string;
  endDate: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  projectManager?: {
    id: string;
    name: string;
    email: string;
  };
  taskCount: number;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

interface FinancialReport {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  projectCount: number;
  completedProjects: number;
  ongoingProjects: number;
  cancelledProjects: number;
  completionRate: number;
  avgProjectCost: number;
}

interface ActivityReportItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp?: string;
  user?: {
    name: string;
    role: string;
    email: string;
  };
  project?: {
    name: string;
    status: string;
  };
  task?: {
    title: string;
    status: string;
  };
  details?: any;
}

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [stats, setStats] = useState<ReportStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalRevenue: 0,
    averageProjectDuration: 0,
    userGrowthRate: 0,
    projectCompletionRate: 0,
    taskCompletionRate: 0
  });
  const [timeRange, setTimeRange] = useState<TimeRange>({ label: 'Last 30 Days', value: '30d', days: 30 });
  const [activeTab, setActiveTab] = useState('overview');
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [usersReport, setUsersReport] = useState<UserReport[]>([]);
  const [projectsReport, setProjectsReport] = useState<ProjectReport[]>([]);
  const [financialData, setFinancialData] = useState<FinancialReport[]>([]);
  const [activityReport, setActivityReport] = useState<ActivityReportItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<any>({});

  // Calculate days since start of year
  const calculateDaysSinceStartOfYear = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  };

  const timeRanges: TimeRange[] = [
    { label: 'Last 7 Days', value: '7d', days: 7 },
    { label: 'Last 30 Days', value: '30d', days: 30 },
    { label: 'Last 90 Days', value: '90d', days: 90 },
    { label: 'Last 6 Months', value: '6m', days: 180 },
    { label: 'Year to Date', value: 'ytd', days: calculateDaysSinceStartOfYear() },
    { label: 'All Time', value: 'all', days: 3650 }
  ];

  useEffect(() => {
    fetchReportsData();
  }, [timeRange]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch stats report
      const statsResponse = await api.get(`/admin/reports/stats?range=${timeRange.value}`);
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      } else {
        throw new Error(statsResponse.data.error || 'Failed to fetch stats');
      }

      // Fetch users report
      const usersResponse = await api.get(`/admin/reports/users?range=${timeRange.value}`);
      if (usersResponse.data.success) {
        setUsersReport(usersResponse.data.data || []);
      }

      // Fetch projects report
      const projectsResponse = await api.get(`/admin/reports/projects?range=${timeRange.value}`);
      if (projectsResponse.data.success) {
        setProjectsReport(projectsResponse.data.data || []);
      }

      // Fetch financial report
      const financialResponse = await api.get(`/admin/reports/financial?range=${timeRange.value}`);
      if (financialResponse.data.success) {
        setFinancialData(financialResponse.data.data || []);
        setTotals(financialResponse.data.totals || {});
      }

      // Fetch activity report
      const activityResponse = await api.get(`/admin/reports/activity?range=${timeRange.value}`);
      if (activityResponse.data.success) {
        setActivityReport(activityResponse.data.data || []);
      }

    } catch (error: any) {
      console.error('Error fetching reports data:', error);
      setError(error.response?.data?.error || error.message || 'Failed to fetch reports data');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="text-green-600" size={16} /> : <TrendingDown className="text-red-600" size={16} />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const handleExport = async () => {
    setReportLoading(true);
    try {
      const response = await api.post('/admin/reports/export', {
        type: activeTab === 'users' ? 'users' : 
              activeTab === 'projects' ? 'projects' : 
              activeTab === 'tasks' ? 'tasks' : 'financial',
        format: exportFormat,
        filters: {
          dateRange: timeRange.value
        }
      });

      if (response.data.success) {
        // For now, just show success message since API returns JSON
        // In real implementation, you'd handle file download
        alert(`Report exported successfully. ${response.data.data.records} records included.`);
      } else {
        throw new Error(response.data.error || 'Export failed');
      }
    } catch (error: any) {
      console.error('Export error:', error);
      alert(error.response?.data?.error || error.message || 'Failed to export report');
    } finally {
      setReportLoading(false);
      setShowExportMenu(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      change: `${formatPercentage(stats.userGrowthRate)} growth`,
      trend: stats.userGrowthRate >= 0 ? 'up' : 'down'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: Briefcase,
      color: 'purple',
      change: `${stats.completedProjects} completed`,
      trend: 'up'
    },
    {
      title: 'Task Completion',
      value: `${stats.taskCompletionRate.toFixed(0)}%`,
      icon: CheckSquare,
      color: 'green',
      change: `${stats.completedTasks}/${stats.totalTasks} tasks`,
      trend: stats.taskCompletionRate >= 75 ? 'up' : 'down'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'orange',
      change: `${stats.totalProjects} projects`,
      trend: 'up'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'activity', label: 'Activity', icon: LineChart }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'LOW': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-700';
      case 'ADMIN': return 'bg-purple-100 text-purple-700';
      case 'DEVELOPER': return 'bg-green-100 text-green-700';
      case 'CLIENT': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
              <p className="text-gray-600">Comprehensive system reports and performance analytics</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Time Range Selector */}
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl bg-white">
                  <Calendar size={18} className="text-gray-500" />
                  <select
                    value={timeRange.value}
                    onChange={(e) => {
                      const selected = timeRanges.find(tr => tr.value === e.target.value);
                      if (selected) setTimeRange(selected);
                    }}
                    className="outline-none bg-transparent text-gray-700"
                  >
                    {timeRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchReportsData}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              {/* Export Button */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={reportLoading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {reportLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Export Report
                    </>
                  )}
                </button>
                
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500">Export Format</div>
                        {['excel', 'pdf', 'csv'].map((format) => (
                          <button
                            key={format}
                            onClick={() => {
                              setExportFormat(format as any);
                              handleExport();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            {format === 'excel' && <FileSpreadsheet size={16} className="text-green-600" />}
                            {format === 'pdf' && <FileType size={16} className="text-red-600" />}
                            {format === 'csv' && <FileText size={16} className="text-blue-600" />}
                            <span className="text-gray-700 capitalize">{format}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-600" size={20} />
                <div>
                  <p className="font-medium text-red-800">Error Loading Reports</p>
                  <p className="text-sm text-red-600">{error}</p>
                  <button
                    onClick={fetchReportsData}
                    className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 ${stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'purple' ? 'bg-purple-100' : stat.color === 'green' ? 'bg-green-100' : 'bg-orange-100'} rounded-xl`}>
                      <Icon className={stat.color === 'blue' ? 'text-blue-600' : stat.color === 'purple' ? 'text-purple-600' : stat.color === 'green' ? 'text-green-600' : 'text-orange-600'} size={22} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendIcon size={14} />
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Overview</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Key Metrics */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Key Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">User Activity Rate</span>
                          <span className="font-semibold text-green-600">{formatPercentage((stats.activeUsers / stats.totalUsers) * 100)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Project Success Rate</span>
                          <span className="font-semibold text-blue-600">{formatPercentage(stats.projectCompletionRate)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Task Efficiency</span>
                          <span className="font-semibold text-purple-600">{formatPercentage(stats.taskCompletionRate)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Avg Revenue per Project</span>
                          <span className="font-semibold text-orange-600">{formatCurrency(stats.totalRevenue / Math.max(stats.totalProjects, 1))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Insights */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Insights</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <AlertCircle className="text-blue-600 mt-0.5" size={18} />
                          <div>
                            <p className="font-medium text-blue-800">User Growth</p>
                            <p className="text-sm text-blue-600">User base increased by {formatPercentage(stats.userGrowthRate)} this period</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="text-green-600 mt-0.5" size={18} />
                          <div>
                            <p className="font-medium text-green-800">Project Performance</p>
                            <p className="text-sm text-green-600">{stats.completedProjects} projects completed successfully</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <Target className="text-purple-600 mt-0.5" size={18} />
                          <div>
                            <p className="font-medium text-purple-800">Task Management</p>
                            <p className="text-sm text-purple-600">{stats.completedTasks} tasks completed ({formatPercentage(stats.taskCompletionRate)})</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Users Report</h2>
                  <span className="text-sm text-gray-500">{usersReport.length} users</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {usersReport.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                              {!user.isApproved && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                  Pending
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{user.projectCount}</td>
                          <td className="px-4 py-3 text-gray-700">{user.taskCount}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {usersReport.length === 0 && (
                    <div className="text-center py-8">
                      <User className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-gray-600">No users found for this time period</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Projects Report</h2>
                  <span className="text-sm text-gray-500">{projectsReport.length} projects</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timeline</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {projectsReport.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{project.name}</p>
                            {project.description && (
                              <p className="text-xs text-gray-500 truncate max-w-xs">{project.description}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">{formatCurrency(project.budget)}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <p className="text-gray-700">Start: {project.startDate ? formatDate(project.startDate) : 'N/A'}</p>
                              <p className="text-gray-700">End: {project.endDate ? formatDate(project.endDate) : 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {project.client ? (
                              <div>
                                <p className="text-gray-700">{project.client.name}</p>
                                <p className="text-xs text-gray-500">{project.client.email}</p>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">No client</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <p className="text-sm text-gray-700">{project.memberCount} members</p>
                              <p className="text-xs text-gray-500">{project.taskCount} tasks</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {projectsReport.length === 0 && (
                    <div className="text-center py-8">
                      <Briefcase className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-gray-600">No projects found for this time period</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'financial' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Financial Report</h2>
                  <div className="text-sm text-gray-500">
                    {financialData.length} months • Total Revenue: {formatCurrency(totals.revenue || 0)}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expenses</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {financialData.map((month, index) => {
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{month.month}</td>
                            <td className="px-4 py-3 font-medium text-green-600">{formatCurrency(month.revenue)}</td>
                            <td className="px-4 py-3 text-red-600">{formatCurrency(month.expenses)}</td>
                            <td className="px-4 py-3 font-bold text-blue-600">{formatCurrency(month.profit)}</td>
                            <td className="px-4 py-3">
                              <span className={`font-medium ${month.profitMargin >= 30 ? 'text-green-600' : month.profitMargin >= 20 ? 'text-blue-600' : 'text-orange-600'}`}>
                                {month.profitMargin.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700">{month.projectCount}</td>
                            <td className="px-4 py-3 text-gray-700">{formatCurrency(month.avgProjectCost)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {financialData.length === 0 && (
                    <div className="text-center py-8">
                      <DollarSign className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-gray-600">No financial data found for this time period</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Activity Report</h2>
                  <span className="text-sm text-gray-500">{activityReport.length} activities</span>
                </div>
                <div className="space-y-4">
                  {activityReport.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type.includes('USER') ? 'bg-purple-100' :
                        activity.type.includes('PROJECT') ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                        {activity.type.includes('USER') && <User className="text-purple-600" size={18} />}
                        {activity.type.includes('PROJECT') && <Briefcase className="text-blue-600" size={18} />}
                        {activity.type.includes('TASK') && <CheckSquare className="text-green-600" size={18} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{activity.title}</h3>
                          <span className="text-xs text-gray-500">
                            {activity.timestamp ? formatDate(activity.timestamp) : 'N/A'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        {activity.user && (
                          <p className="text-xs text-gray-500 mt-1">
                            By: {activity.user.name} ({activity.user.role})
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {activityReport.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-gray-600">No activity found for this time period</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
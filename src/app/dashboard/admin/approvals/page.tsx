'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import ProtectedRoute from '../../../../component/protectedRoutes';
import { 
  Users, CheckCircle, XCircle, Clock, Search, Mail, Phone, 
  Briefcase, Github, Globe, User, ArrowLeft, AlertCircle,
  FileText, Calendar, Shield, Download, RefreshCw
} from 'lucide-react';

interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'DEVELOPER' | 'ADMIN';
  createdAt: string;
  isApproved: boolean | null;
  isActive: boolean;
  skills?: string;
  experience?: string;
  githubUsername?: string;
  portfolio?: string;
  position?: string;
  companyName?: string;
  industry?: string;
}

export default function AdminApprovalsPage() {
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, pendingUsers]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users/pending');
      const users = response.data.data || [];
      setPendingUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = pendingUsers;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleApprove = async (userId: string) => {
    if (!confirm('Are you sure you want to approve this user?')) return;

    try {
      setActionLoading(userId);
      await api.patch(`/admin/users/${userId}/approve`);
      
      // Update local state
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
        setShowModal(false);
      }
      
      alert('User approved successfully');
      fetchPendingUsers(); // Refresh list
    } catch (error: any) {
      console.error('Error approving user:', error);
      alert(error.response?.data?.error || 'Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason || !reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!confirm('Are you sure you want to reject this user?')) return;

    try {
      setActionLoading(userId);
      // You'll need to create a reject endpoint
      await api.patch(`/admin/users/${userId}/reject`, { reason });
      
      // Update local state
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
        setShowModal(false);
      }
      
      alert('User rejected successfully');
      fetchPendingUsers(); // Refresh list
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      alert(error.response?.data?.error || 'Failed to reject user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      setActionLoading(userId);
      await api.patch(`/admin/users/${userId}`, { isActive: true });
      
      // Update local state
      setPendingUsers(pendingUsers.map(user => 
        user.id === userId ? { ...user, isActive: true } : user
      ));
      
      alert('User activated successfully');
    } catch (error: any) {
      console.error('Error activating user:', error);
      alert(error.response?.data?.error || 'Failed to activate user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (user: PendingUser) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const getStatusColor = (user: PendingUser) => {
    if (user.isApproved === true) return 'bg-green-100 text-green-700';
    if (user.isApproved === false) return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusText = (user: PendingUser) => {
    if (user.isApproved === true) return 'Approved';
    if (user.isApproved === false) return 'Rejected';
    return 'Pending Review';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getRoleColor = (role: string) => {
    return role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} requirePermission="canApproveUsers">
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">User Approvals</h1>
                  <p className="text-gray-600">Review and manage pending user applications</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchPendingUsers}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="text-yellow-600" size={28} />
                </div>
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingUsers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="text-blue-600" size={28} />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Developers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {pendingUsers.filter(u => u.role === 'DEVELOPER').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="text-purple-600" size={28} />
                </div>
                <div>
                  <p className="text-sm text-purple-700 font-medium">Admins</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {pendingUsers.filter(u => u.role === 'ADMIN').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="DEVELOPER">Developers Only</option>
                  <option value="ADMIN">Admins Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pending Users List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Pending Applications ({filteredUsers.length})</h2>
              <p className="text-sm text-gray-600 mt-1">
                Click on any application to review details and take action
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-600" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    There are no pending user applications to review. 
                    Check back later for new submissions.
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(user)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* User Avatar & Basic Info */}
                      <div className="flex items-center gap-4 md:w-1/3">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          {!user.isActive && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-100 border-2 border-white rounded-full flex items-center justify-center">
                              <XCircle className="text-red-600" size={12} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user)}`}>
                              {getStatusText(user)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                            <Mail size={14} />
                            {user.email}
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="md:w-1/3">
                        {user.position && (
                          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                            <Briefcase size={14} />
                            {user.position}
                          </div>
                        )}
                        {user.companyName && (
                          <p className="text-sm text-gray-600">Company: {user.companyName}</p>
                        )}
                      </div>

                      {/* Date & Actions */}
                      <div className="md:w-1/3 flex flex-col md:items-end gap-3">
                        <div className="text-sm text-gray-500">
                          Applied {formatTimeAgo(user.createdAt)}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(user.id);
                            }}
                            disabled={actionLoading === user.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(user.id);
                            }}
                            disabled={actionLoading === user.id}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Instructions */}
          {filteredUsers.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Review Process:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Click on any application to view full details</li>
                    <li>Review the applicant's information and portfolio</li>
                    <li>Approve or reject based on your evaluation</li>
                    <li>Provide feedback if rejecting an application</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Application Review</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                        {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role)}`}>
                            {selectedUser.role}
                          </span>
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedUser)}`}>
                            {getStatusText(selectedUser)}
                          </span>
                          {!selectedUser.isActive && (
                            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700">
                              Inactive
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-gray-700">
                            <Mail size={18} className="text-gray-400" />
                            <span>{selectedUser.email}</span>
                          </div>
                          {selectedUser.phone && (
                            <div className="flex items-center gap-3 text-gray-700">
                              <Phone size={18} className="text-gray-400" />
                              <span>{selectedUser.phone}</span>
                            </div>
                          )}
                          {selectedUser.position && (
                            <div className="flex items-center gap-3 text-gray-700">
                              <Briefcase size={18} className="text-gray-400" />
                              <span>{selectedUser.position}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Experience */}
                  {(selectedUser.skills || selectedUser.experience) && (
                    <div className="space-y-6">
                      {selectedUser.skills && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {JSON.parse(selectedUser.skills).map((skill: string, index: number) => (
                              <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedUser.experience && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Experience</h4>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-gray-700 whitespace-pre-line">{selectedUser.experience}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column - Actions & Links */}
                <div className="space-y-6">
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleApprove(selectedUser.id)}
                      disabled={actionLoading === selectedUser.id}
                      className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Approve Application
                    </button>
                    <button
                      onClick={() => handleReject(selectedUser.id)}
                      disabled={actionLoading === selectedUser.id}
                      className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <XCircle size={20} />
                      Reject Application
                    </button>
                    {!selectedUser.isActive && (
                      <button
                        onClick={() => handleActivate(selectedUser.id)}
                        disabled={actionLoading === selectedUser.id}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <User size={20} />
                        Activate Account
                      </button>
                    )}
                  </div>

                  {/* External Links */}
                  <div className="space-y-4">
                    {selectedUser.githubUsername && (
                      <a
                        href={`https://github.com/${selectedUser.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <Github className="text-gray-700" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">GitHub Profile</p>
                          <p className="text-sm text-gray-600">{selectedUser.githubUsername}</p>
                        </div>
                      </a>
                    )}

                    {selectedUser.portfolio && (
                      <a
                        href={selectedUser.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <Globe className="text-gray-700" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">Portfolio</p>
                          <p className="text-sm text-gray-600 truncate">{selectedUser.portfolio}</p>
                        </div>
                      </a>
                    )}

                    {/* Application Date */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="text-gray-400" size={18} />
                        <span className="text-sm font-medium text-gray-700">Application Date</span>
                      </div>
                      <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatTimeAgo(selectedUser.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(selectedUser.id)}
                  disabled={actionLoading === selectedUser.id}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedUser.id)}
                  disabled={actionLoading === selectedUser.id}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { Clock, CheckCircle, XCircle, Eye, Mail, Phone, Code, Shield, Github, Award, ArrowLeft } from 'lucide-react';

interface PendingUser {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string;
  role: string;
  isApproved: boolean | null;
  isActive: boolean;
  createdAt: string;
  // Developer specific
  skills?: string;
  experience?: string;
  githubUsername?: string;
  portfolio?: string;
  // Admin specific
  position?: string;
}

export default function PendingApprovalsPage() {
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is an admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔐 Checking authentication...');
    console.log('Token exists:', !!token);
    console.log('User data exists:', !!userData);
    
    if (!token || !userData) {
      console.log('❌ No authentication found, redirecting to login');
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      console.log('👤 User role:', user.role);
      
      //Check for both ADMIN and SUPER_ADMIN roles
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        console.log('❌ Not an admin/super_admin, redirecting to appropriate dashboard');
        // Redirect based on role
        if (user.role === 'DEVELOPER') {
          router.push('/dashboard/developer');
        } else if (user.role === 'CLIENT') {
          router.push('/dashboard/client');
        } else {
          router.push('/');
        }
        return;
      }
      
      console.log('✅ Admin/Super Admin authenticated, fetching pending users');
      fetchPendingUsers();
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching pending users...');
      
      const response = await api.get('/admin/users/pending', {
        timeout: 10000
      });
      
      const users = response.data.data || response.data || [];
      console.log('✅ Pending users loaded:', users.length);
      setPendingUsers(users);
    } catch (error: any) {
      console.error('❌ Error fetching pending users:', error);
      
      // If 401, redirect to login
      if (error.response?.status === 401) {
        console.log('❌ Unauthorized, session expired');
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } else if (error.response?.status === 403) {
        console.log('❌ Forbidden, insufficient permissions');
        alert('You do not have permission to view pending approvals.');
        router.push('/dashboard/admin');
      } else {
        alert('Failed to load pending approvals. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    if (!confirm('Are you sure you want to approve this user?')) return;

    setProcessing(userId);
    console.log('✅ Approving user:', userId);
    
    try {
      await api.patch(`/admin/users/${userId}/approve`, {}, {
        timeout: 15000
      });
      
      console.log('✅ User approved successfully');
      alert('User approved successfully! They can now log in.');
      
      // Remove from list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      
      // Just log completion, don't redirect
      if (pendingUsers.length === 1) {
        console.log('✅ All pending users have been processed');
      }
    } catch (error: any) {
      console.error('❌ Error approving user:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        router.push('/login');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to approve users.');
      } else {
        alert(error.response?.data?.error || 'Failed to approve user. Please try again.');
      }
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    if (!confirm('Are you sure you want to reject this application? This will permanently delete the user.')) return;

    setProcessing(userId);
    console.log('❌ Rejecting user:', userId);
    
    try {
      await api.delete(`/admin/users/${userId}`, {
        data: { reason },
        timeout: 15000
      });
      
      console.log('✅ User rejected successfully');
      alert('Application rejected and user removed successfully.');
      
      // Remove from list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      
      // Just log completion, don't redirect
      if (pendingUsers.length === 1) {
        console.log('✅ All pending users have been processed');
      }
    } catch (error: any) {
      console.error('❌ Error rejecting user:', error);
      
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        router.push('/login');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to reject users.');
      } else {
        alert(error.response?.data?.error || 'Failed to reject user. Please try again.');
      }
    } finally {
      setProcessing(null);
    }
  };

  const viewDetails = (user: PendingUser) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Approvals</h1>
          <p className="text-gray-600">Review and approve user applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="text-orange-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Total Pending</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{pendingUsers.length}</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting review</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Code className="text-green-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Developers</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {pendingUsers.filter(u => u.role === 'DEVELOPER').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Developer applications</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="text-purple-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Admins</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {pendingUsers.filter(u => u.role === 'ADMIN').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Admin applications</p>
          </div>
        </div>

        {/* Pending Users List */}
        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600 mb-6">No pending applications at the moment.</p>
            <button
              onClick={() => router.push('/dashboard/admin')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingUsers.map((user) => {
              const skills = user.skills ? JSON.parse(user.skills) : [];
              const isProcessing = processing === user.id;
              
              return (
                <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0) || ''}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'DEVELOPER' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail size={16} className="flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="flex-shrink-0" />
                              <span>{user.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="flex-shrink-0" />
                              <span>Applied {new Date(user.createdAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Role-specific info */}
                      {user.role === 'DEVELOPER' && (
                        <div className="ml-20 space-y-3">
                          {skills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                              <div className="flex flex-wrap gap-2">
                                {skills.map((skill: string, idx: number) => (
                                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {user.experience && (
                            <div className="flex items-center gap-2 text-sm">
                              <Award size={16} className="text-gray-400" />
                              <span className="text-gray-600">Experience: <span className="font-medium text-gray-900">{user.experience}</span></span>
                            </div>
                          )}
                          
                          {user.githubUsername && (
                            <div className="flex items-center gap-2 text-sm">
                              <Github size={16} className="text-gray-400" />
                              <a 
                                href={`https://github.com/${user.githubUsername}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                @{user.githubUsername}
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {user.role === 'ADMIN' && user.position && (
                        <div className="ml-20">
                          <p className="text-sm text-gray-600">Position: <span className="font-medium text-gray-900">{user.position}</span></p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      <button
                        onClick={() => viewDetails(user)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye size={18} />
                        View Details
                      </button>
                      
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Approve
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={isProcessing}
                        className="px-6 py-3 border-2 border-red-300 text-red-700 font-medium rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <XCircle size={18} />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-lg text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg text-gray-900">{selectedUser.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-lg text-gray-900">{selectedUser.phone}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-lg text-gray-900">{selectedUser.role}</p>
              </div>
              
              {selectedUser.role === 'DEVELOPER' && (
                <>
                  {selectedUser.skills && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Skills</label>
                      <p className="text-lg text-gray-900">{JSON.parse(selectedUser.skills).join(', ')}</p>
                    </div>
                  )}
                  
                  {selectedUser.experience && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experience Level</label>
                      <p className="text-lg text-gray-900">{selectedUser.experience}</p>
                    </div>
                  )}
                  
                  {selectedUser.githubUsername && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">GitHub</label>
                      <a 
                        href={`https://github.com/${selectedUser.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-blue-600 hover:underline"
                      >
                        @{selectedUser.githubUsername}
                      </a>
                    </div>
                  )}
                  
                  {selectedUser.portfolio && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Portfolio</label>
                      <a 
                        href={selectedUser.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-blue-600 hover:underline block truncate"
                      >
                        {selectedUser.portfolio}
                      </a>
                    </div>
                  )}
                </>
              )}
              
              {selectedUser.role === 'ADMIN' && selectedUser.position && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Position</label>
                  <p className="text-lg text-gray-900">{selectedUser.position}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApprove(selectedUser.id);
                  setShowDetails(false);
                }}
                disabled={processing === selectedUser.id}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approve User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
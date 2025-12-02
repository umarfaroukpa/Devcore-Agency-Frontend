'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import { Clock, CheckCircle, XCircle, Eye, Mail, Phone, Code, Shield, Github, Award } from 'lucide-react';

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
    
    if (!token || !userData) {
      console.log('❌ No authentication found, redirecting to login');
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'ADMIN') {
        console.log('❌ Not an admin, redirecting');
        router.push('/');
        return;
      }
      
      fetchPendingUsers();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users/pending');
      setPendingUsers(response.data.data || response.data);
    } catch (error: any) {
      console.error('Error fetching pending users:', error);
      
      // If 401, redirect to login
      if (error.response?.status === 401) {
        console.log('❌ Unauthorized, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
  if (!confirm('Are you sure you want to approve this user?')) return;

  try {
    setProcessing(userId);
    await api.patch(`/admin/users/${userId}/approve`);
    
    // Remove from pending list
    setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    alert('User approved successfully! They can now log in.');
  } catch (error: any) {
    console.error('Error approving user:', error);
    alert(error.response?.data?.error || 'Failed to approve user');
  } finally {
    setProcessing(null);
  }
};


  const handleReject = async (userId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    if (!confirm('Are you sure you want to reject this application?')) return;

    try {
      setProcessing(userId);
      await api.delete(`/admin/users/${userId}`, {
        data: { reason }
      });
      
      // Remove from pending list
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
      alert('Application rejected');
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      alert(error.response?.data?.error || 'Failed to reject user');
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
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Approvals</h1>
          <p className="text-gray-600">Review and approve user applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-orange-600" size={24} />
              <h3 className="text-lg font-semibold">Total Pending</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{pendingUsers.length}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Code className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold">Developers</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {pendingUsers.filter(u => u.role === 'DEVELOPER').length}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold">Admins</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {pendingUsers.filter(u => u.role === 'ADMIN').length}
            </p>
          </div>
        </div>

        {/* Pending Users List */}
        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No pending applications at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingUsers.map((user) => {
              const skills = user.skills ? JSON.parse(user.skills) : [];
              
              return (
                <div key={user.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0) || ''}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
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
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail size={16} />
                              <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={16} />
                              <span>{user.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} />
                              <span>Applied {new Date(user.createdAt).toLocaleDateString()}</span>
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
                    <div className="flex md:flex-col gap-3">
                      <button
                        onClick={() => viewDetails(user)}
                        className="flex-1 md:flex-initial px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye size={18} />
                        Details
                      </button>
                      
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={processing === user.id}
                        className="flex-1 md:flex-initial px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={processing === user.id}
                        className="flex-1 md:flex-initial px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle size={18} />
                        Reject
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
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
                        className="text-lg text-blue-600 hover:underline"
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
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApprove(selectedUser.id);
                  setShowDetails(false);
                }}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


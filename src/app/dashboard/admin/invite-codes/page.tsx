'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Copy, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface InviteCode {
  id: string;
  code: string;
  role: string;
  used: boolean;
  usedBy: string | null;
  usedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export default function InviteCodesPage() {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'used' | 'expired'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [newCode, setNewCode] = useState({
    role: 'DEVELOPER' as 'DEVELOPER' | 'ADMIN',
    expiresInDays: 30
  });

  useEffect(() => {
    fetchInviteCodes();
  }, [filter]);

  const fetchInviteCodes = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/admin/invite-codes', { params });
      setInviteCodes(response.data.data);
    } catch (error) {
      console.error('Error fetching invite codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async () => {
    try {
      const response = await api.post('/admin/invite-codes', newCode);
      setMessage({ type: 'success', text: 'Invite code created successfully!' });
      setShowCreateModal(false);
      setNewCode({ role: 'DEVELOPER', expiresInDays: 30 });
      fetchInviteCodes();
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to create invite code' 
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setMessage({ type: 'success', text: 'Code copied to clipboard!' });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invite code?')) return;

    try {
      await api.delete(`/admin/invite-codes/${id}`);
      setMessage({ type: 'success', text: 'Invite code deleted successfully!' });
      fetchInviteCodes();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete invite code' 
      });
    }
  };

  const isExpired = (expiresAt: Date | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadge = (code: InviteCode) => {
    if (code.used) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
          <CheckCircle size={14} />
          Used
        </span>
      );
    }
    
    if (isExpired(code.expiresAt)) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
          <XCircle size={14} />
          Expired
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
        <CheckCircle size={14} />
        Active
      </span>
    );
  };

  const filteredCodes = inviteCodes.filter(code => {
    if (filter === 'active') return !code.used && !isExpired(code.expiresAt);
    if (filter === 'used') return code.used;
    if (filter === 'expired') return !code.used && isExpired(code.expiresAt);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invite Codes</h1>
            <p className="text-gray-600 mt-2">Manage invitation codes for developers and admins</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            <Plus size={20} />
            Create Code
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {(['all', 'active', 'used', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Codes</p>
            <p className="text-3xl font-bold text-gray-900">{inviteCodes.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">
              {inviteCodes.filter(c => !c.used && !isExpired(c.expiresAt)).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Used</p>
            <p className="text-3xl font-bold text-gray-600">
              {inviteCodes.filter(c => c.used).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Expired</p>
            <p className="text-3xl font-bold text-red-600">
              {inviteCodes.filter(c => !c.used && isExpired(c.expiresAt)).length}
            </p>
          </div>
        </div>

        {/* Invite Codes List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredCodes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No invite codes found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Used By
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCodes.map((code) => (
                    <tr key={code.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <code className="px-3 py-1 bg-gray-100 text-gray-900 font-mono text-sm rounded border border-gray-300">
                            {code.code}
                          </code>
                          <button
                            onClick={() => handleCopyCode(code.code)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Copy code"
                          >
                            <Copy size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          code.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {code.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(code)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {code.expiresAt ? (
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(code.expiresAt).toLocaleDateString()}
                          </span>
                        ) : (
                          'Never'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {code.usedBy || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!code.used && (
                          <button
                            onClick={() => handleDeleteCode(code.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete code"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Invite Code</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={newCode.role}
                    onChange={(e) => setNewCode({ ...newCode, role: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="DEVELOPER">Developer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expires In (Days)
                  </label>
                  <input
                    type="number"
                    value={newCode.expiresInDays}
                    onChange={(e) => setNewCode({ ...newCode, expiresInDays: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    min="1"
                    max="365"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank for no expiration</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCode}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
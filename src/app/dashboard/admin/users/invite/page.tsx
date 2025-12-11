'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../../lib/api';
import { ArrowLeft, Plus, Copy, Trash2, CheckCircle, XCircle, Calendar, Shield, Code } from 'lucide-react';

interface InviteCode {
  id: string;
  code: string;
  role: string;
  used: boolean;
  usedBy: string | null;
  usedAt: string | null;
  expiresAt: string | null;
}

export default function GenerateInviteCodesPage() {
  const router = useRouter();
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    role: 'DEVELOPER',
    expiresInDays: '30',
    count: '1'
  });

  useEffect(() => {
    fetchInviteCodes();
  }, []);

  const fetchInviteCodes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/invite-codes');
      setInviteCodes(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching invite codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = async () => {
    setGenerating(true);
    
    try {
      const count = parseInt(formData.count);
      const promises = [];

      for (let i = 0; i < count; i++) {
        promises.push(
          api.post('/admin/invite-codes', {
            role: formData.role,
            expiresInDays: formData.expiresInDays ? parseInt(formData.expiresInDays) : null
          })
        );
      }

      await Promise.all(promises);
      alert(`${count} invite code(s) generated successfully!`);
      fetchInviteCodes();
      
      // Reset form
      setFormData({ role: 'DEVELOPER', expiresInDays: '30', count: '1' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate invite codes');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const deleteInviteCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invite code?')) return;

    try {
      await api.delete(`/admin/invite-codes/${id}`);
      setInviteCodes(inviteCodes.filter(code => code.id !== id));
      alert('Invite code deleted successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete invite code');
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push('/dashboard/admin')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite Codes</h1>
        <p className="text-gray-600 mb-8">Generate and manage invitation codes for developers and admins</p>

       {/* Generate New Code Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Generate New Invite Code</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
              >
                <option value="DEVELOPER">Developer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires In (Days)
              </label>
              <input
                type="number"
                value={formData.expiresInDays}
                onChange={(e) => setFormData({ ...formData, expiresInDays: e.target.value })}
                placeholder="30"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank for no expiry</p>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                min="1"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
              />
            </div>

            <div className="flex-1 flex items-end">
              <button
                onClick={generateInviteCode}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Invite codes are single-use only. Once used by a person during signup, they cannot be used again.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Total Codes</p>
            <p className="text-3xl font-bold text-gray-900">{inviteCodes.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Available</p>
            <p className="text-3xl font-bold text-green-600">
              {inviteCodes.filter(c => !c.used && !isExpired(c.expiresAt)).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Used</p>
            <p className="text-3xl font-bold text-blue-600">
              {inviteCodes.filter(c => c.used).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Expired</p>
            <p className="text-3xl font-bold text-red-600">
              {inviteCodes.filter(c => !c.used && isExpired(c.expiresAt)).length}
            </p>
          </div>
        </div>

        {/* Invite Codes List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">All Invite Codes</h2>
          </div>

          {inviteCodes.length === 0 ? (
            <div className="p-12 text-center">
              <Shield size={64} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No invite codes yet</h3>
              <p className="text-gray-600">Generate your first invite code to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Used By</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inviteCodes.map((code) => (
                    <tr key={code.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm font-bold">
                            {code.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(code.code)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Copy code"
                          >
                            <Copy size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          code.role === 'DEVELOPER' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {code.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {code.used ? (
                          <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium w-fit">
                            <CheckCircle size={14} />
                            Used
                          </span>
                        ) : isExpired(code.expiresAt) ? (
                          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium w-fit">
                            <XCircle size={14} />
                            Expired
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium w-fit">
                            <CheckCircle size={14} />
                            Available
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {code.expiresAt ? (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(code.expiresAt).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {code.usedBy || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => deleteInviteCode(code.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
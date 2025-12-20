'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import ProtectedRoute from '../../../../component/protectedRoutes';
import { 
  Mail, Phone, Building, MessageSquare, Calendar, 
  Search, Filter, Eye, Archive, Reply, Trash2, 
  CheckCircle, Clock, AlertCircle, RefreshCw 
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchTerm, statusFilter, contacts]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact');
      const contactsData = response.data.data || [];
      setContacts(contactsData);
      setFilteredContacts(contactsData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      alert('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    setFilteredContacts(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-700';
      case 'READ':
        return 'bg-yellow-100 text-yellow-700';
      case 'REPLIED':
        return 'bg-green-100 text-green-700';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return AlertCircle;
      case 'READ':
        return Eye;
      case 'REPLIED':
        return CheckCircle;
      case 'ARCHIVED':
        return Archive;
      default:
        return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateStatus = async (id: string, status: string, notes?: string) => {
  try {
    // Cast the status to ContactMessage['status'] type
    const typedStatus = status as ContactMessage['status'];
    
    await api.patch(`/contact/${id}`, { status: typedStatus, notes });
    
    // Update local state with properly typed status
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { 
        ...contact, 
        status: typedStatus, 
        notes: notes || contact.notes 
      } : contact
    ));
    
    // Update selected contact if it's the same
    if (selectedContact?.id === id) {
      setSelectedContact(prev => prev ? { 
        ...prev, 
        status: typedStatus, 
        notes: notes || prev.notes 
      } : null);
    }
    
    alert('Status updated successfully');
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update status');
  }
};

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;

    try {
      await api.delete(`/contact/${id}`);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
      alert('Contact message deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact message');
    }
  };

  const openEmailClient = (email: string, subject?: string) => {
    const emailSubject = subject ? `Re: ${subject}` : 'Re: Your Inquiry';
    window.open(`mailto:${email}?subject=${encodeURIComponent(emailSubject)}`, '_blank');
  };

  const viewDetails = (contact: ContactMessage) => {
    setSelectedContact(contact);
    
    // Mark as read if it's new
    if (contact.status === 'NEW') {
      updateStatus(contact.id, 'READ');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Messages</h1>
                <p className="text-gray-600">Manage and respond to customer inquiries</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchContacts}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Total Messages</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{contacts.length}</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-blue-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">New</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {contacts.filter(c => c.status === 'NEW').length}
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Eye className="text-yellow-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Read</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {contacts.filter(c => c.status === 'READ').length}
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Replied</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {contacts.filter(c => c.status === 'REPLIED').length}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Contacts List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search by name, email, or message..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="NEW">New</option>
                      <option value="READ">Read</option>
                      <option value="REPLIED">Replied</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Contacts Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredContacts.map((contact) => {
                        const StatusIcon = getStatusIcon(contact.status);
                        return (
                          <tr 
                            key={contact.id} 
                            className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                              selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => viewDetails(contact)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                  {contact.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900 block">{contact.name}</span>
                                  <span className="text-xs text-gray-500">{contact.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {contact.service || 'Not specified'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(contact.status)}`}>
                                <StatusIcon size={12} />
                                {contact.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 text-sm">
                              {formatDate(contact.createdAt)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewDetails(contact);
                                  }}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={18} className="text-gray-600" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEmailClient(contact.email, contact.service);
                                  }}
                                  className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Reply"
                                >
                                  <Reply size={18} className="text-green-600" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContact(contact.id);
                                  }}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={18} className="text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  {filteredContacts.length === 0 && (
                    <div className="px-6 py-12 text-center text-gray-500">
                      <Mail className="mx-auto text-gray-400 mb-3" size={48} />
                      <p className="text-gray-600">No contact messages found</p>
                      <p className="text-sm text-gray-500 mt-1">Try changing your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedContact ? (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-xl">
                          {selectedContact.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{selectedContact.name}</h3>
                          <p className="text-gray-600">{selectedContact.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {selectedContact.company && (
                          <div>
                            <p className="text-sm text-gray-500">Company</p>
                            <p className="font-medium text-gray-900">{selectedContact.company}</p>
                          </div>
                        )}
                        
                        {selectedContact.phone && (
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{selectedContact.phone}</p>
                          </div>
                        )}
                        
                        {selectedContact.service && (
                          <div>
                            <p className="text-sm text-gray-500">Service</p>
                            <p className="font-medium text-gray-900">{selectedContact.service}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContact.status)}`}>
                            {selectedContact.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MessageSquare size={16} />
                        Message
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Received: {formatDate(selectedContact.createdAt)}</span>
                      </div>
                      {selectedContact.updatedAt !== selectedContact.createdAt && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>Updated: {formatDate(selectedContact.updatedAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {selectedContact.notes && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                        <div className="bg-yellow-50 rounded-xl p-4">
                          <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => openEmailClient(selectedContact.email, selectedContact.service)}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white rounded-xl hover:from-gray-700 hover:to-gray-900 transition-all"
                        >
                          <Reply size={16} />
                          Reply
                        </button>
                        
                        <select
                          value={selectedContact.status}
                          onChange={(e) => updateStatus(selectedContact.id, e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          <option value="NEW">Mark as New</option>
                          <option value="READ">Mark as Read</option>
                          <option value="REPLIED">Mark as Replied</option>
                          <option value="ARCHIVED">Archive</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            const notes = prompt('Add notes:');
                            if (notes !== null) {
                              updateStatus(selectedContact.id, selectedContact.status, notes);
                            }
                          }}
                          className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Add Notes
                        </button>
                        
                        <button
                          onClick={() => deleteContact(selectedContact.id)}
                          className="px-4 py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 h-full flex flex-col items-center justify-center text-center">
                  <MessageSquare className="text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Message</h3>
                  <p className="text-gray-600 text-sm">Click on a contact message to view details and respond</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
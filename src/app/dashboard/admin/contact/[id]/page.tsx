'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import {  ArrowLeft, Mail, Phone, Building,  Calendar, CheckCircle, Clock, Archive, Reply, Tag,} from 'lucide-react';  


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

export default function ContactDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [contact, setContact] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    fetchContactDetails();
  }, [id]);

  const fetchContactDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contact/${id}`);
      setContact(response.data.data);
    } catch (error) {
      console.error('Error fetching contact details:', error);
      alert('Failed to load contact details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      setUpdating(true);
      await api.patch(`/contact/${id}`, { status });
      
      // Update local state
      if (contact) {
        setContact({ ...contact, status: status as any });
      }
      
      alert(`Status updated to ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const sendReply = async () => {
  if (!replyMessage.trim()) {
    alert('Please enter a reply message');
    return;
  }

  try {
    setUpdating(true);

    // Call the new API endpoint
    const response = await api.post(`/contact/${id}/reply`, {
      message: replyMessage,
      subject: `Re: ${contact?.service || 'Your Inquiry'}`
    });

    // Update local state
    if (contact) {
      setContact({ 
        ...contact, 
        status: 'REPLIED',
        notes: contact.notes 
          ? `${contact.notes}\n\nReplied on ${new Date().toLocaleString()}:\n${replyMessage}`
          : `Replied on ${new Date().toLocaleString()}:\n${replyMessage}`
      });
    }
    
    setReplyMessage('');
    setShowReplyForm(false);
    alert('Reply email sent successfully!');
  } catch (error: any) {
    console.error('Error sending reply:', error);
    alert(error.response?.data?.message || 'Failed to send reply email');
  } finally {
    setUpdating(false);
  }
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-700';
      case 'READ': return 'bg-yellow-100 text-yellow-700';
      case 'REPLIED': return 'bg-green-100 text-green-700';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW': return Clock;
      case 'READ': return CheckCircle;
      case 'REPLIED': return Reply;
      case 'ARCHIVED': return Archive;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact not found</h2>
          <button
            onClick={() => router.push('/dashboard/admin/contact')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(contact.status);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/admin/contact')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Contacts
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Message</h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contact.status)} flex items-center gap-2`}>
                  <StatusIcon size={16} />
                  {contact.status}
                </span>
                <span className="text-sm text-gray-500">
                  Received {new Date(contact.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => updateStatus('ARCHIVED')}
                disabled={updating || contact.status === 'ARCHIVED'}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Archive
              </button>
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                disabled={updating}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Reply size={18} />
                Reply
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-900 rounded-xl flex items-center justify-center text-white font-bold">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {contact.company && (
                    <div className="flex items-center gap-3">
                      <Building className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="text-gray-900">{contact.company}</p>
                      </div>
                    </div>
                  )}
                  
                  {contact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a href={`tel:${contact.phone}`} className="text-gray-900 hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {contact.service && (
                    <div className="flex items-center gap-3">
                      <Tag className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Service Interested In</p>
                        <p className="text-gray-900">{contact.service}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Received</p>
                      <p className="text-gray-900">
                        {new Date(contact.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.open(`mailto:${contact.email}?subject=Re: Your Inquiry&body=Dear ${contact.name},\n\n`, '_blank')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Mail size={18} />
                  <div>
                    <p className="font-medium">Email Directly</p>
                    <p className="text-sm text-gray-500">Open in your email client</p>
                  </div>
                </button>

                <button
                  onClick={() => updateStatus('READ')}
                  disabled={updating || contact.status === 'READ'}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={18} />
                  <div>
                    <p className="font-medium">Mark as Read</p>
                    <p className="text-sm text-gray-500">Update status</p>
                  </div>
                </button>

                <button
                  onClick={() => updateStatus('REPLIED')}
                  disabled={updating || contact.status === 'REPLIED'}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Reply size={18} />
                  <div>
                    <p className="font-medium">Mark as Replied</p>
                    <p className="text-sm text-green-500">Without sending email</p>
                  </div>
                </button>

                <button
                  onClick={() => updateStatus('ARCHIVED')}
                  disabled={updating || contact.status === 'ARCHIVED'}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Archive size={18} />
                  <div>
                    <p className="font-medium">Archive</p>
                    <p className="text-sm text-gray-500">Move to archive</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Message & Reply Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Message</h2>
              
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 rounded-lg p-6">
                  {contact.message}
                </div>
              </div>
              
              {contact.notes && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reply Form */}
            {showReplyForm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send Email Reply</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To: {contact.name} &lt;{contact.email}&gt;
                    </label>
                    <input
                      type="text"
                      value={`Re: ${contact.service || 'Your Inquiry'}`}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 mb-4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Reply
                    </label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder={`Dear ${contact.name},\n\nThank you for contacting Devcore.`}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      This will send an actual email to {contact.email}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowReplyForm(false)}
                        disabled={updating}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={sendReply}
                        disabled={updating || !replyMessage.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {updating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail size={18} />
                            Send Email
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
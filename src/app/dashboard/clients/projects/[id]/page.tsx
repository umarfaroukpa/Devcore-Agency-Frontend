'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import { ArrowLeft, DollarSign, Calendar, Users, Mail, MessageSquare, Clock, X, User } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  clientName: string;
  clientEmail: string;
  tasks?: any[];
  members?: any[];
}

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

interface TimeLog {
  id: string;
  hours: number;
  description: string;
  date: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newTimeLog, setNewTimeLog] = useState({ hours: '', description: '' });
  const [showTimeLogModal, setShowTimeLogModal] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchComments();
    fetchTimeLogs();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/clients/projects/${projectId}`);
      setProject(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to load project:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/clients/projects/${projectId}/comments`);
      setComments(response.data.data || response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const fetchTimeLogs = async () => {
    try {
      const response = await api.get(`/clients/projects/${projectId}/time-logs`);
      setTimeLogs(response.data.data || response.data.timeLogs || []);
    } catch (error) {
      console.error('Error fetching time logs:', error);
      setTimeLogs([]);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/clients/projects/${projectId}/comments`, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleSubmitTimeLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimeLog.hours || !newTimeLog.description) {
      alert('Please fill all fields');
      return;
    }

    try {
      await api.post(`/clients/projects/${projectId}/time-logs`, {
        hours: parseFloat(newTimeLog.hours),
        description: newTimeLog.description,
        date: new Date().toISOString()
      });
      
      alert('Time logged successfully');
      setShowTimeLogModal(false);
      setNewTimeLog({ hours: '', description: '' });
      fetchTimeLogs();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to log time');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project doesn't exist or you don't have access.</p>
          <button
            onClick={() => router.push('/dashboard/clients')}
            className="inline-flex items-center px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-900 transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push('/dashboard/clients')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-lg text-gray-600 mt-2">
            {project.description || 'No description provided.'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-2xl font-bold mt-2 text-gray-500">
              {project.status.replace('_', ' ')}
            </p>
          </div>
          
          {project.budget && (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <DollarSign size={16} />
                Budget
              </p>
              <p className="text-2xl font-bold mt-2">
                ${project.budget.toLocaleString()}
              </p>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500">Client</p>
            <p className="text-xl font-medium mt-2">{project.clientName}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Mail size={16} />
              Email
            </p>
            <p className="text-sm font-medium mt-2 truncate">{project.clientEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks and Members */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tasks Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold mb-6">Tasks</h2>
              {project.tasks && project.tasks.length > 0 ? (
                <div className="space-y-4">
                  {project.tasks.map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        {task.priority && (
                          <span className="text-xs text-gray-500">Priority: {task.priority}</span>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No tasks added yet.</p>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare size={24} />
                Project Comments ({comments.length})
              </h2>

              <form onSubmit={handleSubmitComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder="Add a comment about the project..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none mb-3"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer font-medium rounded-lg hover:bg-gray-900 transition"
                >
                  Post Comment
                </button>
              </form>

              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {comment.user.firstName?.[0]}{comment.user.lastName?.[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {comment.user.firstName} {comment.user.lastName}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Members and Time Logs */}
          <div className="space-y-6">
            {/* Members Section */}
            {project.members && project.members.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users size={24} />
                  Team Members
                </h2>
                <div className="space-y-4">
                  {project.members.map((member: any) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium">
                          {member.user?.firstName} {member.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{member.user?.email}</p>
                        <p className="text-xs text-gray-400 capitalize">{member.role?.toLowerCase()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Logs Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock size={20} />
                Project Time Logs
              </h2>
              
              <div className="space-y-3">
                {timeLogs.length > 0 ? (
                  timeLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{log.hours}h</span>
                        <span className="text-sm text-gray-500">
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                      <div className="flex items-center gap-2">
                        <User size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {log.user.firstName} {log.user.lastName}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No time logs recorded yet
                  </div>
                )}
                
                <button
                  onClick={() => setShowTimeLogModal(true)}
                  className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  + Log Time for Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Log Modal */}
      {showTimeLogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Log Project Time</h2>
                <button
                  onClick={() => setShowTimeLogModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitTimeLog} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours Worked *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={newTimeLog.hours}
                    onChange={(e) => setNewTimeLog({ ...newTimeLog, hours: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    placeholder="e.g., 2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newTimeLog.description}
                    onChange={(e) => setNewTimeLog({ ...newTimeLog, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="What did you work on for this project?"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTimeLogModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gray-500 text-white font-medium rounded-xl hover:bg-gray-900 transition"
                >
                  Save Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
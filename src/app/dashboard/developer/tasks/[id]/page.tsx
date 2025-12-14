'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import { ArrowLeft, AlertCircle, MessageSquare, X, User, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  assignedTo?: string;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
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

export default function DeveloperTaskDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newTimeLog, setNewTimeLog] = useState({ hours: '', description: '' });
  const [showTimeLogModal, setShowTimeLogModal] = useState(false);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
      fetchComments();
      fetchTimeLogs();
    }
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/dev/tasks/${taskId}`);
      setTask(response.data.data || response.data);
    } catch (error: any) {
      console.error('Error fetching task:', error);
      alert(error.response?.data?.error || 'Failed to load task details');
      router.push('/developer');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      //dev/tasks instead of /tasks
      const response = await api.get(`/dev/tasks/${taskId}/comments`);
      setComments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const fetchTimeLogs = async () => {
    try {
      //dev/tasks instead of /tasks
      const response = await api.get(`/dev/tasks/${taskId}/time-logs`);
      setTimeLogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching time logs:', error);
      setTimeLogs([]);
    }
  };

  const handleUpdateStatus = async (status: Task['status']) => {
    if (!confirm(`Change task status to ${status.replace('_', ' ')}?`)) return;

    try {
      await api.patch(`/dev/tasks/${taskId}`, { status });
      alert('Task status updated successfully');
      fetchTaskDetails();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update task status');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      //dev/tasks instead of /tasks
      await api.post(`/dev/tasks/${taskId}/comments`, { content: newComment });
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
      //dev/tasks instead of /tasks
      await api.post(`/dev/tasks/${taskId}/time-logs`, {
        hours: parseFloat(newTimeLog.hours),
        description: newTimeLog.description,
        date: new Date().toISOString()
      });
      
      alert('Time logged successfully');
      setShowTimeLogModal(false);
      setNewTimeLog({ hours: '', description: '' });
      fetchTaskDetails();
      fetchTimeLogs();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to log time');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-700';
      case 'DONE': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusOptions = (currentStatus: Task['status']) => {
    const statusFlow = {
      'TODO': ['IN_PROGRESS'],
      'IN_PROGRESS': ['REVIEW', 'DONE'],
      'REVIEW': ['IN_PROGRESS', 'DONE'],
      'DONE': ['IN_PROGRESS', 'REVIEW']
    };
    return statusFlow[currentStatus] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Task not found</p>
          <button
            onClick={() => router.push('/developer')}
            className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:from-gray-500 hover:to-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/developer')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <AlertCircle className={getPriorityColor(task.priority)} size={18} />
                <span className="text-sm text-gray-600">{task.priority} Priority</span>
              </div>
            </div>

            {/* Status Update Buttons */}
            <div className="flex gap-2">
              {getStatusOptions(task.status).map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(status as Task['status'])}
                  className={`px-4 py-2 rounded-xl font-medium ${
                    status === 'IN_PROGRESS' ? 'bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer hover:bg-gray-500' :
                    status === 'REVIEW' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                    status === 'DONE' ? 'bg-green-600 text-white hover:bg-green-700' :
                    'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Mark as {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Task Details</h2>
              
              {task.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {/* Project Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Project</h3>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {task.project?.name?.[0] || 'P'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{task.project?.name || 'No Project'}</p>
                      <p className="text-sm text-gray-600">Status: {task.project?.status || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Time Tracking */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Time Tracking</h3>
                    <button
                      onClick={() => setShowTimeLogModal(true)}
                      className="text-sm text-gray-500 hover:text-gray-900"
                    >
                      + Log Time
                    </button>
                  </div>
                  <div className="space-y-3 p-3 bg-gray-50 rounded-xl">
                    {task.estimatedHours && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Estimated</span>
                        <span className="font-medium text-gray-900">{task.estimatedHours}h</span>
                      </div>
                    )}
                    {task.actualHours && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Actual</span>
                        <span className="font-medium text-gray-900">{task.actualHours}h</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Due Date</span>
                        <span className="font-medium text-gray-900">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare size={20} />
                Comments ({comments.length})
              </h2>

              <form onSubmit={handleSubmitComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder="Add a comment..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-3"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:from-gray-500 hover:to-gray-900"
                >
                  Post Comment
                </button>
              </form>

              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
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

          {/* Right Column - Time Logs & Info */}
          <div className="space-y-6">
            {/* Time Logs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={20} />
                Time Logs
              </h2>
              
              <div className="space-y-3">
                {timeLogs.length > 0 ? (
                  timeLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-xl">
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
                    No time logs recorded
                  </div>
                )}
                
                <button
                  onClick={() => setShowTimeLogModal(true)}
                  className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  + Add Time Log
                </button>
              </div>
            </div>

            {/* Task Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Task Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
                
                {task.updatedAt !== task.createdAt && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {new Date(task.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {task.assignee && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Assigned To</p>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {task.assignee.firstName?.[0]}{task.assignee.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {task.assignee.firstName} {task.assignee.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{task.assignee.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {task.creator && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Created By</p>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium">
                        {task.creator.firstName?.[0]}{task.creator.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {task.creator.firstName} {task.creator.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{task.creator.email}</p>
                      </div>
                    </div>
                  </div>
                )}
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
                <h2 className="text-xl font-bold text-gray-900">Log Time</h2>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                    placeholder="What did you work on?"
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:from-gray-500 hover:to-gray-900"
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
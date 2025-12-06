'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import ProtectedRoute from '../../../../../component/protectedRoutes';
import { ArrowLeft, Edit2, Trash2, Calendar, Clock, Briefcase, CheckCircle, } from 'lucide-react';
  

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  creator: {
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

interface Developer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentTaskCount: number;
}

export default function TaskDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState('');

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: '',
    estimatedHours: '',
    actualHours: ''
  });

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks/${taskId}`);
      const taskData = response.data.data;
      setTask(taskData);
      
      // Initialize edit form
      setEditForm({
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate ? taskData.dueDate.split('T')[0] : '',
        estimatedHours: taskData.estimatedHours?.toString() || '',
        actualHours: taskData.actualHours?.toString() || ''
      });

      // Fetch available developers for assignment
      if (taskData.project?.id) {
        const devsResponse = await api.get(`/tasks/available-developers?projectId=${taskData.project.id}`);
        setDevelopers(devsResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      alert('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/tasks/${taskId}`, editForm);
      alert('Task updated successfully');
      setIsEditing(false);
      fetchTaskDetails();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update task');
    }
  };

  const handleAssignTask = async () => {
    if (!selectedDeveloper) {
      alert('Please select a developer');
      return;
    }

    try {
      await api.patch(`/tasks/${taskId}/assign`, { assignedTo: selectedDeveloper });
      alert('Task assigned successfully');
      setShowAssignModal(false);
      fetchTaskDetails();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to assign task');
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      alert('Task deleted successfully');
      router.push('/dashboard/admin/tasks');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete task');
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
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'LOW': return 'bg-green-100 text-green-700';
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

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Task not found</p>
          <button
            onClick={() => router.push('/dashboard/admin/tasks')}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/dashboard/admin/tasks')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft size={20} />
              Back to Tasks
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Details</h1>
                <p className="text-gray-600">View and manage task information</p>
              </div>
              <div className="flex gap-2">
                {!isEditing && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                    >
                      <Edit2 size={18} />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteTask}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleUpdateTask} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Task</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">Review</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Est. Hours</label>
                    <input
                      type="number"
                      value={editForm.estimatedHours}
                      onChange={(e) => setEditForm({ ...editForm, estimatedHours: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Actual Hours</label>
                    <input
                      type="number"
                      value={editForm.actualHours}
                      onChange={(e) => setEditForm({ ...editForm, actualHours: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              {/* Main Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{task.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                {task.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Project</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Briefcase className="text-gray-600" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">{task.project.name}</p>
                        <p className="text-sm text-gray-600">Status: {task.project.status}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Assigned To</h3>
                      <button
                        onClick={() => setShowAssignModal(true)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {task.assignee ? 'Reassign' : 'Assign'}
                      </button>
                    </div>
                    {task.assignee ? (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {task.assignee.firstName[0]}{task.assignee.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {task.assignee.firstName} {task.assignee.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{task.assignee.role}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl text-center text-gray-500">
                        Not assigned
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Time Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
                  <div className="space-y-3">
                    {task.dueDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Due Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {task.estimatedHours && (
                      <div className="flex items-center gap-3">
                        <Clock className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Estimated Hours</p>
                          <p className="font-medium text-gray-900">{task.estimatedHours}h</p>
                        </div>
                      </div>
                    )}
                    {task.actualHours && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Actual Hours</p>
                          <p className="font-medium text-gray-900">{task.actualHours}h</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Creator Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Created By</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium">
                      {task.creator.firstName[0]}{task.creator.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {task.creator.firstName} {task.creator.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{task.creator.email}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium text-gray-900">
                      {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {task.updatedAt !== task.createdAt && (
                    <div className="pt-3">
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium text-gray-900">
                        {new Date(task.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Assign Task</h2>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Developer
              </label>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {developers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No developers available</p>
                ) : (
                  developers.map((dev) => (
                    <button
                      key={dev.id}
                      onClick={() => setSelectedDeveloper(dev.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        selectedDeveloper === dev.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {dev.firstName[0]}{dev.lastName[0]}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">
                          {dev.firstName} {dev.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {dev.currentTaskCount} active tasks
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTask}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
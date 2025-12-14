'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import ProtectedRoute from '../../../../component/protectedRoutes';
import { Plus, Search, Calendar, User, CheckSquare, AlertCircle, Briefcase } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: string;
  dueDate?: string;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

interface Developer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  currentTaskCount: number;
}

export default function TaskManagementPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Create task form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'MEDIUM',
    dueDate: '',
    estimatedHours: ''
  });

  useEffect(() => {
    // Get current user from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    fetchData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [searchTerm, statusFilter, priorityFilter, tasks]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      let tasksData = [];
      let projectsData = [];
      let developersData = [];

      // Fetch projects first (required for task creation)
      try {
        const projectsRes = await api.get('/admin/projects', { 
          timeout: 10000,
          headers: { 'Cache-Control': 'no-cache' }
        });
        projectsData = projectsRes.data.data || projectsRes.data || [];
        console.log('Projects loaded:', projectsData.length);
      } catch (projectError: any) {
        console.error('Error fetching projects:', projectError.message);
      }

      // Fetch developers
      try {
        const usersRes = await api.get('/admin/users', { 
          timeout: 10000,
          headers: { 'Cache-Control': 'no-cache' }
        });
        const usersData = usersRes.data.data || usersRes.data || [];
        
        developersData = usersData
          .filter((u: any) => 
            u.role === 'DEVELOPER' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
          )
          .map((u: any) => ({
            id: u.id,
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            email: u.email,
            role: u.role,
            currentTaskCount: 0
          }));
        console.log('Developers loaded:', developersData.length);
      } catch (devError: any) {
        console.error('Error fetching developers:', devError.message);
      }

      // Try different task endpoints with fallbacks
      try {
        // Try admin tasks endpoint first
        let tasksRes;
        try {
          tasksRes = await api.get('/admin/tasks', { 
            timeout: 15000,
            headers: { 'Cache-Control': 'no-cache' }
          });
        } catch (adminTaskError) {
          console.log('Admin tasks endpoint failed, trying /tasks...');
          // Fallback to regular tasks endpoint
          tasksRes = await api.get('/tasks', { 
            timeout: 15000,
            headers: { 'Cache-Control': 'no-cache' }
          });
        }
        
        tasksData = tasksRes.data.data || tasksRes.data || [];
        console.log('Tasks loaded:', tasksData.length);
      } catch (taskError: any) {
        console.error('Error fetching tasks:', taskError.message);
        // Show user-friendly message
        if (taskError.message.includes('timeout')) {
          console.warn('Tasks endpoint is slow or unavailable. Continuing without tasks.');
        }
      }

      setTasks(tasksData);
      setProjects(projectsData);
      setDevelopers(developersData);

    } catch (error: any) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.project?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.projectId) {
      alert('Please select a project');
      return;
    }

    try {
      const taskData = {
        ...newTask,
        estimatedHours: newTask.estimatedHours ? parseInt(newTask.estimatedHours) : undefined,
        assignedTo: newTask.assignedTo || undefined
      };

      await api.post('/tasks', taskData);
      alert('Task created successfully');
      setShowCreateModal(false);
      setNewTask({
        title: '',
        description: '',
        projectId: '',
        assignedTo: '',
        priority: 'MEDIUM',
        dueDate: '',
        estimatedHours: ''
      });
      fetchData();
    } catch (error: any) {
      console.error('Create task error:', error);
      alert(error.response?.data?.error || 'Failed to create task. Please try again.');
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

  const getTaskStats = () => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      review: tasks.filter(t => t.status === 'REVIEW').length,
      done: tasks.filter(t => t.status === 'DONE').length
    };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading task management...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management</h1>
              <p className="text-gray-600">Create, assign, and track project tasks</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard/admin')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                disabled={projects.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
                Create Task
              </button>
            </div>
          </div>

          {/* Warning if no projects */}
          {projects.length === 0 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800">
                <strong>No projects available.</strong> Please create a project first before creating tasks.
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">To Do</p>
              <p className="text-2xl font-bold text-gray-700">{stats.todo}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">In Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.review}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.done}</p>
            </div>
          </div>

          {/* Filters */}
          {tasks.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="DONE">Done</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Priority</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
          )}

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-100">
                <CheckSquare className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-2">
                  {tasks.length === 0 ? 'No tasks created yet' : 'No tasks match your filters'}
                </p>
                {tasks.length === 0 && projects.length > 0 && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Your First Task
                  </button>
                )}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => router.push(`/dashboard/admin/tasks/${task.id}`)}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <AlertCircle className={getPriorityColor(task.priority)} size={18} />
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  )}

                  {task.project && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Briefcase size={14} />
                      <span className="truncate">{task.project.name}</span>
                    </div>
                  )}

                  {task.assignee && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <User size={14} />
                      <span className="truncate">
                        {task.assignee.firstName} {task.assignee.lastName}
                      </span>
                    </div>
                  )}

                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  placeholder="Task description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project *
                  </label>
                  <select
                    required
                    value={newTask.projectId}
                    onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  >
                    <option value="">Select Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To (Optional)
                </label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                >
                  <option value="">Unassigned (Assign later)</option>
                  {currentUser && (
                    <optgroup label="Assign to Me">
                      <option value={currentUser.id}>
                        👤 Myself ({currentUser.firstName} {currentUser.lastName})
                      </option>
                    </optgroup>
                  )}
                  <optgroup label="Team Members">
                    {developers
                      .filter(dev => !currentUser || dev.id !== currentUser.id)
                      .map((dev) => (
                        <option key={dev.id} value={dev.id}>
                          {dev.firstName} {dev.lastName} ({dev.role})
                        </option>
                      ))}
                  </optgroup>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  You can assign the task now or leave it unassigned
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
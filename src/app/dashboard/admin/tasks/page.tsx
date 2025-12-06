'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import ProtectedRoute from '../../../../component/protectedRoutes';
import { Plus, Search, Briefcase, Calendar, User, CheckSquare,  AlertCircle } from 'lucide-react';
  
  
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
  const [error, setError] = useState<string | null>(null);

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
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Set timeout for entire operation
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
        });
        
        // Fetch data
        const fetchPromise = (async () => {
          const [tasksRes, projectsRes, usersRes] = await Promise.all([
            api.get('/tasks'),
            api.get('/admin/projects'),
            api.get('/admin/users')
          ]);
          
          if (isMounted) {
            setTasks(tasksRes.data.data || []);
            setProjects(projectsRes.data.data || []);
            
            const usersData = usersRes.data.data || [];
            const availableAssignees = usersData.filter((u: any) => 
              u.role === 'DEVELOPER' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
            ).map((u: any) => ({
              id: u.id,
              firstName: u.firstName || '',
              lastName: u.lastName || '',
              email: u.email,
              role: u.role,
              currentTaskCount: 0
            }));
            
            setDevelopers(availableAssignees);
          }
        })();
        
        await Promise.race([fetchPromise, timeoutPromise]);
        
      } catch (error: any) {
        if (isMounted) {
          console.error('Error fetching data:', error);
          setError(`Failed to load data: ${error.response?.data?.error || error.message}`);
          
          setTasks([]);
          setProjects([]);
          setDevelopers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

useEffect(() => {
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
        t.project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [searchTerm, statusFilter, priorityFilter, tasks]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/admin/projects'),
        api.get('/admin/users')
      ]);
      
      setTasks(tasksRes.data.data || []);
      setProjects(projectsRes.data.data || []);
      
      const usersData = usersRes.data.data || [];
      const availableAssignees = usersData.filter((u: any) => 
        u.role === 'DEVELOPER' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
      ).map((u: any) => ({
        id: u.id,
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email,
        role: u.role,
        currentTaskCount: 0
      }));
      
      setDevelopers(availableAssignees);
    } catch (error: any) {
      console.error('Error refreshing data:', error);
      alert(`Error refreshing data: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
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
      await refreshData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create task');
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading tasks...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
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
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Create Task
              </button>
            </div>
          </div>

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

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-100">
                <CheckSquare className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No tasks found</p>
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

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Briefcase size={14} />
                    <span className="truncate">{task.project.name}</span>
                  </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              {/* Assign To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To (Optional)
                </label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Unassigned (Assign later)</option>
                  <optgroup label="Assign to Me">
                    <option value={JSON.parse(localStorage.getItem('user') || '{}').id}>
                      👤 Myself ({JSON.parse(localStorage.getItem('user') || '{}').firstName} {JSON.parse(localStorage.getItem('user') || '{}').lastName})
                    </option>
                  </optgroup>
                  <optgroup label="Team Members">
                    {developers.filter(dev => dev.id !== JSON.parse(localStorage.getItem('user') || '{}').id).map((dev) => (
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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
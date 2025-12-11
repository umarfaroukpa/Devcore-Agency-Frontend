'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { CheckSquare, Clock, AlertCircle, Play, Terminal } from 'lucide-react';
import NotificationBell from '../../../component/NotificationBell';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  dueDate?: string;
  project?: {
    name: string;
  };
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export default function DeveloperDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deployLoading, setDeployLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user from localStorage or API
    const getUser = async () => {
      try {
        // Try to get user from localStorage first (common pattern)
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        } else {
          // Fallback: fetch user from API
          const response = await api.get('/auth/me');
          setCurrentUser(response.data.data || response.data);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };

    getUser();
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dev/tasks');
      setTasks(response.data.tasks || response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // this for realtime updates 
  useEffect(() => {
    if (!currentUser?.id) return;

    // For now, use polling instead of WebSocket (simpler)
    const interval = setInterval(() => {
      fetchTasks();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [currentUser?.id]);

  const handleDeploy = async () => {
    if (!confirm('Are you sure you want to trigger a deployment?')) return;

    try {
      setDeployLoading(true);
      const response = await api.post('/dev/deploy');
      alert(response.data.message || 'Deployment initiated successfully');
      fetchLogs();
    } catch (error: any) {
      console.error('Error deploying:', error);
      alert(error.response?.data?.error || 'Deployment failed');
    } finally {
      setDeployLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await api.get('/dev/logs');
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const tasksByStatus = {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    REVIEW: tasks.filter(t => t.status === 'REVIEW'),
    DONE: tasks.filter(t => t.status === 'DONE')
  };

  const stats = [
    { label: 'Total Tasks', value: tasks.length, color: 'blue', icon: CheckSquare },
    { label: 'In Progress', value: tasksByStatus.IN_PROGRESS.length, color: 'yellow', icon: Clock },
    { label: 'In Review', value: tasksByStatus.REVIEW.length, color: 'purple', icon: AlertCircle },
    { label: 'Completed', value: tasksByStatus.DONE.length, color: 'green', icon: CheckSquare }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Updated with NotificationBell */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Developer Dashboard</h1>
            <p className="text-gray-600">Manage your tasks and deployments</p>
            {currentUser && (
              <p className="text-sm text-gray-500 mt-1">
                Welcome, {currentUser.firstName || currentUser.email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <button
              onClick={handleDeploy}
              disabled={deployLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:from-gray-500 hover:to-gray-900 transition-all shadow-lg disabled:opacity-50"
            >
              {deployLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deploying...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Deploy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className={`text-${stat.color}-600`} size={24} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Task Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  status === 'TODO' ? 'bg-gray-400' :
                  status === 'IN_PROGRESS' ? 'bg-yellow-400' :
                  status === 'REVIEW' ? 'bg-purple-400' :
                  'bg-green-400'
                }`}></span>
                {status.replace('_', ' ')}
                <span className="ml-auto text-sm text-gray-500">({statusTasks.length})</span>
              </h3>
              <div className="space-y-3">
                {statusTasks.map(task => (
                  <div 
                    key={task.id}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/developer/tasks/${task.id}`)}
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logs Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Terminal size={20} />
              System Logs
            </h3>
            <button
              onClick={fetchLogs}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
          <div className="bg-black rounded-xl p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="text-green-400 mb-1">{log}</div>
              ))
            ) : (
              <div className="text-gray-500">No logs available. Click refresh to load logs.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Code,  Clock, CheckCircle,  Play,  Activity } from 'lucide-react';
  
 
export default function DeveloperDashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    assignedTasks: 0,
    completedTasks: 0,
    inProgress: 0,
    hoursLogged: 0
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    fetchDeveloperData();
  }, []);

  const fetchDeveloperData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch tasks
      const tasksRes = await fetch('/api/developer/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const tasksData = await tasksRes.json();
      setTasks(tasksData.tasks);

      // Calculate stats
      const stats = {
        assignedTasks: tasksData.tasks.length,
        completedTasks: tasksData.tasks.filter((t: any) => t.status === 'DONE').length,
        inProgress: tasksData.tasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
        hoursLogged: 120 // Mock data
      };
      setStats(stats);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching developer data:', error);
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!confirm('Are you sure you want to trigger deployment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/developer/deploy', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Deployment error:', error);
      alert('Deployment failed');
    }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/developer/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/developer/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      fetchDeveloperData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const statCards = [
    { title: 'Assigned Tasks', value: stats.assignedTasks, icon: Code, color: 'blue' },
    { title: 'In Progress', value: stats.inProgress, icon: Clock, color: 'orange' },
    { title: 'Completed', value: stats.completedTasks, icon: CheckCircle, color: 'green' },
    { title: 'Hours Logged', value: stats.hoursLogged, icon: Activity, color: 'purple' }
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Developer Dashboard</h1>
            <p className="text-gray-600">Manage your tasks and deployments</p>
          </div>
          <button
            onClick={handleDeploy}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
          >
            <Play size={20} />
            Deploy
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className={`text-${stat.color}-600`} size={24} />
                </div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              {['tasks', 'logs', 'activity'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === 'logs') fetchLogs();
                  }}
                  className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="p-6">
              <div className="space-y-4">
                {tasks.map((task: any) => (
                  <div key={task.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{task.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-3 py-1 rounded-full font-medium ${
                            task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-gray-600">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="DONE">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="p-6">
              <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm text-green-400 max-h-96 overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log: string, index: number) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))
                ) : (
                  <div className="text-gray-500">No logs available</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
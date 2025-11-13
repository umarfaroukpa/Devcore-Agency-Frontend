'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users, Briefcase, CheckSquare, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, projects, tasks] = await Promise.all([
        api.get('/users'),
        api.get('/projects'),
        api.get('/tasks'),
      ]);

      setStats({
        totalUsers: users.data.length,
        totalProjects: projects.data.length,
        totalTasks: tasks.data.length,
        completedTasks: tasks.data.filter((t: any) => t.status === 'DONE').length,
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { title: 'Projects', value: stats.totalProjects, icon: Briefcase, color: 'bg-green-500' },
    { title: 'Total Tasks', value: stats.totalTasks, icon: CheckSquare, color: 'bg-purple-500' },
    { title: 'Completed', value: stats.completedTasks, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm border"
            >
              <div className={`flex-shrink-0 p-3 rounded mr-4 ${stat.color} text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{stat.title}</div>
                <div className="text-xl font-bold">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
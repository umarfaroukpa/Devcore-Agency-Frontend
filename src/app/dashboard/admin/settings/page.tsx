'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import ProtectedRoute from '../../../../component/protectedRoutes';
import { Settings, Save, Shield, Bell, Mail, Globe, Database, Server, Eye, EyeOff,  CheckCircle, AlertCircle, } from 'lucide-react';
   

interface SystemSettings {
  general: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    dateFormat: string;
    language: string;
  };
  security: {
    requireEmailVerification: boolean;
    enable2FA: boolean;
    passwordMinLength: number;
    passwordRequireSpecial: boolean;
    passwordRequireNumbers: boolean;
    sessionTimeout: number;
    loginAttempts: number;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    newUserAlerts: boolean;
    taskAssignmentAlerts: boolean;
    projectUpdates: boolean;
    systemMaintenance: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    encryption: 'none' | 'ssl' | 'tls';
  };
  storage: {
    maxFileSize: number;
    allowedExtensions: string[];
    storageProvider: 'local' | 's3' | 'cloudinary';
    s3Bucket?: string;
    s3Region?: string;
    cloudinaryCloudName?: string;
  };
}

export default function SystemSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'Project Management System',
      siteUrl: 'https://example.com',
      adminEmail: 'admin@example.com',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      language: 'en'
    },
    security: {
      requireEmailVerification: true,
      enable2FA: false,
      passwordMinLength: 8,
      passwordRequireSpecial: true,
      passwordRequireNumbers: true,
      sessionTimeout: 60,
      loginAttempts: 5
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      newUserAlerts: true,
      taskAssignmentAlerts: true,
      projectUpdates: true,
      systemMaintenance: true
    },
    email: {
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'user@example.com',
      smtpPassword: '',
      fromEmail: 'noreply@example.com',
      fromName: 'Project Management System',
      encryption: 'tls'
    },
    storage: {
      maxFileSize: 10,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      storageProvider: 'local',
      s3Bucket: '',
      s3Region: 'us-east-1',
      cloudinaryCloudName: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/settings');
      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Use default settings if API fails
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await api.put('/admin/settings', settings);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to save settings' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: keyof SystemSettings, field: string, value: string) => {
    const current = (settings[section] as any)[field] as string[];
    const newArray = value.split(',').map(item => item.trim()).filter(item => item);
    handleInputChange(section, field, newArray);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'storage', label: 'Storage', icon: Database }
  ];

  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
    'Asia/Dubai', 'Australia/Sydney'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const TabIcon = tabs.find(tab => tab.id === activeTab)?.icon || Globe;

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <Settings className="text-gray-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600">Configure system preferences and global settings</p>
              </div>
            </div>
            
            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-gray-50 text-gray-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="text-gray-600" size={20} />
                ) : (
                  <AlertCircle className="text-gray-600" size={20} />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-gray-50 text-gray-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon size={18} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TabIcon className="text-blue-600" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 capitalize">
                      {activeTab} Settings
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    Configure {activeTab} preferences for your system
                  </p>
                </div>

                <div className="p-6">
                  {/* General Settings */}
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Site Name *
                          </label>
                          <input
                            type="text"
                            value={settings.general.siteName}
                            onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            placeholder="Your Site Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Site URL *
                          </label>
                          <input
                            type="url"
                            value={settings.general.siteUrl}
                            onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Email *
                        </label>
                        <input
                          type="email"
                          value={settings.general.adminEmail}
                          onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="admin@example.com"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={settings.general.timezone}
                            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                          >
                            {timezones.map(tz => (
                              <option key={tz} value={tz}>{tz}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Format
                          </label>
                          <select
                            value={settings.general.dateFormat}
                            onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={settings.general.language}
                            onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                          >
                            {languages.map(lang => (
                              <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Require Email Verification</h3>
                            <p className="text-sm text-gray-600">Users must verify email before accessing account</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.security.requireEmailVerification}
                              onChange={(e) => handleInputChange('security', 'requireEmailVerification', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Enable Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-600">Add extra security layer for admin accounts</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.security.enable2FA}
                              onChange={(e) => handleInputChange('security', 'enable2FA', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password Minimum Length
                          </label>
                          <input
                            type="number"
                            value={settings.security.passwordMinLength}
                            onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            min="6"
                            max="32"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <input
                            type="number"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            min="5"
                            max="1440"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="requireSpecial"
                            checked={settings.security.passwordRequireSpecial}
                            onChange={(e) => handleInputChange('security', 'passwordRequireSpecial', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-gray-500"
                          />
                          <label htmlFor="requireSpecial" className="text-sm text-gray-700">
                            Require special characters in passwords
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="requireNumbers"
                            checked={settings.security.passwordRequireNumbers}
                            onChange={(e) => handleInputChange('security', 'passwordRequireNumbers', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-gray-500"
                          />
                          <label htmlFor="requireNumbers" className="text-sm text-gray-700">
                            Require numbers in passwords
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts Before Lockout
                        </label>
                        <input
                          type="number"
                          value={settings.security.loginAttempts}
                          onChange={(e) => handleInputChange('security', 'loginAttempts', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-gray-600">Send notifications via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.emailNotifications}
                              onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Push Notifications</h3>
                            <p className="text-sm text-gray-600">Enable browser push notifications</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.pushNotifications}
                              onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="space-y-3 mt-6">
                          <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">New User Registrations</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.newUserAlerts}
                                onChange={(e) => handleInputChange('notifications', 'newUserAlerts', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Task Assignments</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.taskAssignmentAlerts}
                                onChange={(e) => handleInputChange('notifications', 'taskAssignmentAlerts', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Project Updates</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.projectUpdates}
                                onChange={(e) => handleInputChange('notifications', 'projectUpdates', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">System Maintenance</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.systemMaintenance}
                                onChange={(e) => handleInputChange('notifications', 'systemMaintenance', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email Settings */}
                  {activeTab === 'email' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Host *
                          </label>
                          <input
                            type="text"
                            value={settings.email.smtpHost}
                            onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            placeholder="smtp.example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Port *
                          </label>
                          <input
                            type="number"
                            value={settings.email.smtpPort}
                            onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            placeholder="587"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Username *
                          </label>
                          <input
                            type="text"
                            value={settings.email.smtpUsername}
                            onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            placeholder="user@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={settings.email.smtpPassword}
                              onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none pr-12"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Email *
                          </label>
                          <input
                            type="email"
                            value={settings.email.fromEmail}
                            onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            placeholder="noreply@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Name *
                          </label>
                          <input
                            type="text"
                            value={settings.email.fromName}
                            onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            placeholder="Your System Name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Encryption *
                        </label>
                        <select
                          value={settings.email.encryption}
                          onChange={(e) => handleInputChange('email', 'encryption', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                        >
                          <option value="none">None</option>
                          <option value="ssl">SSL</option>
                          <option value="tls">TLS</option>
                        </select>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="text-blue-600 mt-0.5" size={18} />
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">Email Configuration Test</h4>
                            <p className="text-sm text-blue-700">
                              After saving these settings, you can test the email configuration by sending a test email.
                            </p>
                            <button
                              type="button"
                              onClick={() => {/* Test email functionality */}}
                              className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Send Test Email
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Storage Settings */}
                  {activeTab === 'storage' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum File Size (MB)
                        </label>
                        <input
                          type="number"
                          value={settings.storage.maxFileSize}
                          onChange={(e) => handleInputChange('storage', 'maxFileSize', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                          min="1"
                          max="100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum file size users can upload</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Allowed File Extensions
                        </label>
                        <input
                          type="text"
                          value={settings.storage.allowedExtensions.join(', ')}
                          onChange={(e) => handleArrayChange('storage', 'allowedExtensions', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                          placeholder="jpg, png, pdf, doc, docx"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate extensions with commas</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Storage Provider
                        </label>
                        <select
                          value={settings.storage.storageProvider}
                          onChange={(e) => handleInputChange('storage', 'storageProvider', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                        >
                          <option value="local">Local Storage</option>
                          <option value="s3">Amazon S3</option>
                          <option value="cloudinary">Cloudinary</option>
                        </select>
                      </div>

                      {settings.storage.storageProvider === 's3' && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <h4 className="font-medium text-gray-900">Amazon S3 Configuration</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                S3 Bucket Name
                              </label>
                              <input
                                type="text"
                                value={settings.storage.s3Bucket}
                                onChange={(e) => handleInputChange('storage', 's3Bucket', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                S3 Region
                              </label>
                              <input
                                type="text"
                                value={settings.storage.s3Region}
                                onChange={(e) => handleInputChange('storage', 's3Region', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {settings.storage.storageProvider === 'cloudinary' && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <h4 className="font-medium text-gray-900">Cloudinary Configuration</h4>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cloud Name
                            </label>
                            <input
                              type="text"
                              value={settings.storage.cloudinaryCloudName}
                              onChange={(e) => handleInputChange('storage', 'cloudinaryCloudName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => router.push('/dashboard/admin')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveSettings}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
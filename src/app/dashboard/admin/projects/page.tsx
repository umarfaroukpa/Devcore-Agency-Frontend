'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import ProtectedRoute from '../../../../component/protectedRoutes';
import { FolderGit2, Plus, Search, Eye, Edit, Trash2, Users, Calendar, CheckCircle, Download, BarChart, Target, TrendingUp, Users as UsersIcon, FileText, ChevronDown, FileSpreadsheet, FileText as FileTextIcon, FileType, CheckSquare, Square } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate?: string;
  endDate?: string;
  budget?: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  projectManager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    tasks: number;
    members: number;
  };
}

interface CreateProjectForm {
  name: string;
  description: string;
  clientId: string;
  projectManagerId: string;
  startDate: string;
  endDate: string;
  budget: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function ProjectManagementPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]); // Track selected project IDs
  const [selectAll, setSelectAll] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false); // Enable/disable selection mode

  const [newProject, setNewProject] = useState<CreateProjectForm>({
    name: '',
    description: '',
    clientId: '',
    projectManagerId: '',
    startDate: '',
    endDate: '',
    budget: 0,
    priority: 'MEDIUM',
    status: 'PLANNING'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, statusFilter, priorityFilter, projects]);

  // Reset selection when filtered projects change
  useEffect(() => {
    setSelectedProjects([]);
    setSelectAll(false);
  }, [filteredProjects]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, usersRes] = await Promise.all([
        api.get('/admin/projects'),
        api.get('/admin/users')
      ]);

      const projectsData = projectsRes.data.data || [];
      setProjects(projectsData);
      setFilteredProjects(projectsData);

      const usersData = usersRes.data.data || [];
      setClients(usersData.filter((user: User) => user.role === 'CLIENT'));
      setManagers(usersData.filter((user: User) =>
        user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'DEVELOPER'
      ));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(p => p.priority === priorityFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  // Selection handlers
  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
    setSelectAll(!selectAll);
  };

  const getSelectedProjects = () => {
    return filteredProjects.filter(p => selectedProjects.includes(p.id));
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/projects', newProject);
      alert('Project created successfully');
      setShowCreateModal(false);
      setNewProject({
        name: '',
        description: '',
        clientId: '',
        projectManagerId: '',
        startDate: '',
        endDate: '',
        budget: 0,
        priority: 'MEDIUM',
        status: 'PLANNING'
      });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/projects/${projectId}`);
      alert('Project deleted successfully');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete project');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS': return 'bg-green-100 text-green-700';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED': return 'bg-purple-100 text-purple-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStats = () => {
    const total = projects.length;
    const planning = projects.filter(p => p.status === 'PLANNING').length;
    const inProgress = projects.filter(p => p.status === 'IN_PROGRESS').length;
    const completed = projects.filter(p => p.status === 'COMPLETED').length;
    const onHold = projects.filter(p => p.status === 'ON_HOLD').length;

    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const avgProgress = projects.length > 0
      ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
      : 0;

    return { total, planning, inProgress, completed, onHold, totalBudget, avgProgress };
  };

  const stats = getStats();

  // Updated export functions to use selected projects
  const exportToCSV = () => {
    setExportLoading(true);

    const projectsToExport = selectedProjects.length > 0
      ? getSelectedProjects()
      : filteredProjects;

    if (projectsToExport.length === 0) {
      alert(selectedProjects.length > 0 ? 'No selected projects to export' : 'No projects to export');
      setExportLoading(false);
      return;
    }

    try {
      // Prepare data for CSV
      const csvData = projectsToExport.map(project => ({
        'Project Name': project.name,
        'Description': project.description || '',
        'Status': project.status,
        'Priority': project.priority,
        'Progress': `${project.progress}%`,
        'Start Date': project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A',
        'End Date': project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A',
        'Budget': project.budget ? `$${project.budget.toLocaleString()}` : 'N/A',
        'Client': project.client ? `${project.client.firstName} ${project.client.lastName}` : 'N/A',
        'Project Manager': project.projectManager ? `${project.projectManager.firstName} ${project.projectManager.lastName}` : 'N/A',
        'Tasks Count': project._count?.tasks || 0,
        'Members Count': project._count?.members || 0,
        'Created Date': new Date(project.createdAt).toLocaleDateString(),
        'Last Updated': new Date(project.updatedAt).toLocaleDateString()
      }));

      // Create CSV content
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => {
          const value = row[header as keyof typeof row];
          // Escape quotes and wrap in quotes if contains comma
          return typeof value === 'string' && value.includes(',')
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `projects_${new Date().toISOString().split('T')[0]}.csv`);

      alert(`Exported ${projectsToExport.length} project${projectsToExport.length !== 1 ? 's' : ''} to CSV`);
      if (selectedProjects.length > 0) {
        setSelectedProjects([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Failed to export to CSV');
    } finally {
      setExportLoading(false);
      setShowExportDropdown(false);
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    setExportLoading(true);

    const projectsToExport = selectedProjects.length > 0
      ? getSelectedProjects()
      : filteredProjects;

    if (projectsToExport.length === 0) {
      alert(selectedProjects.length > 0 ? 'No selected projects to export' : 'No projects to export');
      setExportLoading(false);
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = projectsToExport.map(project => ({
        'Project Name': project.name,
        'Description': project.description || '',
        'Status': project.status,
        'Priority': project.priority,
        'Progress (%)': project.progress,
        'Start Date': project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        'End Date': project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        'Budget': project.budget || 0,
        'Client Name': project.client ? `${project.client.firstName} ${project.client.lastName}` : '',
        'Client Email': project.client?.email || '',
        'Project Manager': project.projectManager ? `${project.projectManager.firstName} ${project.projectManager.lastName}` : '',
        'Tasks Count': project._count?.tasks || 0,
        'Members Count': project._count?.members || 0,
        'Created Date': new Date(project.createdAt).toISOString().split('T')[0],
        'Last Updated': new Date(project.updatedAt).toISOString().split('T')[0]
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Projects');

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `projects_${new Date().toISOString().split('T')[0]}.xlsx`);

      alert(`Exported ${projectsToExport.length} project${projectsToExport.length !== 1 ? 's' : ''} to Excel`);
      if (selectedProjects.length > 0) {
        setSelectedProjects([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export to Excel');
    } finally {
      setExportLoading(false);
      setShowExportDropdown(false);
    }
  };

  // Export to PDF function
  const exportToPDF = () => {
    setExportLoading(true);

    const projectsToExport = selectedProjects.length > 0
      ? getSelectedProjects()
      : filteredProjects;

    if (projectsToExport.length === 0) {
      alert(selectedProjects.length > 0 ? 'No selected projects to export' : 'No projects to export');
      setExportLoading(false);
      return;
    }

    try {
      // Create new PDF document
      const doc = new jsPDF('landscape');

      // Add title
      doc.setFontSize(20);
      doc.text('Projects Report', 14, 15);

      // Add report date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
      doc.text(`Total Projects: ${projectsToExport.length}`, 14, 28);

      // Prepare table data
      const tableData = projectsToExport.map(project => [
        project.name,
        project.status,
        project.priority,
        `${project.progress}%`,
        project.budget ? `$${project.budget.toLocaleString()}` : 'N/A',
        project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A',
        project._count?.tasks || 0,
        project._count?.members || 0
      ]);

      // Add table using autoTable function directly
      autoTable(doc, {
        startY: 35,
        head: [['Name', 'Status', 'Priority', 'Progress', 'Budget', 'Start Date', 'Tasks', 'Members']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }, // blue-600
        columnStyles: {
          0: { cellWidth: 40 }, // Name
          1: { cellWidth: 25 }, // Status
          2: { cellWidth: 25 }, // Priority
          3: { cellWidth: 20 }, // Progress
          4: { cellWidth: 25 }, // Budget
          5: { cellWidth: 25 }, // Start Date
          6: { cellWidth: 15 }, // Tasks
          7: { cellWidth: 15 }  // Members
        },
        didDrawPage: (data: any) => {
          // Footer
          doc.setFontSize(10);
          doc.text(
            `Page ${data.pageNumber}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      });

      // Save PDF
      doc.save(`projects_report_${new Date().toISOString().split('T')[0]}.pdf`);

      alert(`Exported ${projectsToExport.length} project${projectsToExport.length !== 1 ? 's' : ''} to PDF`);
      if (selectedProjects.length > 0) {
        setSelectedProjects([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export to PDF');
    } finally {
      setExportLoading(false);
      setShowExportDropdown(false);
    }
  };

  // Export to JSON function
  const exportToJSON = () => {
    setExportLoading(true);

    const projectsToExport = selectedProjects.length > 0
      ? getSelectedProjects()
      : filteredProjects;

    if (projectsToExport.length === 0) {
      alert(selectedProjects.length > 0 ? 'No selected projects to export' : 'No projects to export');
      setExportLoading(false);
      return;
    }

    try {
      // Create JSON data
      const jsonData = {
        exportDate: new Date().toISOString(),
        totalProjects: projectsToExport.length,
        selectedOnly: selectedProjects.length > 0,
        filters: {
          searchTerm,
          statusFilter,
          priorityFilter
        },
        projects: projectsToExport.map(project => ({
          ...project,
          startDate: project.startDate ? new Date(project.startDate).toISOString() : null,
          endDate: project.endDate ? new Date(project.endDate).toISOString() : null,
          createdAt: new Date(project.createdAt).toISOString(),
          updatedAt: new Date(project.updatedAt).toISOString()
        }))
      };

      // Create blob and download
      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      saveAs(blob, `projects_${new Date().toISOString().split('T')[0]}.json`);

      alert(`Exported ${projectsToExport.length} project${projectsToExport.length !== 1 ? 's' : ''} to JSON`);
      if (selectedProjects.length > 0) {
        setSelectedProjects([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      alert('Failed to export to JSON');
    } finally {
      setExportLoading(false);
      setShowExportDropdown(false);
    }
  };

  // Main export handler
  const handleExport = (format: 'csv' | 'excel' | 'pdf' | 'json') => {
    const projectsToExport = selectedProjects.length > 0
      ? getSelectedProjects()
      : filteredProjects;

    if (projectsToExport.length === 0) {
      alert(selectedProjects.length > 0 ? 'No selected projects to export' : 'No projects to export');
      return;
    }

    switch (format) {
      case 'csv':
        exportToCSV();
        break;
      case 'excel':
        exportToExcel();
        break;
      case 'pdf':
        exportToPDF();
        break;
      case 'json':
        exportToJSON();
        break;
    }
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedProjects([]);
      setSelectAll(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Management</h1>
              <p className="text-gray-600">Create, manage, and track all projects</p>
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
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-gray-700 transition-colors"
              >
                <Plus size={20} />
                Create Project
              </button>
            </div>
          </div>

          {/* Selection Controls */}
          {selectionMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="text-yellow-600" size={20} />
                  <div>
                    <p className="font-medium text-yellow-800">Selection Mode Active</p>
                    <p className="text-sm text-yellow-600">
                      {selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} selected
                      {selectedProjects.length > 0 && ' - Ready for export'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSelectAll}
                    className="text-sm text-yellow-700 hover:text-yellow-800"
                  >
                    {selectAll ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={toggleSelectionMode}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    Cancel Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters Section - Updated with selection toggle */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
              >
                <option value="all">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>

              <button
                onClick={toggleSelectionMode}
                className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-colors ${selectionMode
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {selectionMode ? <CheckSquare size={18} /> : <Square size={18} />}
                Select
              </button>

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  disabled={exportLoading || filteredProjects.length === 0}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Export
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>

                {showExportDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowExportDropdown(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                          {selectedProjects.length > 0
                            ? `Export ${selectedProjects.length} selected`
                            : 'Export all filtered'}
                        </div>
                        <button
                          onClick={() => handleExport('excel')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <FileSpreadsheet size={18} className="text-green-600" />
                          <div>
                            <div className="font-medium text-gray-900">Excel (.xlsx)</div>
                            <div className="text-xs text-gray-500">Spreadsheet format</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleExport('csv')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <FileTextIcon size={18} className="text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">CSV (.csv)</div>
                            <div className="text-xs text-gray-500">Comma separated values</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleExport('pdf')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <FileType size={18} className="text-red-600" />
                          <div>
                            <div className="font-medium text-gray-900">PDF (.pdf)</div>
                            <div className="text-xs text-gray-500">Printable document</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleExport('json')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <FileText size={18} className="text-purple-600" />
                          <div>
                            <div className="font-medium text-gray-900">JSON (.json)</div>
                            <div className="text-xs text-gray-500">Raw data format</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Export info */}
            <div className="mt-3 text-sm text-gray-900 flex items-center gap-2">
              <CheckCircle size={14} className="text-gray-500" />
              {selectedProjects.length > 0 ? (
                <>
                  <span className="text-blue-600 font-medium">{selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} selected</span>
                  <span className="text-gray-400">•</span>
                  <span>Click export to download selected projects</span>
                </>
              ) : (
                <>
                  <span>Ready to export {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</span>
                  <span className="text-gray-400">•</span>
                  <span>Click "Select" to choose specific projects</span>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <FolderGit2 className="text-blue-600" size={20} />
                <span className="text-xs text-gray-500">Total Projects</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-green-600" size={20} />
                <span className="text-xs text-gray-500">Avg. Progress</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgProgress.toFixed(0)}%</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Target className="text-purple-600" size={20} />
                <span className="text-xs text-gray-500">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <BarChart className="text-orange-600" size={20} />
                <span className="text-xs text-gray-500">Total Budget</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalBudget.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.length === 0 ? (
              <div className="col-span-2 bg-white rounded-xl p-12 text-center border border-gray-100">
                <FolderGit2 className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No projects found</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-900 text-white cursor-pointer rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow relative ${selectedProjects.includes(project.id)
                      ? 'border-blue-300 ring-2 ring-blue-100'
                      : 'border-gray-100'
                    }`}
                >
                  {/* Selection checkbox */}
                  {selectionMode && (
                    <div className="absolute top-4 left-4 z-10">
                      <button
                        onClick={() => toggleProjectSelection(project.id)}
                        className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedProjects.includes(project.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white border-gray-300 hover:border-blue-400'
                          }`}
                      >
                        {selectedProjects.includes(project.id) && (
                          <CheckSquare size={14} className="text-white" />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg truncate">{project.name}</h3>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} />
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target size={14} />
                        <span>End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>

                    {project.client && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                        <UsersIcon size={14} />
                        <span className="truncate">Client: {project.client.firstName} {project.client.lastName}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FileText size={14} />
                          <span>{project._count?.tasks || 0} tasks</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users size={14} />
                          <span>{project._count?.members || 0} members</span>
                        </div>
                      </div>
                      {!selectionMode && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/admin/projects/${project.id}`)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/admin/projects/${project.id}/edit`)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Project"
                          >
                            <Edit size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  placeholder="Project description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client *
                  </label>
                  <select
                    required
                    value={newProject.clientId}
                    onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.firstName} {client.lastName} ({client.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Manager *
                  </label>
                  <select
                    required
                    value={newProject.projectManagerId}
                    onChange={(e) => setNewProject({ ...newProject, projectManagerId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  >
                    <option value="">Select Manager</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.firstName} {manager.lastName} ({manager.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                >
                  <option value="PLANNING">Planning</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
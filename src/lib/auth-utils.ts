

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'DEVELOPER' | 'CLIENT';
  isApproved?: boolean;
  canApproveUsers?: boolean;
  canDeleteUsers?: boolean;
  canManageProjects?: boolean;
  canAssignTasks?: boolean;
  canViewAllProjects?: boolean;
}

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUser();
};

export const isSuperAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'SUPER_ADMIN';
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
};

export const isDeveloper = (): boolean => {
  const user = getUser();
  return user?.role === 'DEVELOPER';
};

export const isClient = (): boolean => {
  const user = getUser();
  return user?.role === 'CLIENT';
};

export const hasPermission = (permission: keyof User): boolean => {
  const user = getUser();
  if (!user) return false;
  
  // Super admin has all permissions
  if (user.role === 'SUPER_ADMIN') return true;
  
  return user[permission] === true;
};

export const getDashboardRoute = (role?: string): string => {
  const userRole = role || getUser()?.role;
  
  switch (userRole) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return '/dashboard/admin';
    case 'DEVELOPER':
      return '/dashboard/developer';
    case 'CLIENT':
      return '/dashboard/client';
    default:
      return '/dashboard';
  }
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Check if user can perform admin actions
export const canApproveUsers = (): boolean => hasPermission('canApproveUsers');
export const canDeleteUsers = (): boolean => hasPermission('canDeleteUsers');
export const canManageProjects = (): boolean => hasPermission('canManageProjects');
export const canAssignTasks = (): boolean => hasPermission('canAssignTasks');
export const canViewAllProjects = (): boolean => hasPermission('canViewAllProjects');
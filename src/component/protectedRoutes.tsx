'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, getDashboardRoute } from '@/lib/auth-utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requirePermission?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  requirePermission 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      const user = getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check role-based access
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          // Redirect to their appropriate dashboard
          router.push(getDashboardRoute(user.role));
          return;
        }
      }

      // Check specific permission
      if (requirePermission) {
        // Super admin always has permission
        if (user.role !== 'SUPER_ADMIN') {
          if (!user[requirePermission as keyof typeof user]) {
            router.push(getDashboardRoute(user.role));
            return;
          }
        }
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles, requirePermission]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

// Usage examples:
// 
// Admin only:
// <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
//   <AdminDashboard />
// </ProtectedRoute>
//
// Super admin only:
// <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
//   <SuperAdminSettings />
// </ProtectedRoute>
//
// With specific permission:
// <ProtectedRoute 
//   allowedRoles={['ADMIN', 'SUPER_ADMIN']} 
//   requirePermission="canDeleteUsers"
// >
//   <UserManagement />
// </ProtectedRoute>
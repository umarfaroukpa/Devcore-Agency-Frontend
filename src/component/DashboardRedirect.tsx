// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../hooks/useAuth';

// export default function DashboardRedirect() {
//   const router = useRouter();
//   const { user, isAuthenticated, loading } = useAuth();

//   useEffect(() => {
//     if (!loading && isAuthenticated && user) {
//       switch (user.role) {
//         case 'SUPER_ADMIN':
//         case 'ADMIN':
//           router.push('/dashboard/admin');
//           break;
//         case 'DEVELOPER':
//           router.push('/dashboard/developer');
//           break;
//         case 'CLIENT':
//           router.push('/dashboard/client');
//           break;
//         default:
//           router.push('/');
//       }
//     }
//   }, [loading, isAuthenticated, user, router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//     </div>
//   );
// }
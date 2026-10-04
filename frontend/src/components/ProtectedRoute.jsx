import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-xs text-[#78716c]">
        Memeriksa sesi otentikasi...
      </div>
    );
  }

  // Belum login -> redirect ke /login dengan membawa target path
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika ada pembatasan role dan role user tidak sesuai -> redirect ke /jobs
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
    return <Navigate to="/jobs" replace />;
  }

  return children;
}

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/store';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication.
 * Redirects unauthenticated users to home page.
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuthStore();

  // If not authenticated, redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required, check if user has it
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;

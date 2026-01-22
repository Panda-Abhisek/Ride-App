import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../api/auth.api.jsx';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Checking access...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = user?.roles || [];
    console.log("User Roles in Protected Route - ", userRoles);
    
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    console.log("hasRequiredRole in Protected Route - ", hasRequiredRole);

    if (!hasRequiredRole) {
      return <div>Unauthorized access</div>;
    }
  }

  return children;
};

export default ProtectedRoute;
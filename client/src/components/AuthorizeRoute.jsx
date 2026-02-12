// -----------------------------
// File: src/components/AuthorizeRoute.jsx
// -----------------------------

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Props:
 * - children: React node
 * - allowedRoles: array of roles (strings) allowed to view the route. If empty -> any authenticated user allowed.
 */
const AuthorizeRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, initialized, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!initialized || loading) return <div>Chargement...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles || allowedRoles.length === 0) return children;

  // normalize user roles
  const userRoles = new Set();
  if (Array.isArray(user?.roles)) user.roles.forEach(r => userRoles.add(String(r)));
  if (user?.role) userRoles.add(String(user.role));
  if (user?.isAdmin) userRoles.add('admin');

  const allowed = allowedRoles.some(r => userRoles.has(String(r)));

  if (!allowed) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthorizeRoute;



import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  const savedUserStr = localStorage.getItem('lms_current_user');
  const token = localStorage.getItem('token') || localStorage.getItem('lms_token');

  let activeUser = currentUser;
  if (!activeUser && savedUserStr) {
    try {
      activeUser = JSON.parse(savedUserStr);
    } catch (_) {
      activeUser = null;
    }
  }

  if (!activeUser || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = (activeUser.role || '').toUpperCase();

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
    const isAllowed = normalizedAllowed.includes(userRole);

    if (!isAllowed) {
      if (userRole === 'SUPER_ADMIN') return <Navigate to="/superadmin" replace />;
      if (['INSTITUTE_ADMIN', 'DEAN'].includes(userRole)) return <Navigate to="/institute" replace />;
      if (['INSTRUCTOR', 'FACULTY'].includes(userRole)) return <Navigate to="/instructor" replace />;
      if (userRole === 'CORPORATE_ADMIN') return <Navigate to="/corporate/admin" replace />;
      if (userRole === 'HR_ADMIN') return <Navigate to="/corporate/hr" replace />;
      if (userRole === 'TRAINER') return <Navigate to="/trainer" replace />;
      if (userRole === 'EMPLOYEE') return <Navigate to="/employee" replace />;
      if (['LEARNER', 'STUDENT'].includes(userRole)) return <Navigate to="/learner" replace />;
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

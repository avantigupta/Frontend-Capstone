import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (!allowedRoles.includes(role)) {
    if (role === 'admin') {
      return <Navigate to="/dashboard" replace />;
    } else if (role === 'user') {
      return <Navigate to="/userPage" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  return <Outlet />;
};

export default ProtectedRoutes;

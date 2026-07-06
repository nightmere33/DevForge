import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
  requireDeveloper?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, requireDeveloper = false }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="py-32 text-center text-slate-400">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requireDeveloper && user.role !== 'developer') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;

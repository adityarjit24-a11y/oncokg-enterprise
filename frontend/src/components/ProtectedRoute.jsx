import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Result, Button } from 'antd';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // Handled by a global fallback or loader
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // RBAC Validation
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a' }}>
        <Result
          status="403"
          title={<span style={{ color: '#fff' }}>403 Forbidden</span>}
          subTitle={<span style={{ color: '#aaa' }}>Your assigned role ({user.role}) lacks clearance for this module.</span>}
          extra={<Button type="primary" href="/">Return to Dashboard</Button>}
        />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
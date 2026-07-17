import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  const antIcon = <LoadingOutlined style={{ fontSize: 48, color: '#00B5AD' }} spin />;

  // 1. Jab tak token aur state check ho rahi hai, ek smooth spinner dikhao
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a' }}>
        <Spin indicator={antIcon} />
      </div>
    );
  }

  // 2. Agar user login nahi hai, toh wapas Login page par dhakel do
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Agar user verified hai, toh page load hone do
  return <Outlet />;
};

export default ProtectedRoute;
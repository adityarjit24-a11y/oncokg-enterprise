import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: '24px',
            padding: 24,
            minHeight: 280,
            background: token.colorBgBase,
            borderRadius: token.borderRadiusLG,
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
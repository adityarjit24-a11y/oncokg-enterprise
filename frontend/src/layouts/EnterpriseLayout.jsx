// src/layouts/EnterpriseLayout.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Modal, Button, Avatar, Space, Badge, Tooltip, Typography, Dropdown, message } from 'antd';
import { 
  SearchOutlined, 
  AppstoreOutlined, 
  ShareAltOutlined, 
  RobotOutlined,
  BellOutlined,
  SettingOutlined,
  BookOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  UserOutlined,
  AreaChartOutlined,
  GoldOutlined,
  BugOutlined,
  FileTextOutlined,
  TeamOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import '../styles/glassmorphism.css'; 

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const EnterpriseLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ⌨️ Command Palette Engine (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🔔 FIX 1: Notification Click Handler
  const handleNotificationClick = () => {
    message.info({
      content: 'System is up to date. No new alerts.',
      style: { marginTop: '8vh' },
    });
  };

  // 🚪 FIX 2: Sign Out Logic
  const handleLogout = () => {
    // Clear all authentication tokens from local/session storage
    localStorage.clear();
    sessionStorage.clear();
    message.success('Signed out successfully.');
    
    // Force a hard redirect to login page to clear all React states
    window.location.href = '/login'; 
  };

  // 👤 FIX 3: Dropdown Menu Items for Profile Avatar
  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'My Profile' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Preferences', onClick: () => navigate('/system') },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Sign Out', danger: true, onClick: handleLogout },
  ];

  const menuItems = [
    { key: '/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { key: '/analytics', icon: <AreaChartOutlined />, label: 'Analytics' },
    { key: '/graph', icon: <ShareAltOutlined />, label: 'Knowledge Graph' },
    { key: '/simulation', icon: <ExperimentOutlined />, label: 'Simulation Lab' },
    { type: 'divider' },
    { key: '/drugs', icon: <DatabaseOutlined />, label: 'Drug Explorer' },
    { key: '/genes', icon: <GoldOutlined />, label: 'Gene Explorer' },
    { key: '/mutations', icon: <BugOutlined />, label: 'Mutation Explorer' },
    { key: '/trials', icon: <BookOutlined />, label: 'Clinical Trials' },
    { key: '/publications', icon: <FileTextOutlined />, label: 'Publications' },
    { type: 'divider' },
    { key: '/workspace/team', icon: <TeamOutlined />, label: 'Team Workspace' },
    { key: '/system', icon: <SettingOutlined />, label: 'System Settings' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#0d1117' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        width={260}
        style={{ borderRight: '1px solid #30363d', background: '#0d1117' }}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #30363d' }}>
          <Text strong style={{ color: '#fff', fontSize: collapsed ? '12px' : '18px', transition: 'all 0.3s' }}>
            {collapsed ? 'O.KG' : 'OncoKG Enterprise'}
          </Text>
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems} 
          onClick={({ key }) => navigate(key)}
          style={{ padding: '12px 8px', borderRight: 0 }}
        />
      </Sider>

      <Layout style={{ background: 'transparent' }}>
        <Header 
          style={{ 
            padding: '0 24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'rgba(13, 17, 23, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid #30363d',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          <div 
            onClick={() => setCmdOpen(true)}
            style={{
              background: '#161b22', border: '1px solid #30363d', borderRadius: '6px',
              padding: '4px 12px', display: 'flex', alignItems: 'center',
              width: '300px', cursor: 'text', color: '#8b949e', transition: 'border-color 0.2s'
            }}
            className="hover-border-primary"
          >
            <SearchOutlined style={{ marginRight: '8px' }} />
            <span style={{ flex: 1 }}>Search entities, graphs...</span>
            <span style={{ background: '#30363d', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl + K</span>
          </div>

          <Space size="large">
            <Badge dot>
              {/* ✅ ADDED onClick to Bell */}
              <BellOutlined onClick={handleNotificationClick} style={{ fontSize: '18px', color: '#c9d1d9', cursor: 'pointer' }} />
            </Badge>
            
            {/* ✅ WRAPPED Avatar inside Dropdown */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" style={{ cursor: 'pointer', border: '1px solid #30363d' }} />
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: '24px', position: 'relative', overflowY: 'auto' }}>
          <div className="fade-in-up">
            <Outlet />
          </div>
        </Content>
      </Layout>

      <Tooltip title="Ask OncoAI" placement="left">
        <Button 
          type="primary" 
          shape="circle" 
          icon={<RobotOutlined style={{ fontSize: '24px' }} />} 
          size="large"
          style={{
            position: 'fixed', bottom: '32px', right: '32px',
            width: '60px', height: '60px', boxShadow: '0 8px 24px rgba(94, 106, 210, 0.4)', zIndex: 1000
          }}
          onClick={() => navigate('/ai')}
        />
      </Tooltip>

      <Modal
        open={cmdOpen}
        onCancel={() => setCmdOpen(false)}
        footer={null}
        closable={false}
        width={600}
        style={{ top: 100 }}
        bodyStyle={{ padding: 0, background: '#161b22', borderRadius: '8px', border: '1px solid #30363d' }}
        maskStyle={{ backdropFilter: 'blur(4px)' }}
      >
        <Input 
          size="large" 
          placeholder="Type a command or search..." 
          prefix={<SearchOutlined style={{ color: '#8b949e', fontSize: '20px' }}/>}
          style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #30363d', padding: '16px', color: '#fff', fontSize: '18px', boxShadow: 'none' }}
          autoFocus
        />
        <div style={{ padding: '16px', color: '#8b949e', minHeight: '200px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent</p>
          <div style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', color: '#c9d1d9' }} className="cmd-item-hover">
            <ShareAltOutlined style={{ marginRight: '12px' }}/> View EGFR Knowledge Graph
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default EnterpriseLayout;
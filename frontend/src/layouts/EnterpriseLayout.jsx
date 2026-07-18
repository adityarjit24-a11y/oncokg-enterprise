// src/layouts/EnterpriseLayout.jsx
import React, { useState, useEffect } from 'react';
// ✅ FIX 1: Added Typography to this import list
import { Layout, Menu, Input, Modal, Button, Avatar, Dropdown, Space, Badge, Tooltip, Typography } from 'antd';
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
  UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/glassmorphism.css'; 

const { Header, Sider, Content } = Layout;
// ✅ FIX 2: Added this exact line to prevent the 'Text' DOM error
const { Text } = Typography;

const EnterpriseLayout = ({ children }) => {
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

  const menuItems = [
    { key: '/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { key: '/graph', icon: <ShareAltOutlined />, label: 'Knowledge Graph' },
    { key: '/simulation', icon: <ExperimentOutlined />, label: 'Simulation Lab' },
    { type: 'divider' },
    { key: '/explorers/drugs', icon: <DatabaseOutlined />, label: 'Drug Explorer' },
    { key: '/explorers/trials', icon: <BookOutlined />, label: 'Clinical Trials' },
    { type: 'divider' },
    { key: '/workspace/team', icon: <UserOutlined />, label: 'Team Workspace' },
    { key: '/settings', icon: <SettingOutlined />, label: 'System Settings' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#0d1117' }}>
      {/* 🧭 Modern Collapsible Sidebar */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        width={260}
        style={{
          borderRight: '1px solid #30363d',
          background: '#0d1117'
        }}
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
        {/* 🪟 Glassmorphism Header */}
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
          {/* Global Omnibox Trigger */}
          <div 
            onClick={() => setCmdOpen(true)}
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '6px',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              width: '300px',
              cursor: 'text',
              color: '#8b949e',
              transition: 'border-color 0.2s'
            }}
            className="hover-border-primary"
          >
            <SearchOutlined style={{ marginRight: '8px' }} />
            <span style={{ flex: 1 }}>Search entities, graphs...</span>
            <span style={{ background: '#30363d', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl + K</span>
          </div>

          <Space size="large">
            <Badge dot>
              <BellOutlined style={{ fontSize: '18px', color: '#c9d1d9', cursor: 'pointer' }} />
            </Badge>
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" style={{ cursor: 'pointer', border: '1px solid #30363d' }} />
          </Space>
        </Header>

        {/* 📄 Content Area with Smooth Transitions */}
        <Content style={{ padding: '24px', position: 'relative', overflowY: 'auto' }}>
          <div className="fade-in-up">
            {children}
          </div>
        </Content>
      </Layout>

      {/* 🤖 Floating AI Assistant */}
      <Tooltip title="Ask OncoAI (Ctrl + /)" placement="left">
        <Button 
          type="primary" 
          shape="circle" 
          icon={<RobotOutlined style={{ fontSize: '24px' }} />} 
          size="large"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '60px',
            height: '60px',
            boxShadow: '0 8px 24px rgba(94, 106, 210, 0.4)',
            zIndex: 1000
          }}
          onClick={() => navigate('/ai-assistant')}
        />
      </Tooltip>

      {/* ⌨️ Command Palette Modal */}
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
          <div style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', color: '#c9d1d9' }} className="cmd-item-hover">
            <ExperimentOutlined style={{ marginRight: '12px' }}/> Run Simulation: Osimertinib
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default EnterpriseLayout;
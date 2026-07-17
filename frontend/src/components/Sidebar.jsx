import React from 'react';
import { Layout, Menu, Typography, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  ShareAltOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  NodeIndexOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  RobotOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

 // Inside src/components/Sidebar.jsx, update the menuItems array:

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/graph', icon: <ShareAltOutlined />, label: 'Knowledge Graph' },
    { key: '/ai', icon: <RobotOutlined />, label: 'AI Assistant' },
    { key: '/simulation', icon: <ExperimentOutlined />, label: 'Simulation Lab' },
    // ... (Keep existing Explorers and Clinical groups) ...
    { key: '/system', icon: <SettingOutlined />, label: 'System & Admin' },
// ... rest remains unchanged
    // In src/components/Sidebar.jsx, update your menuItems:

    {
      type: 'group',
      label: collapsed ? '' : 'EXPLORERS',
      children: [
        { key: '/drugs', icon: <MedicineBoxOutlined />, label: 'Drug Explorer' },
        { key: '/genes', icon: <NodeIndexOutlined />, label: 'Gene Explorer' },
        { key: '/mutations', icon: <ExperimentOutlined />, label: 'Mutation Explorer' },
      ]
    },
    {
      type: 'group',
      label: collapsed ? '' : 'CLINICAL & LITERARY',
      children: [
        { key: '/trials', icon: <FileTextOutlined />, label: 'Clinical Trials' },
        { key: '/publications', icon: <FileTextOutlined />, label: 'Publications' },
        { key: '/analytics', icon: <BarChartOutlined />, label: 'Analytics',  }, // Keep Analytics disabled for now
      ]
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
      style={{
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 10,
      }}
    >
      <div style={{ padding: '16px', textAlign: 'center', transition: 'all 0.3s', overflow: 'hidden' }}>
        <Title level={4} style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap' }}>
          {collapsed ? 'KG' : 'OncoKG'}
        </Title>
        {!collapsed && <Tag color="cyan" style={{ marginTop: 4 }}>Enterprise v1.0</Tag>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
import React from 'react';
import { Layout, Input, Button, Dropdown, Space, Avatar, Tag, theme } from 'antd';
import {
  SearchOutlined,
  BulbOutlined,
  BulbFilled,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { Header } = Layout;

const Navbar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { token } = theme.useToken();

  const userMenu = {
    items: [
      {
        key: 'role',
        label: <Tag color="blue">{user?.role || 'Guest'}</Tag>,
        disabled: true,
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Sign Out',
        onClick: logout,
        danger: true,
      },
    ],
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        background: token.colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        position: 'sticky',
        top: 0,
        zIndex: 9,
      }}
    >
      <Space size="large">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: '16px', width: 64, height: 64 }}
        />
        <Input
          placeholder="Global Omni-Search (e.g., EGFR, Erlotinib, NCT034560)..."
          prefix={<SearchOutlined style={{ color: token.colorTextDisabled }} />}
          style={{ width: 380 }}
          allowClear
        />
      </Space>

      <Space size="middle">
        <Button
          type="text"
          icon={isDarkMode ? <BulbFilled style={{ color: '#FAAD14' }} /> : <BulbOutlined />}
          onClick={toggleTheme}
          title="Toggle Theme"
        />
        <Dropdown menu={userMenu} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar style={{ backgroundColor: token.colorPrimary }} icon={<UserOutlined />} />
            <span style={{ fontWeight: 500, color: token.colorText }}>{user?.name || 'Researcher'}</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default Navbar;
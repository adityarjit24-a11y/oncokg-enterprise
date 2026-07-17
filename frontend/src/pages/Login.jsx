import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, Alert, theme, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Humara configured Axios instance

const { Title, Text } = Typography;
const { Option } = Select;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      // FIX: URL se '/api/v1' hata diya kyunki baseURL mein wo already include hai.
      // Sahi URL banega: https://oncokg-enterprise-production.up.railway.app/api/v1/auth/login
      const response = await api.post('/auth/login', { 
        email: values.email, 
        password: values.password,
        role: values.role
      });
      
      // 2. Notify user and update AuthContext
      message.success(`Welcome back, ${response.data.user.name}`);
      login(response.data.user.email, response.data.user.role);
      
      // 3. Redirect to dashboard
      // Laga do
navigate('/');
      
    } catch (err) {
      // 4. Robust Error Handling
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials. Please verify your email and password.');
      } else {
        setError('System error. Could not connect to the authentication server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#001529',
        padding: '24px'
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          borderRadius: 8,
          background: token.colorBgContainer
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SafetyCertificateOutlined style={{ fontSize: 48, color: '#00B5AD' }} />
          <Title level={3} style={{ margin: '12px 0 4px' }}>OncoKG Enterprise</Title>
          <Text type="secondary">Biomedical Knowledge Graph & Analytics Platform</Text>
        </div>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form
          name="enterprise_login"
          initialValues={{ email: 'researcher@pharma-enterprise.com', role: 'Researcher' }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your institutional email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Institutional Email" disabled={loading} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" disabled={loading} />
          </Form.Item>

          <Form.Item name="role" label="Access Role">
            <Select disabled={loading}>
              <Option value="Researcher">Researcher / Bioinformatician</Option>
              <Option value="Director">Strategy Director</Option>
              <Option value="Admin">System Administrator</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#00B5AD' }}>
              Authenticate to Workspace
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
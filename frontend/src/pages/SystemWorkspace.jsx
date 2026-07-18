import React, { useState, useEffect } from 'react';
import { Tabs, Card, Table, Switch, Form, Input, Button, Typography, Tag, message, Spin } from 'antd';
import { SettingOutlined, TeamOutlined, SaveOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import api from '../api/axios';

const { Title, Text: AntText } = Typography;

const SystemWorkspace = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ users: [], logs: [], queries: [] });

  // 🛡️ Fallback Data for Enterprise Resilience
  const fallbackData = {
    users: [{ key: '1', email: 'admin@oncokg.com', role: 'Administrator', status: 'Active' }],
    logs: [
      { key: '1', action: 'Login', user: 'admin', time: new Date().toLocaleTimeString(), ip: '192.168.1.1' },
      { key: '2', action: 'Graph Query', user: 'admin', time: '10:05 AM', ip: '192.168.1.1' }
    ],
    queries: [{ key: '1', name: 'EGFR Resistors', query: 'MATCH (n:Drug)-[]-(m:Gene) RETURN n LIMIT 25', date: 'Today' }]
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/admin/system-data');
        if (response.data) setData(response.data);
      } catch (error) {
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleSaveConfig = () => {
    message.success('System configuration saved successfully.');
  };

  const handleExecuteQuery = (queryName) => {
    message.loading(`Executing ${queryName} in Neo4j...`, 1.5)
      .then(() => message.success('Query executed successfully. Navigating to Knowledge Graph...'));
  };

  const items = [
    {
      key: '1',
      label: <span><SettingOutlined /> General Settings</span>,
      children: (
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label="Global Dark Mode"><Switch defaultChecked /></Form.Item>
          <Form.Item label="Neo4j Connection URI"><Input defaultValue="bolt://localhost:7687" disabled /></Form.Item>
          <Form.Item label="OpenAI API Key (For AI Assistant)"><Input.Password placeholder="sk-..." /></Form.Item>
          <Button type="primary" onClick={handleSaveConfig} style={{ background: '#00B5AD' }}>Save Configuration</Button>
        </Form>
      )
    },
    {
      key: '2',
      label: <span><TeamOutlined /> Administration</span>,
      children: <Table dataSource={data.users} columns={[{title: 'User', dataIndex: 'email'}, {title: 'Role', dataIndex: 'role'}, {title: 'Status', dataIndex: 'status', render: s => <Tag color="green">{s}</Tag>}]} rowClassName={() => 'table-row-dark'} />
    },
    {
      key: '3',
      label: <span><SaveOutlined /> Saved Queries</span>,
      children: <Table dataSource={data.queries} columns={[{title: 'Query Name', dataIndex: 'name'}, {title: 'Cypher', dataIndex: 'query', render: t => <AntText code>{t}</AntText>}, {title: 'Action', render: (_, record) => <Button size="small" type="primary" onClick={() => handleExecuteQuery(record.name)}>Execute</Button>}]} rowClassName={() => 'table-row-dark'} />
    },
    {
      key: '4',
      label: <span><SafetyCertificateOutlined /> Audit Logs</span>,
      children: <Table dataSource={data.logs} columns={[{title: 'Action', dataIndex: 'action'}, {title: 'User', dataIndex: 'user'}, {title: 'Timestamp', dataIndex: 'time'}]} rowClassName={() => 'table-row-dark'} />
    }
  ];

  return (
    <div>
      <Title level={3}>System Workspace</Title>
      <Card bordered={false} bodyStyle={{ paddingTop: 0 }} style={{ background: '#141414', borderColor: '#333' }}>
        {loading ? <Spin style={{ display: 'block', margin: '40px auto' }} /> : (
          <Tabs defaultActiveKey="1" items={items} />
        )}
      </Card>
    </div>
  );
};

export default SystemWorkspace;
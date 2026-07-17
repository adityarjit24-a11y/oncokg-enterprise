import React from 'react';
import { Tabs, Card, Table, Switch, Form, Input, Button, Typography, Tag } from 'antd';
import { SettingOutlined, TeamOutlined, SaveOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SystemWorkspace = () => {
  const users = [{ key: '1', email: 'admin@oncokg.com', role: 'Administrator', status: 'Active' }];
  const logs = [{ key: '1', action: 'Login', user: 'admin', time: '10:00 AM', ip: '192.168.1.1' }];
  const queries = [{ key: '1', name: 'EGFR Resistors', query: 'MATCH (n:Drug)-[]-(m:Gene) RETURN n', date: 'Today' }];

  const items = [
    {
      key: '1',
      label: <span><SettingOutlined /> General Settings</span>,
      children: (
        <Form layout="vertical">
          <Form.Item label="Global Dark Mode"><Switch defaultChecked /></Form.Item>
          <Form.Item label="Neo4j Connection URI"><Input defaultValue="bolt://localhost:7687" disabled /></Form.Item>
          <Button type="primary">Save Configuration</Button>
        </Form>
      )
    },
    {
      key: '2',
      label: <span><TeamOutlined /> Administration</span>,
      children: <Table dataSource={users} columns={[{title: 'User', dataIndex: 'email'}, {title: 'Role', dataIndex: 'role'}, {title: 'Status', dataIndex: 'status', render: s => <Tag color="green">{s}</Tag>}]} />
    },
    {
      key: '3',
      label: <span><SaveOutlined /> Saved Queries</span>,
      children: <Table dataSource={queries} columns={[{title: 'Query Name', dataIndex: 'name'}, {title: 'Cypher', dataIndex: 'query', render: t => <Text code>{t}</Text>}, {title: 'Action', render: () => <Button size="small">Execute</Button>}]} />
    },
    {
      key: '4',
      label: <span><SafetyCertificateOutlined /> Audit Logs</span>,
      children: <Table dataSource={logs} columns={[{title: 'Action', dataIndex: 'action'}, {title: 'User', dataIndex: 'user'}, {title: 'Timestamp', dataIndex: 'time'}]} />
    }
  ];

  return (
    <div>
      <Title level={3}>System Workspace</Title>
      <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default SystemWorkspace;
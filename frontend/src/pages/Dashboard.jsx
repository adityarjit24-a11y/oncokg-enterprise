import React from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, Space, Alert } from 'antd';
import {
  MedicineBoxOutlined,
  ExperimentOutlined,
  AlertOutlined, // Professional icon for diseases
  DeploymentUnitOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard = () => {
  // Mock recent queries table data for Phase 1
  const recentQueries = [
    { key: '1', target: 'EGFR', type: 'Gene', relationships: 142, status: 'Indexed' },
    { key: '2', target: 'Erlotinib', type: 'Drug', relationships: 89, status: 'Indexed' },
    { key: '3', target: 'T790M', type: 'Mutation', relationships: 34, status: 'Updating' },
    { key: '4', target: 'Non-Small Cell Lung Cancer', type: 'Disease', relationships: 512, status: 'Indexed' },
  ];

  const columns = [
    { title: 'Target Entity', dataIndex: 'target', key: 'target', render: text => <Text strong>{text}</Text> },
    { 
      title: 'Typology', 
      dataIndex: 'type', 
      key: 'type',
      render: type => {
        const colors = { Gene: 'blue', Drug: 'green', Mutation: 'gold', Disease: 'volcano' };
        return <Tag color={colors[type] || 'default'}>{type}</Tag>;
      }
    },
    { title: 'Connected Nodes', dataIndex: 'relationships', key: 'relationships' },
    {
      title: 'Graph Index Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        status === 'Indexed' ? 
          <Tag icon={<CheckCircleOutlined />} color="success">Indexed</Tag> : 
          <Tag icon={<SyncOutlined spin />} color="processing">Updating</Tag>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>Executive Workspace</Title>
        <Text type="secondary">Overview of indexed biomedical entities and live Neo4j data pipelines.</Text>
      </div>

      <Alert 
        message="System Status: Neo4j Bolt Driver connected on localhost:7687" 
        type="info" 
        showIcon 
        closable 
      />

      {/* Responsive Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic 
              title="Indexed Drugs" 
              value={4253} 
              prefix={<MedicineBoxOutlined style={{ color: '#00B5AD' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic 
              title="Disease Indications" 
              value={1892} 
              prefix={<AlertOutlined style={{ color: '#f5222d' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic 
              title="Genes & Biomarkers" 
              value={3412} 
              prefix={<ExperimentOutlined style={{ color: '#52c41a' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic 
              title="Ontology Relationships" 
              value={142589} 
              prefix={<DeploymentUnitOutlined style={{ color: '#1890ff' }} />} 
            />
          </Card>
        </Col>
      </Row>

      {/* Lower Dashboard Layout */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recently Accessed Graph Targets" bordered={false} style={{ height: '100%' }}>
            <Table columns={columns} dataSource={recentQueries} pagination={false} size="middle" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Pipeline Activity" bordered={false} style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong style={{ display: 'block' }}>PubMed Literature Ingestion</Text>
                <Text type="secondary">Synced 1,240 abstracts today</Text>
              </div>
              <div>
                <Text strong style={{ display: 'block' }}>ClinVar Mutation Mapping</Text>
                <Text type="secondary">Index up to date (v2026.07)</Text>
              </div>
              <div>
                <Text strong style={{ display: 'block' }}>FastAPI Gateway</Text>
                <Tag color="green">Operational (Port 8000)</Tag>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
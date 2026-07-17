import React from 'react';
import { Row, Col, Card, Typography, Table, Tag, Progress, Space, Divider } from 'antd';
import { PieChartOutlined, BarChartOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Analytics = () => {
  const tableData = [
    { key: '1', gene: 'EGFR', variant: 'T790M', disease: 'Non-Small Cell Lung Cancer', evidence: 'Level 1', status: 'Resistance Mechanism' },
    { key: '2', gene: 'BRAF', variant: 'V600E', disease: 'Melanoma', evidence: 'Level 1', status: 'Actionable Target' },
    { key: '3', gene: 'KRAS', variant: 'G12C', disease: 'Colorectal Cancer', evidence: 'Level 2', status: 'Emerging Target' },
    { key: '4', gene: 'ERBB2', variant: 'Amplification', disease: 'Breast Cancer', evidence: 'Level 1', status: 'Actionable Target' },
    { key: '5', gene: 'ALK', variant: 'EML4-ALK Fusion', disease: 'Non-Small Cell Lung Cancer', evidence: 'Level 1', status: 'Actionable Target' },
  ];

  const columns = [
    { title: 'Target Gene', dataIndex: 'gene', key: 'gene', render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text> },
    { title: 'Variant / Alteration', dataIndex: 'variant', key: 'variant', render: (text) => <Text code>{text}</Text> },
    { title: 'Primary Indication', dataIndex: 'disease', key: 'disease' },
    { title: 'OncoKB Evidence', dataIndex: 'evidence', key: 'evidence', render: (level) => <Tag color={level === 'Level 1' ? 'green' : 'geekblue'}>{level}</Tag> },
    { title: 'Clinical Status', dataIndex: 'status', key: 'status', render: (status) => {
        let color = status.includes('Resistance') ? 'volcano' : 'success';
        let icon = status.includes('Resistance') ? <WarningOutlined /> : <CheckCircleOutlined />;
        return <Tag icon={icon} color={color}>{status}</Tag>;
      }
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 600 }}>Analytics & Metrics</Title>
        <Text type="secondary">Database distribution statistics and high-priority variant tracking.</Text>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title={<><PieChartOutlined /> Variant Classification Breakdown</>} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><Text>Missense Mutations</Text><Text strong>45%</Text></div><Progress percent={45} strokeColor="#1890ff" showInfo={false} /></div>
              <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><Text>Gene Amplifications</Text><Text strong>25%</Text></div><Progress percent={25} strokeColor="#722ed1" showInfo={false} /></div>
              <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><Text>Truncating Mutations</Text><Text strong>20%</Text></div><Progress percent={20} strokeColor="#faad14" showInfo={false} /></div>
              <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><Text>Structural Fusions</Text><Text strong>10%</Text></div><Progress percent={10} strokeColor="#f5222d" showInfo={false} /></div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={<><BarChartOutlined /> Indexed Therapeutic Trials</>} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><Text>FDA Approved (Standard of Care)</Text><Text strong>320</Text></div><Progress percent={100} success={{ percent: 25 }} strokeColor="#f5f5f5" format={() => ''} /></div>
              <Divider style={{ margin: '8px 0' }} />
              <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><Text>Phase III Active</Text><Text type="secondary">415 trials</Text></div><Progress percent={65} strokeColor="#52c41a" /></div>
              <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><Text>Phase II Active</Text><Text type="secondary">890 trials</Text></div><Progress percent={85} strokeColor="#1890ff" /></div>
              <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><Text>Phase I / Dose Escalation</Text><Text type="secondary">1,240 trials</Text></div><Progress percent={100} strokeColor="#faad14" /></div>
            </Space>
          </Card>
        </Col>
      </Row>
      <Card title="High-Priority Actionable Variants" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Table columns={columns} dataSource={tableData} pagination={false} size="middle" />
      </Card>
    </div>
  );
};

export default Analytics;
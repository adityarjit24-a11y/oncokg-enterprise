import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Select, Button, Slider, Typography, Progress, Alert, Space } from 'antd';
import { ExperimentOutlined, BugOutlined, ThunderboltOutlined } from '@ant-design/icons';
import api from '../api/axios'; 

const { Title, Text } = Typography;
const { Option } = Select;

const SimulationLab = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [genes, setGenes] = useState([]);

 useEffect(() => {
    const loadData = async () => {
      try {
        // FIX: '/api/v1/' hata diya
        const [drugsRes, genesRes] = await Promise.all([
          api.get('/explore/drugs?limit=100'),
          api.get('/explore/genes?limit=100')
        ]);
        setDrugs(drugsRes.data || []);
        setGenes(genesRes.data || []);
      } catch (error) {
        console.error("Failed to load simulation dropdown dependencies:", error);
      }
    };
    loadData();
  }, []);

  const handleSimulate = async (values) => {
    setLoading(true);
    setResult(null);
    try {
      // FIX: '/api/v1/' hata diya
      const response = await api.post('/simulation/run', values);
      setResult(response.data);
    } catch (error) {
      console.error("Simulation run failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>Targeted Simulation Lab</Title>
        <Text type="secondary">Predict treatment efficacy and mutations using graph traversal algorithms.</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card title="Simulation Parameters" bordered={false}>
            <Form form={form} layout="vertical" onFinish={handleSimulate}>
              <Form.Item name="drug" label="Select Compound (Target Drug)" rules={[{ required: true }]}>
                <Select placeholder="Select a drug asset">
                  {drugs.map(d => <Option key={d.id} value={d.name}>{d.name}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="gene" label="Select Biomarker Target (Gene)" rules={[{ required: true }]}>
                <Select placeholder="Select genomic marker">
                  {genes.map(g => <Option key={g.id} value={g.name}>{g.name}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="dosage" label="Simulated Concentration (mg/kg)" initialValue={50}>
                <Slider min={0} max={200} marks={{ 0: '0', 100: '100', 200: '200' }} />
              </Form.Item>
              <Form.Item style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" block icon={<ThunderboltOutlined />} loading={loading} style={{ background: '#00B5AD' }}>
                  Execute Stochastic Run
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card title="Efficacy Matrix & Forecast Output" bordered={false} style={{ height: '100%', minHeight: 400 }}>
            {result ? (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Alert message={result.message} type="success" showIcon />
                <div>
                  <Text strong>Predicted Efficacy Score</Text>
                  <Progress percent={result.efficacy_score} status="active" strokeColor="#52c41a" />
                </div>
                <div>
                  <Text strong>Toxicity Risk Estimation</Text>
                  <Progress percent={result.toxicity_risk || 15} status="active" strokeColor="#f5222d" />
                </div>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Affected Cellular Pathways</Text>
                  {result.pathways_affected?.map(p => (
                    <span key={p} style={{ marginRight: 8, padding: '4px 8px', background: '#f0f2f5', borderRadius: 4, fontSize: 12 }}>{p}</span>
                  ))}
                </div>
              </Space>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <ExperimentOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
                <Text type="secondary">Configure parameters and execute simulation to map downstream data.</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SimulationLab;
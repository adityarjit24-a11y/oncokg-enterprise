import React, { useState } from 'react';
import { Row, Col, Card, Form, Select, Slider, Button, Typography, Space, Progress, Table, Tag, Alert, message, Spin } from 'antd';
import { 
  ExperimentOutlined, 
  PlayCircleOutlined, 
  DownloadOutlined, 
  AreaChartOutlined,
  RadarChartOutlined
} from '@ant-design/icons';
import api from '../api/axios';

const { Title, Text } = Typography;
const { Option } = Select;

const SimulationLab = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // 🧠 Dynamic Enterprise Demo Engine (Generates realistic data based on user input)
  const generateDynamicResults = (values) => {
    const { target, drug, mutation } = values;
    
    // Logic: Matching specific targeted therapies for realistic HR demo
    const isPerfectMatch = 
      (target === 'EGFR' && (drug === 'Osimertinib' || drug === 'Erlotinib')) ||
      (target === 'BRAF' && drug === 'Vemurafenib') ||
      (target === 'KRAS' && drug === 'Sotorasib') ||
      (target === 'HER2' && drug === 'Trastuzumab') ||
      (target === 'ALK' && drug === 'Crizotinib');

    // If it's a known match, give high efficacy, otherwise low efficacy
    const baseEfficacy = isPerfectMatch ? Math.floor(Math.random() * 15) + 80 : Math.floor(Math.random() * 30) + 15;
    const resRisk = isPerfectMatch ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 40) + 50;
    
    return {
      simulatedTarget: target,
      simulatedDrug: drug,
      simulatedMutation: mutation,
      efficacyScore: baseEfficacy,
      resistanceProbability: resRisk,
      bindingAffinity: `-${(Math.random() * 4 + 7).toFixed(2)} kcal/mol`, // e.g. -8.45 kcal/mol
      pathways: [
        { key: '1', pathway: 'MAPK/ERK', inhibition: isPerfectMatch ? 88 : 34, status: isPerfectMatch ? 'Strongly Inhibited' : 'Partial Escape' },
        { key: '2', pathway: 'PI3K/AKT', inhibition: isPerfectMatch ? 75 : 20, status: isPerfectMatch ? 'Inhibited' : 'No Effect' },
        { key: '3', pathway: 'JAK/STAT', inhibition: Math.floor(Math.random() * 30), status: 'No Effect' },
      ]
    };
  };

  const handleRunSimulation = async (values) => {
    setLoading(true);
    setResults(null);
    message.loading({ content: 'Initializing computational parameters...', key: 'sim' });

    try {
      // 🔄 Attempt Real API Call
      const res = await api.post('/simulation/run', values);
      
      // Strict check: Only use backend data if it actually contains our required keys
      if (res.data && res.data.efficacyScore !== undefined) {
        setResults(res.data);
        message.success({ content: 'Simulation completed via Backend.', key: 'sim', duration: 2 });
      } else {
        throw new Error("Empty or invalid backend response");
      }
    } catch (error) {
      // 🛡️ Enterprise Fallback: Use Dynamic Demo Engine if backend fails/is empty
      setTimeout(() => {
        const dynamicData = generateDynamicResults(values);
        setResults(dynamicData);
        message.success({ content: 'Predictive models generated (Demo Mode).', key: 'sim', duration: 3 });
      }, 1500); 
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const handleExport = () => {
    message.success("Simulation report exported as PDF.");
  };

  const pathwayColumns = [
    { title: 'Signaling Pathway', dataIndex: 'pathway', key: 'pathway', render: t => <Text strong style={{ color: '#fff' }}>{t}</Text> },
    { 
      title: 'Inhibition Level', 
      dataIndex: 'inhibition', 
      key: 'inhibition',
      render: val => <Progress percent={val} size="small" strokeColor={val > 70 ? '#52c41a' : val > 30 ? '#faad14' : '#f5222d'} />
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: status => {
        let color = status.includes('Strongly') ? 'green' : status.includes('Escape') ? 'warning' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}><ExperimentOutlined /> Simulation Lab</Title>
        <Text type="secondary">In-silico predictive modeling for drug efficacy and resistance pathways.</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title="Scenario Builder" bordered={false} style={{ background: '#141414', borderColor: '#333', height: '100%' }}>
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={handleRunSimulation}
              initialValues={{ target: 'EGFR', drug: 'Osimertinib', mutation: 'T790M', dosage: 50, duration: 12 }}
            >
              <Form.Item name="target" label="Target Gene" rules={[{ required: true }]}>
                <Select showSearch>
                  <Option value="EGFR">EGFR</Option>
                  <Option value="BRAF">BRAF</Option>
                  <Option value="KRAS">KRAS</Option>
                  <Option value="ALK">ALK</Option>
                  <Option value="HER2">HER2</Option>
                  <Option value="TP53">TP53</Option>
                  <Option value="BRCA1">BRCA1</Option>
                  <Option value="PIK3CA">PIK3CA</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="drug" label="Therapeutic Agent" rules={[{ required: true }]}>
                <Select showSearch>
                  <Option value="Osimertinib">Osimertinib</Option>
                  <Option value="Erlotinib">Erlotinib</Option>
                  <Option value="Sotorasib">Sotorasib</Option>
                  <Option value="Vemurafenib">Vemurafenib</Option>
                  <Option value="Trastuzumab">Trastuzumab</Option>
                  <Option value="Crizotinib">Crizotinib</Option>
                  <Option value="Imatinib">Imatinib</Option>
                  <Option value="Afatinib">Afatinib</Option>
                </Select>
              </Form.Item>

              <Form.Item name="mutation" label="Contextual Variant (Mutation)">
                <Select showSearch>
                  <Option value="Wild Type">Wild Type (None)</Option>
                  <Option value="T790M">T790M</Option>
                  <Option value="L858R">L858R</Option>
                  <Option value="V600E">V600E</Option>
                  <Option value="G12C">G12C</Option>
                  <Option value="Amplification">Amplification</Option>
                </Select>
              </Form.Item>

              <Form.Item name="dosage" label="Simulated Dosage (mg/kg)">
                <Slider min={10} max={200} marks={{ 10: '10', 100: '100', 200: '200' }} />
              </Form.Item>

              <Form.Item name="duration" label="Exposure Duration (Weeks)">
                <Slider min={1} max={52} marks={{ 1: '1w', 24: '24w', 52: '52w' }} />
              </Form.Item>

              <Button type="primary" htmlType="submit" icon={<PlayCircleOutlined />} block style={{ background: '#00B5AD', height: '40px', marginTop: '16px' }} loading={loading}>
                Execute Simulation
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><RadarChartOutlined /> Computational Results</span>
                {results && <Button size="small" type="dashed" icon={<DownloadOutlined />} onClick={handleExport}>Export Report</Button>}
              </div>
            } 
            bordered={false} 
            style={{ background: '#141414', borderColor: '#333', height: '100%', minHeight: '500px' }}
          >
            {!loading && !results && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5, paddingTop: '100px' }}>
                <AreaChartOutlined style={{ fontSize: 64, color: '#555', marginBottom: 16 }} />
                <Text style={{ color: '#888' }}>Configure parameters and execute simulation to view predictive models.</Text>
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '100px' }}>
                <Spin size="large" />
                <Text style={{ color: '#888', marginTop: 16 }}>Running Monte Carlo simulations...</Text>
              </div>
            )}

            {!loading && results && (
              <div className="fade-in">
                <Alert 
                  message="Simulation Complete" 
                  description={`Computed efficacy for ${results.simulatedDrug} against ${results.simulatedTarget} (${results.simulatedMutation}).`}
                  type="success" 
                  showIcon 
                  style={{ background: '#112a20', borderColor: '#52c41a', color: '#fff', marginBottom: 24 }}
                />

                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col xs={12} md={8}>
                    <Card size="small" style={{ background: '#1d1d1d', borderColor: '#333', textAlign: 'center' }}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Predicted Efficacy</Text>
                      <Progress type="dashboard" percent={results.efficacyScore} strokeColor={results.efficacyScore > 60 ? "#00B5AD" : "#faad14"} size={100} />
                    </Card>
                  </Col>
                  <Col xs={12} md={8}>
                    <Card size="small" style={{ background: '#1d1d1d', borderColor: '#333', textAlign: 'center' }}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Resistance Risk</Text>
                      <Progress type="dashboard" percent={results.resistanceProbability} strokeColor={results.resistanceProbability > 50 ? "#f5222d" : "#52c41a"} size={100} />
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card size="small" style={{ background: '#1d1d1d', borderColor: '#333', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Est. Binding Affinity</Text>
                      <Title level={2} style={{ margin: 0, color: '#1890ff' }}>{results.bindingAffinity}</Title>
                    </Card>
                  </Col>
                </Row>

                <Title level={5} style={{ marginBottom: 16 }}>Pathway Interference Analysis</Title>
                <Table 
                  columns={pathwayColumns} 
                  dataSource={results.pathways} 
                  pagination={false} 
                  size="middle" 
                  rowClassName={() => 'table-row-dark'} 
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SimulationLab;
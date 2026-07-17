import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Input, Select, Space, Typography, Divider, Button, Switch, Drawer, Descriptions, Tag, Spin, message } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined, NodeIndexOutlined } from '@ant-design/icons';
import ForceGraph2D from 'react-force-graph-2d';

const { Title, Text } = Typography;
const { Option } = Select;

// Production-grade oncology mock data
const mockGraphData = {
  nodes: [
    { id: 'EGFR', label: 'EGFR', type: 'Gene', val: 25, desc: 'Epidermal growth factor receptor', loc: 'Chromosome 7' },
    { id: 'KRAS', label: 'KRAS', type: 'Gene', val: 22, desc: 'Kirsten rat sarcoma virus', loc: 'Chromosome 12' },
    { id: 'Erlotinib', label: 'Erlotinib', type: 'Drug', val: 18, desc: 'Tyrosine kinase inhibitor', status: 'FDA Approved' },
    { id: 'Osimertinib', label: 'Osimertinib', type: 'Drug', val: 18, desc: 'Third-generation EGFR inhibitor', status: 'FDA Approved' },
    { id: 'T790M', label: 'T790M', type: 'Mutation', val: 12, desc: 'Gatekeeper mutation', impact: 'Pathogenic / Resistance' },
    { id: 'G12C', label: 'G12C', type: 'Mutation', val: 12, desc: 'Missense mutation', impact: 'Pathogenic' },
    { id: 'NSCLC', label: 'Non-Small Cell Lung Cancer', type: 'Disease', val: 30, stage: 'Advanced / Metastatic' },
    { id: 'Colorectal', label: 'Colorectal Carcinoma', type: 'Disease', val: 28, stage: 'Stage III/IV' }
  ],
  links: [
    { source: 'Erlotinib', target: 'EGFR', type: 'TARGETS' },
    { source: 'Osimertinib', target: 'EGFR', type: 'TARGETS' },
    { source: 'T790M', target: 'EGFR', type: 'MUTATION_OF' },
    { source: 'G12C', target: 'KRAS', type: 'MUTATION_OF' },
    { source: 'T790M', target: 'Erlotinib', type: 'CONFERS_RESISTANCE' },
    { source: 'Osimertinib', target: 'T790M', type: 'OVERCOMES_RESISTANCE' },
    { source: 'EGFR', target: 'NSCLC', type: 'ASSOCIATED_WITH' },
    { source: 'KRAS', target: 'NSCLC', type: 'ASSOCIATED_WITH' },
    { source: 'KRAS', target: 'Colorectal', type: 'ASSOCIATED_WITH' }
  ]
};

const typeColorMap = {
  Gene: '#1890ff', Drug: '#52c41a', Mutation: '#faad14', Disease: '#f5222d'
};

const GraphExplorer = () => {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeTypes, setSelectedNodeTypes] = useState(['Gene', 'Drug', 'Mutation', 'Disease']);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!graphRef.current) return;
    physicsEnabled ? graphRef.current.d3ReheatSimulation() : graphRef.current.d3StopSimulation();
  }, [physicsEnabled]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const nodes = mockGraphData.nodes.filter(node => {
      const matchesType = selectedNodeTypes.includes(node.type);
      const matchesSearch = !query || node.label.toLowerCase().includes(query) || node.type.toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = mockGraphData.links.filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });
    return { nodes, links };
  }, [searchQuery, selectedNodeTypes]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 800);
      graphRef.current.zoom(4, 800);
    }
  };

  const handleResetFilters = () => {
    messageApi.success('Query matrix reset successfully');
    setSearchQuery('');
    setSelectedNodeTypes(['Gene', 'Drug', 'Mutation', 'Disease']);
    setPhysicsEnabled(true);
    setSelectedNode(null);
    if (graphRef.current) {
      graphRef.current.zoomToFit(800, 50);
    }
  };

  const renderDrawerContent = () => {
    if (!selectedNode) return null;
    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Entity ID">{selectedNode.id}</Descriptions.Item>
          <Descriptions.Item label="Typology">
            <Tag color={typeColorMap[selectedNode.type]}>{selectedNode.type}</Tag>
          </Descriptions.Item>
          {selectedNode.desc && <Descriptions.Item label="Description">{selectedNode.desc}</Descriptions.Item>}
          {selectedNode.loc && <Descriptions.Item label="Locus">{selectedNode.loc}</Descriptions.Item>}
          {selectedNode.status && <Descriptions.Item label="Status"><Tag color="green">{selectedNode.status}</Tag></Descriptions.Item>}
          {selectedNode.impact && <Descriptions.Item label="Impact"><Tag color="red">{selectedNode.impact}</Tag></Descriptions.Item>}
          {selectedNode.stage && <Descriptions.Item label="Stage">{selectedNode.stage}</Descriptions.Item>}
        </Descriptions>
        <div style={{ marginTop: '16px' }}>
          <Button type="primary" icon={<NodeIndexOutlined />} block>
            Expand Network Neighbors
          </Button>
        </div>
      </Space>
    );
  };

  return (
    <div style={{ height: 'calc(100vh - 112px)', display: 'flex', flexDirection: 'column' }}>
      {contextHolder}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 600 }}>Biomedical Graph Explorer</Title>
          <Text type="secondary">Query interconnected oncological nodes and inspect therapeutic pathways.</Text>
        </div>
      </div>
      <Row gutter={[16, 16]} style={{ flex: 1, minHeight: 0 }}>
        <Col xs={24} md={8} lg={6} style={{ height: '100%' }}>
          <Card title={<span style={{ fontWeight: 600 }}><FilterOutlined /> Query Configurations</span>} bordered={false} style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflowY: 'auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8, fontSize: '13px' }}>Target Entity Search</Text>
                <Input placeholder="e.g., EGFR, Erlotinib..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} prefix={<SearchOutlined />} allowClear />
              </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8, fontSize: '13px' }}>Filter Target Typology</Text>
                <Select mode="multiple" allowClear style={{ width: '100%' }} value={selectedNodeTypes} onChange={setSelectedNodeTypes}>
                  <Option value="Gene">Genes (Oncogenes)</Option>
                  <Option value="Drug">Targeted Therapies</Option>
                  <Option value="Mutation">Somatic Mutations</Option>
                  <Option value="Disease">Cancer Indications</Option>
                </Select>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: '13px' }}>Dynamic Physics Simulation</Text>
                <Switch checked={physicsEnabled} onChange={setPhysicsEnabled} size="small" />
              </div>
              <Button type="default" icon={<ReloadOutlined />} onClick={handleResetFilters} block style={{ marginTop: '16px' }}>
                Reset View
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={16} lg={18} style={{ height: '100%', position: 'relative' }}>
          <div ref={containerRef} style={{ height: '100%', background: '#0a192f', borderRadius: '8px', overflow: 'hidden' }}>
            <Spin spinning={loading} tip="Initializing Graph Engine..." style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 20 }}>
              <ForceGraph2D
                ref={graphRef}
                graphData={filteredData}
                width={dimensions.width}
                height={dimensions.height}
                onNodeClick={handleNodeClick}
                backgroundColor="#0a192f"
                linkDirectionalArrowLength={4}
                linkDirectionalArrowRelPos={1}
                linkColor={() => 'rgba(255, 255, 255, 0.15)'}
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const label = node.label;
                  const fontSize = 12 / globalScale;
                  const radius = Math.sqrt(node.val || 10) * 1.5;
                  const color = typeColorMap[node.type] || '#ffffff';
                  const isSelected = selectedNode && selectedNode.id === node.id;
                  const nodeColor = isSelected ? '#ffffff' : color;

                  ctx.beginPath();
                  ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
                  ctx.fillStyle = nodeColor;
                  ctx.fill();

                  ctx.lineWidth = isSelected ? 4 / globalScale : 2 / globalScale;
                  ctx.strokeStyle = isSelected ? color : 'rgba(255,255,255,0.6)';
                  ctx.stroke();

                  ctx.font = `${fontSize}px Inter, sans-serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
                  ctx.fillText(label, node.x, node.y + radius + 3);
                }}
              />
            </Spin>
            <Drawer
              title={<Space><div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: selectedNode ? typeColorMap[selectedNode.type] : '#ccc' }} /><span style={{ fontWeight: 600 }}>{selectedNode?.label} Profile</span></Space>}
              placement="right"
              width={350}
              onClose={() => setSelectedNode(null)}
              open={!!selectedNode}
              mask={false}
              getContainer={false}
              style={{ position: 'absolute' }}
            >
              {renderDrawerContent()}
            </Drawer>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GraphExplorer;
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Card, Input, Select, Space, Button, Switch, Drawer, 
  Descriptions, Tag, Tooltip, message, Row, Col, Typography, Statistic 
} from 'antd';
import { 
  SearchOutlined, DownloadOutlined, ExportOutlined, 
  NodeIndexOutlined, AimOutlined, FilterOutlined 
} from '@ant-design/icons';
import ForceGraph2D from 'react-force-graph-2d';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

// Design System Constants
const NODE_COLORS = {
  Drug: '#52c41a',      // Green
  Gene: '#1890ff',      // Blue
  Disease: '#f5222d',   // Red
  Mutation: '#faad14',  // Amber
  Trial: '#722ed1',     // Purple
  Publication: '#13c2c2',// Cyan
  Unknown: '#8c8c8c'    // Gray
};

const EDGE_COLORS = {
  TARGETS: '#52c41a',
  TREATS: '#f5222d',
  VARIANT_OF: '#faad14',
  CONFERS_RESISTANCE_TO: '#722ed1',
  ASSOCIATED_WITH: '#f5222d',
  STUDIED_IN: '#722ed1',
  DEFAULT: 'rgba(200, 200, 200, 0.4)'
};

// Fallback Mock Data for UI testing without populated DB
const mockData = {
  nodes: [
    { id: '1', name: 'EGFR', type: 'Gene', desc: 'Epidermal growth factor receptor' },
    { id: '2', name: 'Erlotinib', type: 'Drug', desc: 'Tyrosine kinase inhibitor' },
    { id: '3', name: 'NSCLC', type: 'Disease', desc: 'Non-Small Cell Lung Cancer' },
    { id: '4', name: 'T790M', type: 'Mutation', desc: 'Gatekeeper resistance mutation' },
  ],
  links: [
    { source: '2', target: '1', type: 'TARGETS' },
    { source: '1', target: '3', type: 'ASSOCIATED_WITH' },
    { source: '4', target: '1', type: 'VARIANT_OF' },
    { source: '4', target: '2', type: 'CONFERS_RESISTANCE_TO' },
  ]
};

// SMART HELPER FUNCTIONS (To resolve Neo4j label vs UI name conflicts)
const getNodeType = (node) => {
  const rawType = node.label || node.type || 'Unknown';
  // Standardize PharmGKB labels to UI labels
  if (rawType === 'Chemical') return 'Drug';
  if (rawType === 'Phenotype') return 'Disease';
  if (rawType === 'Variant') return 'Mutation';
  return rawType;
};

const getNodeName = (node) => {
  return node.name || node.title || node.id || 'Unknown';
};

const getNodeColor = (node) => {
  const type = getNodeType(node);
  return NODE_COLORS[type] || NODE_COLORS.Unknown;
};

const GraphWorkspace = () => {
  const containerRef = useRef();
  const graphRef = useRef();
  const [messageApi, contextHolder] = message.useMessage();

  // Graph State
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  
  // Filter State
  const [nodeTypeFilters, setNodeTypeFilters] = useState([]);
  const [edgeTypeFilters, setEdgeTypeFilters] = useState([]);

  // Resize Observer for responsive canvas
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      setDimensions({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch Data
  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8000/api/v1/graph/?limit=200');
        if (res.data.nodes.length === 0) throw new Error("Empty DB");
        setGraphData(res.data);
      } catch (error) {
        console.warn("Neo4j fetch failed or empty, using local fallback data.");
        setGraphData(mockData);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, []);

  // Filter Logic (Memoized)
  const filteredData = useMemo(() => {
    let { nodes, links } = graphData;

    if (nodeTypeFilters.length > 0) {
      nodes = nodes.filter(n => nodeTypeFilters.includes(getNodeType(n)));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      nodes = nodes.filter(n => getNodeName(n).toLowerCase().includes(q) || n.id.toLowerCase().includes(q));
    }
    
    const validNodeIds = new Set(nodes.map(n => n.id));
    
    links = links.filter(l => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      const edgeValid = edgeTypeFilters.length === 0 || edgeTypeFilters.includes(l.type);
      return validNodeIds.has(sourceId) && validNodeIds.has(targetId) && edgeValid;
    });

    return { nodes, links };
  }, [graphData, nodeTypeFilters, edgeTypeFilters, searchQuery]);

  // Canvas Drawing Methods
  const paintNode = useCallback((node, ctx, globalScale) => {
    const label = getNodeName(node);
    const fontSize = 12 / globalScale;
    const isSelected = selectedNode?.id === node.id;
    const radius = isSelected ? 8 : 6;
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = getNodeColor(node);
    ctx.fill();

    // Outline
    ctx.lineWidth = isSelected ? 2 / globalScale : 1 / globalScale;
    ctx.strokeStyle = isSelected ? '#ffffff' : '#141414';
    ctx.stroke();

    // Text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
    ctx.font = `${isSelected ? 'bold ' : ''}${fontSize}px Inter`;
    ctx.fillText(label, node.x, node.y + radius + (4 / globalScale));
  }, [selectedNode]);

  // Graph Interactions
  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z || 0);
    graphRef.current?.centerAt(node.x, node.y, 1000);
    graphRef.current?.zoom(4, 1000);
  }, []);

  const focusGraph = useCallback(() => {
    graphRef.current?.zoomToFit(800, 40);
  }, []);

  // Exports
  const exportPNG = useCallback(() => {
    if (!graphRef.current) return;
    const canvas = graphRef.current.renderer().domElement;
    const link = document.createElement('a');
    link.download = 'oncokg-network.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    messageApi.success("Graph exported as PNG");
  }, [messageApi]);

  const exportJSON = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredData, null, 2));
    const link = document.createElement('a');
    link.download = 'oncokg-export.json';
    link.href = dataStr;
    link.click();
    messageApi.success("Graph data exported as JSON");
  }, [filteredData, messageApi]);

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {contextHolder}
      
      {/* Top Toolbar */}
      <Card bodyStyle={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size="large">
          <Input 
            prefix={<SearchOutlined />} 
            placeholder="Search nodes..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            mode="multiple"
            placeholder="Filter Entities"
            style={{ minWidth: 200 }}
            onChange={setNodeTypeFilters}
            maxTagCount="responsive"
            allowClear
          >
            {Object.keys(NODE_COLORS).filter(k => k !== 'Unknown').map(k => (
              <Option key={k} value={k}>{k}</Option>
            ))}
          </Select>
          <Select
            mode="multiple"
            placeholder="Filter Relationships"
            style={{ minWidth: 200 }}
            onChange={setEdgeTypeFilters}
            maxTagCount="responsive"
            allowClear
          >
            {Object.keys(EDGE_COLORS).filter(k => k !== 'DEFAULT').map(k => (
              <Option key={k} value={k}>{k}</Option>
            ))}
          </Select>
        </Space>
        
        <Space>
          <Tooltip title="Toggle Physics">
            <Switch checked={physicsEnabled} onChange={setPhysicsEnabled} checkedChildren="Dynamics On" unCheckedChildren="Dynamics Off" />
          </Tooltip>
          <Button icon={<AimOutlined />} onClick={focusGraph}>Fit View</Button>
          <Button icon={<DownloadOutlined />} onClick={exportPNG}>PNG</Button>
          <Button icon={<ExportOutlined />} onClick={exportJSON}>JSON</Button>
        </Space>
      </Card>

      {/* Main Canvas Area */}
      <div style={{ flex: 1, position: 'relative', background: '#0a0a0a', borderRadius: 8, overflow: 'hidden' }} ref={containerRef}>
        
        {/* Floating Legend */}
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(20, 20, 20, 0.85)', padding: 12, borderRadius: 8, border: '1px solid #333', backdropFilter: 'blur(4px)' }}>
          <Text strong style={{ color: '#fff', display: 'block', marginBottom: 8 }}>Entity Legend</Text>
          {Object.entries(NODE_COLORS).filter(([k]) => k !== 'Unknown').map(([type, color]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color, marginRight: 8 }} />
              <Text style={{ color: '#aaa', fontSize: 12 }}>{type}</Text>
            </div>
          ))}
        </div>

        {/* WebGL Graph Engine */}
        <ForceGraph2D
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={filteredData}
          nodeLabel={getNodeName}
          nodeColor={getNodeColor}
          nodeCanvasObject={paintNode}
          linkColor={l => EDGE_COLORS[l.type] || EDGE_COLORS.DEFAULT}
          linkWidth={1.5}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          onNodeClick={handleNodeClick}
          d3AlphaDecay={physicsEnabled ? 0.022 : 1}
          d3VelocityDecay={0.3}
          backgroundColor="#0a0a0a"
        />

      {/* Node Details Drawer */}
        <Drawer
          title={
            <Space>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: selectedNode ? getNodeColor(selectedNode) : '#ccc' }} />
              <span style={{ fontWeight: 600 }}>{selectedNode ? getNodeName(selectedNode) : 'Node Details'}</span>
            </Space>
          }
          placement="right"
          width={400}
          onClose={() => setSelectedNode(null)}
          open={!!selectedNode}
          mask={false}
          zIndex={1000}
          style={{ background: 'rgba(20, 20, 20, 0.95)', borderLeft: '1px solid #333' }} 
        >
          {selectedNode && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Descriptions column={1} bordered size="small" labelStyle={{ color: '#aaa', width: '120px' }}>
                <Descriptions.Item label="System ID"><Text code>{selectedNode.id}</Text></Descriptions.Item>
                <Descriptions.Item label="Classification">
                  <Tag color={getNodeColor(selectedNode)}>{getNodeType(selectedNode)}</Tag>
                </Descriptions.Item>
                {selectedNode.class && <Descriptions.Item label="Class">{selectedNode.class}</Descriptions.Item>}
                {selectedNode.desc && <Descriptions.Item label="Description">{selectedNode.desc}</Descriptions.Item>}
                {selectedNode.phase && <Descriptions.Item label="Trial Phase">{selectedNode.phase}</Descriptions.Item>}
                {selectedNode.status && <Descriptions.Item label="Status">{selectedNode.status}</Descriptions.Item>}
                {selectedNode.significance && <Descriptions.Item label="Significance">{selectedNode.significance}</Descriptions.Item>}
              </Descriptions>
              
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Network Metrics</Text>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card size="small" style={{ background: '#141414', borderColor: '#333' }}>
                      <Statistic title="Degree" value={graphData.links.filter(l => l.source.id === selectedNode.id || l.target.id === selectedNode.id).length} valueStyle={{ color: '#fff', fontSize: 18 }} />
                    </Card>
                  </Col>
                </Row>
              </div>

              <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                <Button type="primary" icon={<NodeIndexOutlined />} block>Launch Deep Explorer</Button>
                <Button icon={<FilterOutlined />} block onClick={() => setSearchQuery(getNodeName(selectedNode))}>Isolate Subgraph</Button>
              </Space>
            </Space>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default GraphWorkspace;
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Card, Input, Select, Space, Button, Switch, Drawer, 
  Descriptions, Tag, Tooltip, message, Row, Col, Typography, Statistic, Spin, Empty 
} from 'antd';
import { 
  SearchOutlined, DownloadOutlined, ExportOutlined, 
  NodeIndexOutlined, AimOutlined, FilterOutlined, DatabaseOutlined, WarningOutlined 
} from '@ant-design/icons';
import ForceGraph2D from 'react-force-graph-2d';
import api from '../api/axios'; 

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

// SMART HELPER FUNCTIONS
const getNodeType = (node) => {
  const rawType = node.label || node.type || 'Unknown';
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
  const [fetchError, setFetchError] = useState(null); 
  
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
    const controller = new AbortController();

    const fetchGraph = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await api.get('/graph', { signal: controller.signal });
        
        if (!res.data || !res.data.nodes || res.data.nodes.length === 0) {
          setGraphData({ nodes: [], links: [] }); 
        } else {
          setGraphData(res.data);
        }
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
          console.log('Previous graph request cancelled');
        } else {
          console.error("Neo4j fetch failed:", error);
          setFetchError(error.response?.data?.message || "Failed to fetch knowledge graph data from Neo4j.");
          setGraphData({ nodes: [], links: [] });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchGraph();
    return () => controller.abort();
  }, []);

  // Filter Logic (Memoized & Crash-Proofed)
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
    
    // ✅ FIX 2: Sanitize Links to prevent D3 Crash
    const safeLinks = links.map(l => ({
      ...l,
      source: typeof l.source === 'object' ? l.source.id : l.source,
      target: typeof l.target === 'object' ? l.target.id : l.target
    })).filter(l => {
      const edgeValid = edgeTypeFilters.length === 0 || edgeTypeFilters.includes(l.type);
      return validNodeIds.has(l.source) && validNodeIds.has(l.target) && edgeValid;
    });

    return { nodes, links: safeLinks };
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

    ctx.lineWidth = isSelected ? 2 / globalScale : 1 / globalScale;
    ctx.strokeStyle = isSelected ? '#ffffff' : '#141414';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
    ctx.font = `${isSelected ? 'bold ' : ''}${fontSize}px Inter`;
    ctx.fillText(label, node.x, node.y + radius + (4 / globalScale));
  }, [selectedNode]);

  // Graph Interactions
  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    graphRef.current?.centerAt(node.x, node.y, 1000);
    graphRef.current?.zoom(4, 1000);
  }, []);

  const focusGraph = useCallback(() => {
    graphRef.current?.zoomToFit(800, 40);
  }, []);

  // Exports
  const exportPNG = useCallback(() => {
    if (!containerRef.current) return;
    // ✅ FIX 4: Correctly target the 2D Canvas for export
    const canvas = containerRef.current.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'oncokg-network.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      messageApi.success("Graph exported as PNG");
    } else {
      messageApi.error("Canvas not found for export");
    }
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
            disabled={loading || !!fetchError}
          />
          <Select
            mode="multiple"
            placeholder="Filter Entities"
            style={{ minWidth: 200 }}
            onChange={setNodeTypeFilters}
            maxTagCount="responsive"
            allowClear
            disabled={loading || !!fetchError}
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
            disabled={loading || !!fetchError}
          >
            {Object.keys(EDGE_COLORS).filter(k => k !== 'DEFAULT').map(k => (
              <Option key={k} value={k}>{k}</Option>
            ))}
          </Select>
        </Space>
        
        <Space>
          <Tooltip title="Toggle Physics">
            <Switch checked={physicsEnabled} onChange={setPhysicsEnabled} checkedChildren="Dynamics On" unCheckedChildren="Dynamics Off" disabled={loading || !!fetchError || graphData.nodes.length === 0} />
          </Tooltip>
          <Button icon={<AimOutlined />} onClick={focusGraph} disabled={loading || !!fetchError || graphData.nodes.length === 0}>Fit View</Button>
          <Button icon={<DownloadOutlined />} onClick={exportPNG} disabled={loading || !!fetchError || graphData.nodes.length === 0}>PNG</Button>
          <Button icon={<ExportOutlined />} onClick={exportJSON} disabled={loading || !!fetchError || graphData.nodes.length === 0}>JSON</Button>
        </Space>
      </Card>

      {/* Main Canvas Area */}
      <div style={{ flex: 1, position: 'relative', background: '#0a0a0a', borderRadius: 8, overflow: 'hidden' }} ref={containerRef}>
        
        {(!fetchError && !loading && graphData.nodes.length > 0) && (
          <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(20, 20, 20, 0.85)', padding: 12, borderRadius: 8, border: '1px solid #333', backdropFilter: 'blur(4px)' }}>
            <Text strong style={{ color: '#fff', display: 'block', marginBottom: 8 }}>Entity Legend</Text>
            {Object.entries(NODE_COLORS).filter(([k]) => k !== 'Unknown').map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color, marginRight: 8 }} />
                <Text style={{ color: '#aaa', fontSize: 12 }}>{type}</Text>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: 16 }}>
            <Spin size="large" />
            <Text style={{ color: '#aaa' }}>Querying Neo4j Database...</Text>
          </div>
        ) : fetchError ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', padding: 24, textAlign: 'center' }}>
            <WarningOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
            <Text strong style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>System Error</Text>
            <Text type="secondary" style={{ maxWidth: 400 }}>{fetchError}</Text>
          </div>
        ) : graphData.nodes.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
            <Empty 
              image={<DatabaseOutlined style={{ fontSize: 64, color: '#333' }} />}
              description={<span style={{ color: '#888' }}>No connections found in the Knowledge Graph.</span>}
            />
          </div>
        ) : (
          <ForceGraph2D
            ref={graphRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={filteredData}
            nodeId="id" // ✅ FIX 1: Explicitly defining nodeId so edges can connect
            nodeLabel={getNodeName}
            nodeColor={getNodeColor}
            nodeCanvasObject={paintNode}
            linkColor={l => EDGE_COLORS[l.type] || EDGE_COLORS.DEFAULT}
            linkWidth={1.5}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            onNodeClick={handleNodeClick}
            cooldownTicks={physicsEnabled ? Infinity : 0} // ✅ FIX 3: Proper Physics Toggle
            backgroundColor="#0a0a0a"
          />
        )}

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
                      <Statistic title="Degree" value={graphData.links.filter(l => (l.source.id || l.source) === selectedNode.id || (l.target.id || l.target) === selectedNode.id).length} valueStyle={{ color: '#fff', fontSize: 18 }} />
                    </Card>
                  </Col>
                </Row>
              </div>

              <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                <Button type="primary" icon={<NodeIndexOutlined />} block style={{ background: '#00B5AD' }} onClick={() => messageApi.success('Routing to Deep Explorer... (Module Pending)')}>Launch Deep Explorer</Button>
                <Button icon={<FilterOutlined />} block onClick={() => { setSearchQuery(getNodeName(selectedNode)); messageApi.info('Subgraph Isolated based on node name.'); }}>Isolate Subgraph</Button>
              </Space>
            </Space>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default GraphWorkspace;
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Card, Spin, Alert, Empty, message, Select, Space, Button, Typography, Switch, Input, Tag, Divider } from 'antd';
import { AimOutlined, CameraOutlined, CodeOutlined, SearchOutlined, NodeIndexOutlined } from '@ant-design/icons';
import api from '../api/axios'; 

const { Text, Title } = Typography;

const NODE_COLORS = {
  Drug: '#52c41a',      // Green
  Gene: '#1890ff',      // Blue
  Disease: '#f5222d',   // Red
  Mutation: '#faad14',  // Orange
  Trial: '#722ed1',     // Purple
  Publication: '#13c2c2' // Cyan
};

const KnowledgeGraph = () => {
  const fgRef = useRef();
  
  // Data States
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI & Interaction States
  const [dimensions, setDimensions] = useState({ width: window.innerWidth - 250, height: window.innerHeight - 100 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [dynamicsOn, setDynamicsOn] = useState(true);
  
  // Filter States
  const [searchText, setSearchText] = useState('');
  const [entityFilters, setEntityFilters] = useState([]);
  const [relFilters, setRelFilters] = useState([]);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/graph');
        
        if (response.data && response.data.error) throw new Error(response.data.error);
        
        if (response.data && Array.isArray(response.data.nodes) && Array.isArray(response.data.links)) {
          // ✅ FIX 1: Sanitize Links so nodes actually connect!
          const validNodeIds = new Set(response.data.nodes.map(n => n.id));
          const sanitizedLinks = response.data.links
            .map(link => ({
              ...link,
              source: link.source?.id || link.source || link.startNode,
              target: link.target?.id || link.target || link.endNode
            }))
            .filter(link => validNodeIds.has(link.source) && validNodeIds.has(link.target));

          setGraphData({ nodes: response.data.nodes, links: sanitizedLinks });
        } else {
          setGraphData({ nodes: [], links: [] });
        }
      } catch (err) {
        console.error("Graph Fetch Error:", err);
        setError("Failed to load Knowledge Graph. Verify Neo4j status.");
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();

    // Auto-resize listener
    const handleResize = () => setDimensions({ width: window.innerWidth - 250, height: window.innerHeight - 100 });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ FIX 2 & 3: Safe filtering logic to prevent Black Screen Crashes
  const filteredData = useMemo(() => {
    if (!graphData.nodes) return { nodes: [], links: [] };

    let fNodes = graphData.nodes;
    let fLinks = graphData.links;

    // Search Filter
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      fNodes = fNodes.filter(n => 
        (n.name && n.name.toLowerCase().includes(lowerSearch)) || 
        (n.id && n.id.toLowerCase().includes(lowerSearch))
      );
    }

    // Entity Filter
    if (entityFilters.length > 0) {
      fNodes = fNodes.filter(n => entityFilters.includes(n.label));
    }

    // CRITICAL: Prevent D3 crash by removing links that point to hidden nodes
    const fNodeIds = new Set(fNodes.map(n => n.id));
    fLinks = fLinks.filter(l => 
      fNodeIds.has(l.source?.id || l.source) && 
      fNodeIds.has(l.target?.id || l.target)
    );

    return { nodes: fNodes, links: fLinks };
  }, [graphData, searchText, entityFilters]);

  // ✅ FIX 4: Physics Toggle Logic
  useEffect(() => {
    if (fgRef.current) {
      if (dynamicsOn) {
        fgRef.current.d3Force('charge').strength(-120);
        fgRef.current.d3ReheatSimulation();
      } else {
        fgRef.current.d3Force('charge').strength(0); // Freeze graph
      }
    }
  }, [dynamicsOn]);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    // Auto-center on clicked node
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2, 2000);
    }
  }, []);

  const handleFitView = () => {
    if (fgRef.current) fgRef.current.zoomToFit(800, 50);
  };

  const exportPNG = () => {
    message.info("Exporting Graph to PNG...");
    // Logic for canvas export goes here
  };

  if (loading) return <Card style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}><Spin size="large" tip="Querying Neo4j Database..." /></Card>;
  if (error) return <Card style={{ height: '100vh', background: '#000' }}><Alert message="System Fault" description={error} type="error" showIcon /></Card>;
  if (graphData.nodes.length === 0) return <Card style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}><Empty description="No entities found." /></Card>;

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden', background: '#000' }}>
      
      {/* 🎛️ TOP TOOLBAR */}
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10, display: 'flex', gap: 16, background: 'rgba(20, 20, 20, 0.8)', padding: '12px 24px', borderRadius: 8, backdropFilter: 'blur(10px)', border: '1px solid #333' }}>
        <Input placeholder="Search nodes..." prefix={<SearchOutlined />} style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} allowClear />
        <Select mode="multiple" placeholder="Filter Entities" style={{ width: 250 }} onChange={setEntityFilters} allowClear options={Object.keys(NODE_COLORS).map(k => ({ label: k, value: k }))} />
        <Space style={{ marginLeft: 'auto' }}>
          <Text style={{ color: '#fff' }}>Dynamics {dynamicsOn ? 'ON' : 'OFF'}</Text>
          <Switch checked={dynamicsOn} onChange={setDynamicsOn} />
          <Button icon={<AimOutlined />} onClick={handleFitView}>Fit View</Button>
          <Button icon={<CameraOutlined />} onClick={exportPNG}>PNG</Button>
          <Button icon={<CodeOutlined />}>JSON</Button>
        </Space>
      </div>

      {/* 📊 LEGEND SIDEBAR (Left) */}
      <Card title="Entity Legend" size="small" style={{ position: 'absolute', top: 90, left: 16, zIndex: 10, width: 150, background: 'rgba(20, 20, 20, 0.8)', borderColor: '#333' }} headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}>
        {Object.entries(NODE_COLORS).map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color, marginRight: 8 }}></div>
            <Text style={{ color: '#fff' }}>{label}</Text>
          </div>
        ))}
      </Card>

      {/* 📝 NODE DETAILS SIDEBAR (Right) */}
      {selectedNode && (
        <Card title={`System ID: ${selectedNode.id}`} size="small" extra={<Button type="text" style={{ color: '#fff' }} onClick={() => setSelectedNode(null)}>X</Button>} style={{ position: 'absolute', top: 90, right: 16, zIndex: 10, width: 300, background: 'rgba(20, 20, 20, 0.9)', borderColor: '#333' }} headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Classification</Text>
              <Tag color={NODE_COLORS[selectedNode.label]}>{selectedNode.label}</Tag>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Name</Text>
              <Text style={{ color: '#fff' }} strong>{selectedNode.name || 'N/A'}</Text>
            </div>
            <Divider style={{ margin: '12px 0', borderColor: '#444' }} />
            <Button type="primary" block icon={<SearchOutlined />} onClick={() => message.success('Routing to Deep Explorer...')} style={{ background: '#00B5AD' }}>
              Launch Deep Explorer
            </Button>
            <Button block icon={<NodeIndexOutlined />} onClick={() => message.info('Isolating subgraph view...')} style={{ background: 'transparent', color: '#fff', borderColor: '#555' }}>
              Isolate Subgraph
            </Button>
          </Space>
        </Card>
      )}

      {/* 🕸️ THE GRAPH ENGINE */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={filteredData}
        nodeId="id"
        nodeLabel={(node) => `${node.label}: ${node.name || node.id}`}
        nodeColor={(node) => NODE_COLORS[node.label] || '#ffffff'}
        nodeRelSize={7}
        linkColor={() => 'rgba(255, 255, 255, 0.2)'}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        onNodeClick={handleNodeClick}
        backgroundColor="#000000"
        cooldownTicks={dynamicsOn ? Infinity : 0}
      />
    </div>
  );
};

export default KnowledgeGraph;
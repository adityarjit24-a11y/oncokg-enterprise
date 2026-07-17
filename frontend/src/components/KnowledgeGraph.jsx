import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Card, Spin, Alert, Empty, message } from 'antd';
import api from '../api/axios'; 

// strict color scheme matching your Entity Legend UI
const NODE_COLORS = {
  Drug: '#52c41a',       // Green
  Gene: '#1890ff',       // Blue
  Disease: '#f5222d',    // Red
  Mutation: '#faad14',   // Orange
  Trial: '#722ed1',      // Purple
  Publication: '#13c2c2' // Cyan
};

const KnowledgeGraph = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/graph');
        
        if (response.data && response.data.error) {
          throw new Error(response.data.error);
        }
        
        if (response.data && Array.isArray(response.data.nodes) && Array.isArray(response.data.links)) {
          setGraphData(response.data);
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
  }, []);

  const memoizedData = useMemo(() => graphData, [graphData]);

  const handleNodeClick = useCallback((node) => {
    message.info(`Selected ${node.label}: ${node.name || node.id}`);
  }, []);

  const containerRef = useCallback(node => {
    if (node !== null) {
      setDimensions({ width: node.getBoundingClientRect().width, height: 600 });
    }
  }, []);

  if (loading) {
    return (
      <Card bordered={false} style={{ height: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
        <Spin size="large" tip="Querying Neo4j Database..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card bordered={false} style={{ height: 600, background: 'transparent' }}>
        <Alert message="System Fault" description={error} type="error" showIcon />
      </Card>
    );
  }

  if (memoizedData.nodes.length === 0) {
    return (
      <Card bordered={false} style={{ height: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
        <Empty description="No biomedical entities found in the index." />
      </Card>
    );
  }

  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }} ref={containerRef} style={{ background: 'transparent' }}>
      <ForceGraph2D
        width={dimensions.width}
        height={dimensions.height}
        graphData={memoizedData}
        nodeLabel={(node) => `${node.label}: ${node.name || node.id}`}
        nodeColor={(node) => NODE_COLORS[node.label] || '#ffffff'}
        nodeRelSize={7} 
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        onNodeClick={handleNodeClick}
        backgroundColor="#001529" 
      />
    </Card>
  );
};

export default KnowledgeGraph;
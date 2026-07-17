import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Input, Space, Button, Drawer, Typography, Descriptions, Tooltip } from 'antd';
import { SearchOutlined, DownloadOutlined, NodeIndexOutlined, ExportOutlined } from '@ant-design/icons';
import api from '../api/axios'; // Direct axios hata kar secure api import kiya
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const SharedExplorer = ({ title, subtitle, endpoint, columns, detailLayout }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async (search = '') => {
    setLoading(true);
    try {
      // 1. URL mein '/explore/' add kiya aur custom api object use kiya
      const response = await api.get(`/api/v1/explore/${endpoint}?limit=50&search=${search}`);
      setData(response.data);
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    fetchData(value);
  };

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${endpoint}_export.csv`);
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>{title}</Title>
          <Text type="secondary">{subtitle}</Text>
        </div>
        <Space>
          <Input.Search 
            placeholder={`Search ${title.toLowerCase()}...`} 
            allowClear 
            onSearch={handleSearch} 
            style={{ width: 300 }} 
          />
          <Button icon={<DownloadOutlined />} onClick={exportCSV}>Export Data</Button>
        </Space>
      </div>

      <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ overflow: 'hidden', borderRadius: 8 }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 15, showSizeChanger: true }}
          onRow={(record) => ({
            onClick: () => setSelectedEntity(record),
            style: { cursor: 'pointer' }
          })}
          rowClassName={() => 'enterprise-table-row'}
        />
      </Card>

      <Drawer
        title={<span style={{ fontWeight: 600 }}>{selectedEntity?.name || selectedEntity?.title} Details</span>}
        placement="right"
        width={500}
        onClose={() => setSelectedEntity(null)}
        open={!!selectedEntity}
        extra={
          <Space>
            <Tooltip title="View in Graph">
              <Button type="primary" icon={<NodeIndexOutlined />} onClick={() => navigate('/graph')} />
            </Tooltip>
            <Tooltip title="Export JSON">
              <Button icon={<ExportOutlined />} />
            </Tooltip>
          </Space>
        }
      >
        {selectedEntity && (
          /* 3. Ant Design v5 warning fix for Descriptions component */
          <Descriptions 
            column={1} 
            bordered 
            size="small" 
            styles={{ label: { width: '150px', background: 'rgba(0,0,0,0.02)' } }}
          >
            {detailLayout(selectedEntity)}
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default SharedExplorer;
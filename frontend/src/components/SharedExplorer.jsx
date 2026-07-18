import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Table, Input, Space, Typography, Button, Descriptions } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../api/axios';

const { Title, Text: AntText } = Typography; // ✅ FIX: Text ko AntText rename kiya

const SharedExplorer = ({ title, subtitle, endpoint, columns, detailLayout }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const debounceTimeout = useRef(null);
  const abortController = useRef(null);

  const fetchData = useCallback(async (page = 1, limit = 10, search = '') => {
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    setLoading(true);
    try {
      const response = await api.get(`/${endpoint}`, {
        params: { page, limit, search },
        signal: abortController.current.signal
      });

      const fetchedData = response.data.items || response.data || [];
      const totalCount = response.data.total || fetchedData.length;

      setData(fetchedData);
      setPagination(prev => ({ ...prev, current: page, pageSize: limit, total: totalCount }));
    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error('Failed to fetch data', error);
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData(1, 10, '');
  }, [fetchData]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchData(1, pagination.pageSize, value);
    }, 500); 
  };

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize, searchText);
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <Card 
        title={<Title level={4} style={{ margin: 0 }}>{title}</Title>}
        extra={
          <Space>
            {/* ✅ FIX: Typography.Text ki jagah AntText use kiya */}
            <AntText type="secondary" style={{ marginRight: 10 }}>{subtitle}</AntText>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 250 }}
              allowClear
            />
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => fetchData(pagination.current, pagination.pageSize, searchText)}
              disabled={loading}
            >
              Refresh
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id || Math.random().toString()}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          onChange={handleTableChange}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '24px', background: '#141414', border: '1px solid #333', borderRadius: '8px' }}>
                {/* ✅ FIX: Removed 'bordered' prop which forces white bg, added custom colors */}
                <Descriptions 
                  column={2} 
                  labelStyle={{ color: '#00B5AD', fontWeight: 'bold' }} 
                  contentStyle={{ color: '#e0e0e0' }}
                >
                  {detailLayout(record)}
                </Descriptions>
              </div>
            ),
          }}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default SharedExplorer;
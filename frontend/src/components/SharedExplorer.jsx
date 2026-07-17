import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Table, Input, Space, Tag, Typography, Tooltip, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../api/axios';

const { Title } = Typography;

const SharedExplorer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Enterprise Pagination State
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Reference for Debounce Timeout
  const debounceTimeout = useRef(null);
  // Reference for AbortController to kill previous requests
  const abortController = useRef(null);

  // Main Fetch Function
  const fetchData = useCallback(async (page = 1, limit = 10, search = '') => {
    // Kill any ongoing request before starting a new one
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    setLoading(true);
    try {
      // Backend ko proper query params bhejna (Ensure your backend supports these)
      const response = await api.get('/explorer/data', {
        params: { page, limit, search },
        signal: abortController.current.signal
      });

      // Agar backend pagination format bhejta hai: { data: [...], total: 100 }
      // Agar backend direct array bhejta hai, toh total uski length hogi (fallback)
      const fetchedData = response.data.items || response.data || [];
      const totalCount = response.data.total || fetchedData.length;

      setData(fetchedData);
      setPagination(prev => ({ ...prev, current: page, pageSize: limit, total: totalCount }));
    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        console.log('Previous fetch cancelled');
      } else {
        console.error('Failed to fetch data', error);
        setData([]); // Clear data on error to prevent broken UI
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, searchText);
    return () => {
      if (abortController.current) abortController.current.abort();
    };
  }, []); // Only run once on mount

  // Debounced Search Handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      // Jab typing ruk jaye (500ms), tabhi page 1 se search start karo
      fetchData(1, pagination.pageSize, value);
    }, 500); 
  };

  // Pagination Change Handler (Ant Design automatically gives new page and pageSize)
  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize, searchText);
  };

  // Enterprise Table Columns
  const columns = [
    {
      title: 'Entity ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Typography.Text copyable code>{text || 'N/A'}</Typography.Text>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text || 'Unknown'}</strong>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        let color = 'default';
        if (type === 'Drug' || type === 'Chemical') color = 'green';
        if (type === 'Gene') color = 'blue';
        if (type === 'Disease' || type === 'Phenotype') color = 'red';
        return <Tag color={color}>{type || 'Unknown'}</Tag>;
      }
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      key: 'desc',
      ellipsis: {
        showTitle: false,
      },
      render: (desc) => (
        <Tooltip placement="topLeft" title={desc}>
          {desc || 'No description available'}
        </Tooltip>
      ),
    }
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <Card 
        title={<Title level={4} style={{ margin: 0, color: '#fff' }}>Knowledge Graph Explorer</Title>}
        extra={
          <Space>
            <Input
              placeholder="Search entities..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 300 }}
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
        style={{ background: '#141414', borderColor: '#333' }}
        headStyle={{ borderBottom: '1px solid #333' }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id || Math.random().toString()}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: 'calc(100vh - 350px)' }} // Enterprise scrolling
          size="middle"
        />
      </Card>
    </div>
  );
};

export default SharedExplorer;
import React, { useState } from 'react';
import { Card, Input, Button, List, Typography, Space, Tag, Avatar, Spin } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, CopyOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const AIAssistant = () => {
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! I am the OncoKG Enterprise AI. How can I assist your research today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Which drugs target EGFR?",
    "Show resistance mutations for Osimertinib.",
    "Shortest path between TP53 and Lung Cancer."
  ];

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('https://oncokg-enterprise-production.up.railway.app', { message: text });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error connecting to AI service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Title level={3}>AI Graph Assistant</Title>
      
      <Space style={{ marginBottom: 16 }}>
        {suggestions.map((s, i) => (
          <Tag color="cyan" style={{ cursor: 'pointer', padding: '4px 8px' }} key={i} onClick={() => handleSend(s)}>{s}</Tag>
        ))}
      </Space>

      <Card style={{ flex: 1, overflowY: 'auto', marginBottom: 16, background: '#fafafa' }} bodyStyle={{ padding: '16px' }}>
        <List
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item style={{ borderBottom: 'none', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Space align="start">
                {msg.sender === 'ai' && <Avatar style={{ backgroundColor: '#00B5AD' }} icon={<RobotOutlined />} />}
                <div style={{ background: msg.sender === 'user' ? '#001529' : '#fff', color: msg.sender === 'user' ? '#fff' : '#000', padding: '12px 16px', borderRadius: 8, maxWidth: 600, border: '1px solid #e8e8e8' }}>
                  <Text style={{ color: 'inherit', whiteSpace: 'pre-wrap' }}>{msg.text}</Text>
                </div>
                {msg.sender === 'user' && <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />}
              </Space>
            </List.Item>
          )}
        />
        {loading && <div style={{ textAlign: 'center', marginTop: 16 }}><Spin /></div>}
      </Card>

      <Space.Compact style={{ width: '100%' }}>
        <Input.TextArea value={input} onChange={e => setInput(e.target.value)} placeholder="Ask the knowledge graph..." autoSize={{ minRows: 2, maxRows: 4 }} onPressEnter={(e) => { if(!e.shiftKey) { e.preventDefault(); handleSend(input); }}} />
        <Button type="primary" style={{ height: '100%' }} icon={<SendOutlined />} onClick={() => handleSend(input)}>Send</Button>
      </Space.Compact>
    </div>
  );
};

export default AIAssistant;
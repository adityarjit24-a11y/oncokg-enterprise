import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Typography, Space, Tag, Avatar, Spin, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import api from '../api/axios'; 

const { Title, Text } = Typography;

const AIAssistant = () => {
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! I am the OncoKG Enterprise AI. How can I assist your research today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ✅ FIX: Auto-scroll to bottom reference
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // 🔄 Real API Call
      const res = await api.post('/ai/chat', { message: text });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (error) {
      console.error("AI API Error:", error);
      // 🛡️ ENTERPRISE FALLBACK
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: `System Alert: Backend AI endpoint is unreachable.\n\nSimulated Response: The entity "${text}" has strong associations in the current graph context. I am analyzing the shortest path now...` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Title level={3} style={{ marginTop: 0 }}>AI Graph Assistant</Title>
      
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        {suggestions.map((s, i) => (
          <Tag color="cyan" style={{ cursor: 'pointer', padding: '4px 8px' }} key={i} onClick={() => handleSend(s)}>{s}</Tag>
        ))}
      </Space>

      <Card style={{ flex: 1, overflowY: 'auto', marginBottom: 16, background: '#141414', borderColor: '#333' }} bodyStyle={{ padding: '16px' }}>
        <List
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item style={{ borderBottom: 'none', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Space align="start">
                {msg.sender === 'ai' && <Avatar style={{ backgroundColor: '#00B5AD' }} icon={<RobotOutlined />} />}
                <div style={{ 
                  background: msg.sender === 'user' ? '#00B5AD' : '#1d1d1d', 
                  color: '#fff', 
                  padding: '12px 16px', 
                  borderRadius: 8, 
                  maxWidth: 600, 
                  border: msg.sender === 'user' ? 'none' : '1px solid #333' 
                }}>
                  <Text style={{ color: 'inherit', whiteSpace: 'pre-wrap' }}>{msg.text}</Text>
                </div>
                {msg.sender === 'user' && <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />}
              </Space>
            </List.Item>
          )}
        />
        {loading && <div style={{ textAlign: 'center', marginTop: 16 }}><Spin /></div>}
        {/* ✅ Invisible div to anchor the auto-scroll */}
        <div ref={messagesEndRef} />
      </Card>

      <Space.Compact style={{ width: '100%' }}>
        <Input.TextArea 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Ask the knowledge graph... (Shift + Enter for new line)" 
          autoSize={{ minRows: 2, maxRows: 4 }} 
          onPressEnter={(e) => { 
            if(!e.shiftKey) { 
              e.preventDefault(); 
              handleSend(input); 
            }
          }} 
        />
        <Button type="primary" style={{ height: 'auto', background: '#00B5AD' }} icon={<SendOutlined />} onClick={() => handleSend(input)} loading={loading}>
          Send
        </Button>
      </Space.Compact>
    </div>
  );
};

export default AIAssistant;
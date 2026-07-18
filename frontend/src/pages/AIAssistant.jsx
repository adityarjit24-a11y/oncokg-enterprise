import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Typography, Space, Tag, Avatar, Spin } from 'antd';
// ✅ FIX: Removed missing icons, using only the guaranteed ones
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import api from '../api/axios'; 

const { Title, Text } = Typography;

const AIAssistant = () => {
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! I am the OncoKG Enterprise AI. How can I assist your research today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
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
      const res = await api.post('/ai/chat', { message: text });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: `System Alert: Backend AI endpoint is unreachable.\n\nSimulated Response: The entity "${text}" has strong associations in the current graph context. I am analyzing the shortest path now...` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const glassCardStyle = {
    background: 'rgba(22, 27, 34, 0.4)',
    backdropFilter: 'blur(12px)',
    border: '1px solid #30363d',
    borderRadius: '12px'
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 🚀 Header */}
      <div>
        <Title level={2} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>
          {/* ✅ FIX: Using RobotOutlined for the title icon */}
          <RobotOutlined style={{ color: '#5e6ad2', marginRight: '10px' }} />
          OncoAI Assistant
        </Title>
        <Text style={{ color: '#8b949e', fontSize: '15px' }}>Natural language interface for deep graph queries.</Text>
      </div>
      
      <Space style={{ flexWrap: 'wrap' }}>
        {suggestions.map((s, i) => (
          <Tag 
            key={i} 
            style={{ cursor: 'pointer', padding: '6px 12px', background: 'rgba(94, 106, 210, 0.1)', border: '1px solid rgba(94, 106, 210, 0.3)', color: '#5e6ad2', borderRadius: '16px', fontSize: '13px' }} 
            onClick={() => handleSend(s)}
            className="hover-lift"
          >
            {s}
          </Tag>
        ))}
      </Space>

      {/* 💬 Chat Workspace */}
      <Card style={{ ...glassCardStyle, flex: 1, overflowY: 'auto' }} bodyStyle={{ padding: '24px' }}>
        <List
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item style={{ borderBottom: 'none', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', padding: '8px 0' }}>
              <Space align="start">
                {msg.sender === 'ai' && <Avatar style={{ backgroundColor: 'rgba(94, 106, 210, 0.2)', border: '1px solid #5e6ad2', color: '#5e6ad2' }} icon={<RobotOutlined />} />}
                
                <div style={{ 
                  background: msg.sender === 'user' ? '#5e6ad2' : 'rgba(13, 17, 23, 0.6)', 
                  color: msg.sender === 'user' ? '#fff' : '#c9d1d9', 
                  padding: '12px 18px', 
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', 
                  maxWidth: 650, 
                  border: msg.sender === 'user' ? 'none' : '1px solid #30363d',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <Text style={{ color: 'inherit', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.text}</Text>
                </div>
                
                {msg.sender === 'user' && <Avatar style={{ backgroundColor: '#2ea043' }} icon={<UserOutlined />} />}
              </Space>
            </List.Item>
          )}
        />
        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
            <Avatar style={{ backgroundColor: 'rgba(94, 106, 210, 0.2)', border: '1px solid #5e6ad2', color: '#5e6ad2' }} icon={<RobotOutlined />} />
            <Spin size="small" />
            <Text style={{ color: '#8b949e', fontSize: '12px' }}>Analyzing graph trajectories...</Text>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Card>

      {/* ⌨️ Input Area */}
      <Space.Compact style={{ width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        <Input.TextArea 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Ask the knowledge graph... (Shift + Enter for new line)" 
          autoSize={{ minRows: 1, maxRows: 4 }} 
          style={{ background: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', padding: '12px', fontSize: '15px' }}
          onPressEnter={(e) => { 
            if(!e.shiftKey) { 
              e.preventDefault(); 
              handleSend(input); 
            }
          }} 
        />
        <Button 
          type="primary" 
          style={{ height: 'auto', background: '#5e6ad2', borderColor: '#5e6ad2', padding: '0 24px' }} 
          icon={<SendOutlined />} 
          onClick={() => handleSend(input)} 
          loading={loading}
        >
          Send
        </Button>
      </Space.Compact>
    </div>
  );
};

export default AIAssistant;
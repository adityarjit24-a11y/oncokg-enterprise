import React from 'react';
import { Result, Button, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry
    console.error("Enterprise Global Error Caught:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for Enterprise App
      return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          background: '#0a0a0a', // Dark theme background
          padding: '20px'
        }}>
          <Result
            status="500"
            title={<span style={{ color: '#fff' }}>Critical Rendering Error</span>}
            subTitle={<span style={{ color: '#aaa' }}>The application encountered an unexpected error. Our system has logged this event.</span>}
            extra={
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={() => window.location.href = '/'}
                style={{ background: '#00B5AD', borderColor: '#00B5AD' }}
              >
                Reload Application
              </Button>
            }
          >
            {this.state.error && (
              <div style={{ textAlign: 'left', background: '#141414', padding: '16px', borderRadius: '8px', border: '1px solid #333', marginTop: '20px', maxWidth: '600px', overflowX: 'auto' }}>
                <Text strong style={{ color: '#faad14' }}>Error Details (For Engineers):</Text>
                <Paragraph style={{ color: '#ff4d4f', fontFamily: 'monospace', marginTop: '8px', marginBottom: 0 }}>
                  {this.state.error.toString()}
                </Paragraph>
              </div>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
// WebSocket Test Utility
// Sử dụng để test WebSocket connection và message handling

import WebSocketService from '../services/websocket';

export const testWebSocketConnection = async () => {
  console.log('Testing WebSocket connection...');
  
  try {
    await WebSocketService.connect();
    console.log('✅ WebSocket connected successfully');
    
    // Test subscription to all camera health updates
    WebSocketService.subscribeToCameraHealth((data) => {
      console.log('📡 Received camera health update:', data);
    });
    
    // Test subscription to specific camera
    WebSocketService.subscribeToSpecificCameraHealth(1, (data) => {
      console.log('📡 Received specific camera health update:', data);
    });
    
    console.log('✅ WebSocket subscriptions created');
    
    // Test disconnect after 10 seconds
    setTimeout(() => {
      console.log('🔄 Testing disconnect...');
      WebSocketService.disconnect();
      console.log('✅ WebSocket disconnected');
    }, 10000);
    
  } catch (error) {
    console.error('❌ WebSocket connection failed:', error);
  }
};

export const testCameraHealthCheck = async (cameraId) => {
  console.log(`Testing camera health check for camera ${cameraId}...`);
  
  try {
    const response = await fetch(`http://localhost:8080/api/cameras/${cameraId}/check-health`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    console.log('📊 Health check response:', data);
    
    if (response.ok) {
      console.log('✅ Health check successful');
    } else {
      console.log('❌ Health check failed');
    }
    
  } catch (error) {
    console.error('❌ Health check error:', error);
  }
};

export const monitorWebSocketStatus = () => {
  const checkConnection = () => {
    const isConnected = WebSocketService.isConnected();
    console.log(`🔗 WebSocket status: ${isConnected ? 'Connected' : 'Disconnected'}`);
    
    if (!isConnected) {
      console.log('🔄 Attempting to reconnect...');
      WebSocketService.connect().catch(console.error);
    }
  };
  
  // Check connection status every 30 seconds
  setInterval(checkConnection, 30000);
  
  console.log('📡 WebSocket monitoring started');
};

// Export test functions for use in browser console
if (typeof window !== 'undefined') {
  window.testWebSocket = {
    testConnection: testWebSocketConnection,
    testHealthCheck: testCameraHealthCheck,
    monitorStatus: monitorWebSocketStatus,
  };
  
  console.log('🧪 WebSocket test utilities available:');
  console.log('- window.testWebSocket.testConnection()');
  console.log('- window.testWebSocket.testHealthCheck(cameraId)');
  console.log('- window.testWebSocket.monitorStatus()');
}

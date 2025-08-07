// WebSocket connection test utility
import { io } from 'socket.io-client';

export const testWebSocketConnection = () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    if (!token) {
      reject(new Error('No authentication token found'));
      return;
    }

    console.log('Testing WebSocket connection...');
    
    const socket = io('http://localhost:8099', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 5000
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connection successful');
      socket.disconnect();
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection failed:', error);
      socket.disconnect();
      reject(error);
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      socket.disconnect();
      reject(new Error('WebSocket connection timeout'));
    }, 5000);
  });
};

export const testChatMessage = async (conversationId, message) => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    if (!token) {
      reject(new Error('No authentication token found'));
      return;
    }

    const socket = io('http://localhost:8099', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Connected, joining conversation...');
      socket.emit('join_conversation', { conversationId });
      
      setTimeout(() => {
        console.log('Sending test message...');
        socket.emit('send_message', {
          conversationId,
          message,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    });

    socket.on('message', (data) => {
      console.log('✅ Received message:', data);
      socket.disconnect();
      resolve(data);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      socket.disconnect();
      reject(error);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      socket.disconnect();
      reject(new Error('Test timeout'));
    }, 10000);
  });
};

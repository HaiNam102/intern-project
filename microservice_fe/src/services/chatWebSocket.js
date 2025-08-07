import { io } from 'socket.io-client';

class ChatWebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.messageHandlers = [];
    this.connectionHandlers = [];
    this.typingHandlers = [];
    this.stopTypingHandlers = [];
  }

  // Kết nối WebSocket
  connect() {
    return new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          reject(new Error('No authentication token found'));
          return;
        }

        // Tạo kết nối Socket.IO
        this.socket = io('http://localhost:8099', {
          auth: {
            token: token
          },
          transports: ['websocket', 'polling'],
          autoConnect: true
        });

        // Xử lý sự kiện kết nối
        this.socket.on('connect', () => {
          console.log('Chat WebSocket connected');
          this.isConnected = true;
          this.notifyConnectionHandlers(true);
          resolve();
        });

        // Xử lý sự kiện ngắt kết nối
        this.socket.on('disconnect', () => {
          console.log('Chat WebSocket disconnected');
          this.isConnected = false;
          this.notifyConnectionHandlers(false);
        });

        // Xử lý lỗi kết nối
        this.socket.on('connect_error', (error) => {
          console.error('Chat WebSocket connection error:', error);
          this.isConnected = false;
          this.notifyConnectionHandlers(false);
          reject(error);
        });

        // Lắng nghe tin nhắn mới
        this.socket.on('message', (message) => {
          console.log('Received new message:', message);
          this.notifyMessageHandlers(message);
        });

        // Lắng nghe tin nhắn được gửi
        this.socket.on('message_sent', (message) => {
          console.log('Message sent successfully:', message);
          this.notifyMessageHandlers(message);
        });

        // Lắng nghe thông báo typing
        this.socket.on('typing', (data) => {
          console.log('User typing:', data);
          this.notifyTypingHandlers(data);
        });

        // Lắng nghe thông báo stop typing
        this.socket.on('stop_typing', (data) => {
          console.log('User stopped typing:', data);
          this.notifyStopTypingHandlers(data);
        });

      } catch (error) {
        console.error('Error connecting to Chat WebSocket:', error);
        reject(error);
      }
    });
  }

  // Ngắt kết nối
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    console.log('Chat WebSocket disconnected');
  }

  // Gửi tin nhắn
  sendMessage(conversationId, message) {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    const messageData = {
      conversationId,
      message,
      timestamp: new Date().toISOString()
    };

    console.log('Sending message:', messageData);
    this.socket.emit('send_message', messageData);
    
    return messageData;
  }

  // Gửi thông báo typing
  sendTyping(conversationId) {
    if (!this.isConnected) {
      return;
    }

    console.log('Sending typing notification:', { conversationId });
    this.socket.emit('typing', { conversationId });
  }

  // Gửi thông báo stop typing
  sendStopTyping(conversationId) {
    if (!this.isConnected) {
      return;
    }

    console.log('Sending stop typing notification:', { conversationId });
    this.socket.emit('stop_typing', { conversationId });
  }

  // Join conversation
  joinConversation(conversationId) {
    if (!this.isConnected) {
      return;
    }

    console.log('Joining conversation:', { conversationId });
    this.socket.emit('join_conversation', { conversationId });
  }

  // Leave conversation
  leaveConversation(conversationId) {
    if (!this.isConnected) {
      return;
    }

    console.log('Leaving conversation:', { conversationId });
    this.socket.emit('leave_conversation', { conversationId });
  }

  // Đăng ký handler cho tin nhắn mới
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  // Đăng ký handler cho sự kiện kết nối
  onConnectionChange(handler) {
    this.connectionHandlers.push(handler);
  }

  // Đăng ký handler cho typing
  onTyping(handler) {
    this.typingHandlers.push(handler);
  }

  // Đăng ký handler cho stop typing
  onStopTyping(handler) {
    this.stopTypingHandlers.push(handler);
  }

  // Thông báo cho các handler tin nhắn
  notifyMessageHandlers(message) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  // Thông báo cho các handler kết nối
  notifyConnectionHandlers(isConnected) {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(isConnected);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }

  // Thông báo cho các handler typing
  notifyTypingHandlers(data) {
    this.typingHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('Error in typing handler:', error);
      }
    });
  }

  // Thông báo cho các handler stop typing
  notifyStopTypingHandlers(data) {
    this.stopTypingHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('Error in stop typing handler:', error);
      }
    });
  }

  // Kiểm tra trạng thái kết nối
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Tạo instance singleton
const chatWebSocketService = new ChatWebSocketService();
export default chatWebSocketService; 
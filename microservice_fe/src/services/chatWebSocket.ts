import { io, Socket } from 'socket.io-client';

type MessageHandler = (message: any) => void;
type ConnectionHandler = (isConnected: boolean) => void;
type TypingHandler = (data: any) => void;

class ChatWebSocketService {
  private socket: Socket | null;
  private isConnected: boolean;
  private messageHandlers: MessageHandler[];
  private connectionHandlers: ConnectionHandler[];
  private typingHandlers: TypingHandler[];
  private stopTypingHandlers: TypingHandler[];

  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.messageHandlers = [];
    this.connectionHandlers = [];
    this.typingHandlers = [];
    this.stopTypingHandlers = [];
  }

  // Kết nối WebSocket
  connect(): Promise<void> {
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
        this.socket.on('connect_error', (error: any) => {
          console.error('Chat WebSocket connection error:', error);
          this.isConnected = false;
          this.notifyConnectionHandlers(false);
          reject(error);
        });

        // Lắng nghe tin nhắn mới
        this.socket.on('message', (message: any) => {
          console.log('Received new message:', message);
          this.notifyMessageHandlers(message);
        });

        // Lắng nghe tin nhắn được gửi
        this.socket.on('message_sent', (message: any) => {
          console.log('Message sent successfully:', message);
          this.notifyMessageHandlers(message);
        });

        // Lắng nghe thông báo typing
        this.socket.on('typing', (data: any) => {
          console.log('User typing:', data);
          this.notifyTypingHandlers(data);
        });

        // Lắng nghe thông báo stop typing
        this.socket.on('stop_typing', (data: any) => {
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
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    console.log('Chat WebSocket disconnected');
  }

  // Gửi tin nhắn
  sendMessage(conversationId: number, message: string): any {
    if (!this.isConnected || !this.socket) {
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
  sendTyping(conversationId: number): void {
    if (!this.isConnected || !this.socket) {
      return;
    }

    console.log('Sending typing notification:', { conversationId });
    this.socket.emit('typing', { conversationId });
  }

  // Gửi thông báo stop typing
  sendStopTyping(conversationId: number): void {
    if (!this.isConnected || !this.socket) {
      return;
    }

    console.log('Sending stop typing notification:', { conversationId });
    this.socket.emit('stop_typing', { conversationId });
  }

  // Join conversation
  joinConversation(conversationId: number): void {
    if (!this.isConnected || !this.socket) {
      return;
    }

    console.log('Joining conversation:', { conversationId });
    this.socket.emit('join_conversation', { conversationId });
  }

  // Leave conversation
  leaveConversation(conversationId: number): void {
    if (!this.isConnected || !this.socket) {
      return;
    }

    console.log('Leaving conversation:', { conversationId });
    this.socket.emit('leave_conversation', { conversationId });
  }

  // Đăng ký handler cho tin nhắn mới
  onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  // Đăng ký handler cho sự kiện kết nối
  onConnectionChange(handler: ConnectionHandler): void {
    this.connectionHandlers.push(handler);
  }

  // Đăng ký handler cho typing
  onTyping(handler: TypingHandler): void {
    this.typingHandlers.push(handler);
  }

  // Đăng ký handler cho stop typing
  onStopTyping(handler: TypingHandler): void {
    this.stopTypingHandlers.push(handler);
  }

  // Thông báo cho các handler tin nhắn
  private notifyMessageHandlers(message: any): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  // Thông báo cho các handler kết nối
  private notifyConnectionHandlers(isConnected: boolean): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(isConnected);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }

  // Thông báo cho các handler typing
  private notifyTypingHandlers(data: any): void {
    this.typingHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('Error in typing handler:', error);
      }
    });
  }

  // Thông báo cho các handler stop typing
  private notifyStopTypingHandlers(data: any): void {
    this.stopTypingHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('Error in stop typing handler:', error);
      }
    });
  }

  // Kiểm tra trạng thái kết nối
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Tạo instance singleton
const chatWebSocketService = new ChatWebSocketService();
export default chatWebSocketService;



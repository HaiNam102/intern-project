import axios, { AxiosRequestConfig } from 'axios';

const CHAT_API_BASE_URL = 'http://localhost:8083';

interface ConversationData {
  name: string;
  participants: number[];
}

// Tạo instance axios với interceptor để thêm token
const chatApi = axios.create({
  baseURL: CHAT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
chatApi.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API calls
export const chatApiService = {
  // Lấy danh sách tin nhắn của một conversation
  getMessages: async (conversationId: number): Promise<any> => {
    try {
      const response = await chatApi.get(`/messages?conversationId=${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Tạo tin nhắn mới
  createMessage: async (conversationId: number, message: string): Promise<any> => {
    try {
      const response = await chatApi.post('/messages/create', {
        conversationId,
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  // Lấy danh sách conversation
  getConversations: async (): Promise<any> => {
    try {
      const response = await chatApi.get('/conversations');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Tạo conversation mới
  createConversation: async (conversationData: ConversationData): Promise<any> => {
    try {
      const response = await chatApi.post('/conversations/create', conversationData);
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
};

export default chatApiService;

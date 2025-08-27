import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  Input, 
  Button, 
  List, 
  Avatar, 
  Typography, 
  Space, 
  Card, 
  Badge, 
  Alert, 
  Spin, 
  message,
  Divider,
  Tooltip,
  Tag,
  Select
} from 'antd';
import { 
  SendOutlined, 
  UserOutlined, 
  MessageOutlined, 
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  SmileOutlined,
  PaperClipOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';
import chatApiService from '../../services/chatApi';
import chatWebSocketService from '../../services/chatWebSocket';
import ChatMessage from './ChatMessage';
import ConversationItem from './ConversationItem';
import './Chat.css';

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface Conversation {
  id: number;
  conversationName: string;
  conversationAvatar?: string;
  participants?: any[];
}

interface Message {
  id: number;
  conversationId: number;
  me: boolean;
  content: string;
  timestamp: string;
}

interface TypingData {
  conversationId: number;
  userId: number;
}

interface ChatBoxProps {
    onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<TypingData[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
    return () => {
      chatWebSocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const initializeChat = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await chatWebSocketService.connect();
      setWsConnected(true);
      
      chatWebSocketService.onConnectionChange((isConnected: boolean) => {
        setWsConnected(isConnected);
        if (isConnected) {
          message.success('Real-time chat connected');
        } else {
          message.warning('Chat connection lost');
        }
      });

      chatWebSocketService.onMessage((newMessage: Message) => {
        if (currentConversation && newMessage.conversationId === currentConversation.id) {
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (!exists) {
              return [...prev, newMessage];
            }
            return prev;
          });
          scrollToBottom();
        }
      });

      chatWebSocketService.onTyping((data: TypingData) => {
        if (data.conversationId === currentConversation?.id) {
          setTypingUsers(prev => [...prev.filter(u => u.userId !== data.userId), data]);
        }
      });

      chatWebSocketService.onStopTyping((data: TypingData) => {
        if (data.conversationId === currentConversation?.id) {
          setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
        }
      });

      await loadConversations();
      
    } catch (error) {
      console.error('Error initializing chat:', error);
      message.error('Could not connect to chat');
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async (): Promise<void> => {
    try {
      const response = await chatApiService.getConversations();
      if (response.code === 1000) {
        setConversations(response.data || []);
        if (response.data && response.data.length > 0) {
            handleConversationSelect(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      message.error('Could not load conversations');
    }
  };

  const loadMessages = async (conversationId: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await chatApiService.getMessages(conversationId);
      if (response.code === 1000) {
        setMessages(response.data || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      message.error('Could not load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation: Conversation): void => {
    if (currentConversation) {
      chatWebSocketService.leaveConversation(currentConversation.id);
    }
    
    setCurrentConversation(conversation);
    setMessages([]);
    setTypingUsers([]);
    
    chatWebSocketService.joinConversation(conversation.id);
    
    loadMessages(conversation.id);
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!messageInput.trim() || !currentConversation) return;

    try {
      const messageData = chatWebSocketService.sendMessage(
        currentConversation.id, 
        messageInput.trim()
      );
      
      const response = await chatApiService.createMessage(
        currentConversation.id, 
        messageInput.trim()
      );
      
      if (response.code === 1000) {
        setMessageInput('');
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        chatWebSocketService.sendStopTyping(currentConversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Could not send message');
    }
  };

  const handleTyping = (): void => {
    if (!currentConversation) return;
    
    chatWebSocketService.sendTyping(currentConversation.id);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      chatWebSocketService.sendStopTyping(currentConversation.id);
    }, 2000);
  };

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={chatBoxRef}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        height: '600px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
        <Header style={{ 
            background: '#fff', 
            borderBottom: '1px solid #f0f0f0',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <Select
                style={{ width: '100%' }}
                placeholder="Select a conversation"
                onChange={(value) => {
                    const selectedConv = conversations.find(c => c.id === value);
                    if(selectedConv) {
                        handleConversationSelect(selectedConv);
                    }
                }}
                value={currentConversation?.id}
            >
                {conversations.map(c => <Option key={c.id} value={c.id}>{c.conversationName}</Option>)}
            </Select>
            <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        </Header>
        <Content style={{ 
            padding: '16px', 
            background: '#f5f5f5',
            flex: 1,
            overflowY: 'auto'
        }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {messages.map((msg, index) => (
                        <ChatMessage
                        key={msg.id || index}
                        message={msg}
                        isOwnMessage={msg.me}
                        />
                    ))}
                    {typingUsers.length > 0 && (
                        <div style={{ fontStyle: 'italic', color: '#999'}}>Typing...</div>
                    )}
                    <div ref={messagesEndRef} />
                </>
            )}
        </Content>
        <div style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
            <TextArea
                value={messageInput}
                onChange={(e) => {
                setMessageInput(e.target.value);
                handleTyping();
                }}
                placeholder="Type a message..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
                }}
            />
            <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                style={{ marginTop: '8px', width: '100%' }}
            >
                Send
            </Button>
        </div>
    </div>
  );
};

export default ChatBox;
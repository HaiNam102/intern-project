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
  Tag
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
  InfoCircleOutlined
} from '@ant-design/icons';
import chatApiService from '../../services/chatApi';
import chatWebSocketService from '../../services/chatWebSocket';
import ChatMessage from './ChatMessage';
import ConversationItem from './ConversationItem';
import './Chat.css';

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    initializeChat();
    return () => {
      chatWebSocketService.disconnect();
    };
  }, []);

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // Kết nối WebSocket
      await chatWebSocketService.connect();
      setWsConnected(true);
      
      // Đăng ký các event handlers
      chatWebSocketService.onConnectionChange((isConnected) => {
        setWsConnected(isConnected);
        if (isConnected) {
          message.success('Đã kết nối chat realtime');
        } else {
          message.warning('Mất kết nối chat');
        }
      });

      chatWebSocketService.onMessage((newMessage) => {
        console.log('Received real-time message:', newMessage);
        
        // Only add message if it's for the current conversation
        if (currentConversation && newMessage.conversationId === currentConversation.id) {
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (!exists) {
              return [...prev, newMessage];
            }
            return prev;
          });
          scrollToBottom();
        }
      });

      chatWebSocketService.onTyping((data) => {
        if (data.conversationId === currentConversation?.id) {
          setTypingUsers(prev => [...prev.filter(u => u.userId !== data.userId), data]);
        }
      });

      chatWebSocketService.onStopTyping((data) => {
        if (data.conversationId === currentConversation?.id) {
          setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
        }
      });

      // Load conversations
      await loadConversations();
      
    } catch (error) {
      console.error('Error initializing chat:', error);
      message.error('Không thể kết nối chat');
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await chatApiService.getConversations();
      if (response.code === 1000) {
        setConversations(response.data || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      message.error('Không thể tải danh sách cuộc trò chuyện');
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoading(true);
      const response = await chatApiService.getMessages(conversationId);
      if (response.code === 1000) {
        setMessages(response.data || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      message.error('Không thể tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation) => {
    // Leave previous conversation if any
    if (currentConversation) {
      chatWebSocketService.leaveConversation(currentConversation.id);
    }
    
    setCurrentConversation(conversation);
    setMessages([]);
    setTypingUsers([]);
    
    // Join new conversation via WebSocket
    chatWebSocketService.joinConversation(conversation.id);
    
    // Load messages
    loadMessages(conversation.id);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentConversation) return;

    try {
      // Send message via WebSocket for real-time
      const messageData = chatWebSocketService.sendMessage(
        currentConversation.id, 
        messageInput.trim()
      );
      
      // Also send via API to persist in database
      const response = await chatApiService.createMessage(
        currentConversation.id, 
        messageInput.trim()
      );
      
      if (response.code === 1000) {
        setMessageInput('');
        // Clear typing indicator
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        chatWebSocketService.sendStopTyping(currentConversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Không thể gửi tin nhắn');
    }
  };

  const handleTyping = () => {
    if (!currentConversation) return;
    
    chatWebSocketService.sendTyping(currentConversation.id);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      chatWebSocketService.sendStopTyping(currentConversation.id);
    }, 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.conversationName?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Layout style={{ height: '100vh' }}>
      {/* Sidebar - Danh sách cuộc trò chuyện */}
      <Sider width={350} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '16px' }}>
          <Title level={4} style={{ margin: '0 0 16px 0' }}>
            <MessageOutlined style={{ marginRight: '8px' }} />
            Tin nhắn
          </Title>
          
          {/* Search */}
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: '16px' }}
          />

          {/* WebSocket Status */}
          <Alert
            message={wsConnected ? "Đã kết nối realtime" : "Đang kết nối..."}
            type={wsConnected ? "success" : "warning"}
            showIcon
            style={{ marginBottom: '16px' }}
          />

          {/* Conversations List */}
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={currentConversation?.id === conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                unreadCount={0} // Có thể thêm logic đếm tin nhắn chưa đọc
              />
            ))}
          </div>
        </div>
      </Sider>

      {/* Main Content - Chat Area */}
      <Layout>
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <Header style={{ 
              background: '#fff', 
              borderBottom: '1px solid #f0f0f0',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  size={40}
                  src={currentConversation.conversationAvatar}
                  icon={<UserOutlined />}
                  style={{ marginRight: '12px' }}
                />
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    {currentConversation.conversationName}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {currentConversation.participants?.length || 0} người tham gia
                  </Text>
                </div>
              </div>
              
              <Space>
                <Tooltip title="Gọi thoại">
                  <Button type="text" icon={<PhoneOutlined />} />
                </Tooltip>
                <Tooltip title="Gọi video">
                  <Button type="text" icon={<VideoCameraOutlined />} />
                </Tooltip>
                <Tooltip title="Thông tin">
                  <Button type="text" icon={<InfoCircleOutlined />} />
                </Tooltip>
                <Button type="text" icon={<MoreOutlined />} />
              </Space>
            </Header>

            {/* Messages Area */}
            <Content style={{ 
              padding: '24px', 
              background: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                flex: 1, 
                overflowY: 'auto',
                padding: '16px',
                background: '#fff',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '16px' }}>Đang tải tin nhắn...</div>
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
                    
                    {/* Typing indicator */}
                    {typingUsers.length > 0 && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          background: '#f0f0f0',
                          padding: '12px 16px',
                          borderRadius: '18px',
                          fontSize: '12px',
                          color: '#666'
                        }}>
                          <Text>Đang nhập tin nhắn...</Text>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <Card style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <TextArea
                      value={messageInput}
                      onChange={(e) => {
                        setMessageInput(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Nhập tin nhắn..."
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      onPressEnter={(e) => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <Space>
                    <Tooltip title="Gửi file">
                      <Button type="text" icon={<PaperClipOutlined />} />
                    </Tooltip>
                    <Tooltip title="Emoji">
                      <Button type="text" icon={<SmileOutlined />} />
                    </Tooltip>
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                    >
                      Gửi
                    </Button>
                  </Space>
                </div>
              </Card>
            </Content>
          </>
        ) : (
          // Empty state
          <Content style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#f5f5f5'
          }}>
            <div style={{ textAlign: 'center' }}>
              <MessageOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Title level={3} style={{ color: '#666', marginBottom: '8px' }}>
                Chọn cuộc trò chuyện
              </Title>
              <Text type="secondary">
                Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu chat
              </Text>
            </div>
          </Content>
        )}
      </Layout>
    </Layout>
  );
};

export default Chat; 
import React from 'react';
import { Avatar, Typography, Space, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Message {
  message: string;
  createdDate: string;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatus = (message: Message): string => {
    // Có thể thêm logic để hiển thị trạng thái tin nhắn (đã gửi, đã đọc, v.v.)
    return 'sent';
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        animation: 'fadeIn 0.3s ease-in'
      }}
    >
      <div style={{
        maxWidth: '70%',
        display: 'flex',
        flexDirection: isOwnMessage ? 'row-reverse' : 'row',
        alignItems: 'flex-end'
      }}>
        <Avatar 
          size={32}
          icon={<UserOutlined />}
          style={{ 
            margin: isOwnMessage ? '0 0 0 8px' : '0 8px 0 0'
          }}
        />
        <div style={{
          background: isOwnMessage ? '#1890ff' : '#f0f0f0',
          color: isOwnMessage ? '#fff' : '#000',
          padding: '12px 16px',
          borderRadius: '18px',
          maxWidth: '100%',
          wordBreak: 'break-word',
          position: 'relative'
        }}>
          <div style={{ marginBottom: '4px' }}>
            {message.message}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
            gap: '4px'
          }}>
            <Text 
              style={{
                fontSize: '11px',
                opacity: 0.7,
                color: isOwnMessage ? '#fff' : '#666'
              }}
            >
              {formatTime(message.createdDate)}
            </Text>
            
            {isOwnMessage && (
              <Space size={2}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: getMessageStatus(message) === 'read' ? '#52c41a' : '#d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#fff'
                  }} />
                </div>
              </Space>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;


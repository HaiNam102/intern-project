import React from 'react';
import { Avatar, Typography, Tag, Badge } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ConversationItem = ({ conversation, isSelected, onClick, unreadCount = 0 }) => {
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

  const getConversationIcon = (type) => {
    return type === 'GROUP' ? <TeamOutlined /> : <UserOutlined />;
  };

  const getConversationColor = (type) => {
    return type === 'GROUP' ? 'blue' : 'green';
  };

  return (
    <div
      style={{
        padding: '12px',
        cursor: 'pointer',
        backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
        borderRadius: '8px',
        marginBottom: '4px',
        border: isSelected ? '1px solid #1890ff' : '1px solid transparent',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isSelected ? '#f0f8ff' : '#f5f5f5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isSelected ? '#f0f8ff' : 'transparent';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Badge count={unreadCount} size="small" offset={[-5, 5]}>
          <Avatar 
            size={48}
            src={conversation.conversationAvatar}
            icon={getConversationIcon(conversation.type)}
            style={{
              border: `2px solid ${getConversationColor(conversation.type)}`,
              background: isSelected ? '#1890ff' : undefined
            }}
          />
        </Badge>
        
        <div style={{ 
          flex: 1, 
          marginLeft: '12px',
          minWidth: 0 // Để text có thể truncate
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <Text 
              strong 
              style={{ 
                fontSize: '14px',
                color: isSelected ? '#1890ff' : '#000',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px'
              }}
            >
              {conversation.conversationName}
            </Text>
            <Tag 
              color={getConversationColor(conversation.type)} 
              size="small"
              style={{ flexShrink: 0 }}
            >
              {conversation.type}
            </Tag>
          </div>
          
          <div style={{ marginBottom: '2px' }}>
            <Text 
              type="secondary" 
              style={{ 
                fontSize: '12px',
                display: 'block'
              }}
            >
              {conversation.participants?.length || 0} người tham gia
            </Text>
          </div>
          
          <Text 
            type="secondary" 
            style={{ 
              fontSize: '11px',
              color: isSelected ? '#1890ff' : '#666'
            }}
          >
            {formatDate(conversation.modifiedDate)}
          </Text>
        </div>
      </div>
      
      {/* Online indicator for direct messages */}
      {conversation.type === 'DIRECT' && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#52c41a',
          border: '2px solid #fff'
        }} />
      )}
    </div>
  );
};

export default ConversationItem; 
import React from 'react';

const NotificationToast = ({ message, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div style={{ marginRight: '20px' }}>{message}</div>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default NotificationToast;
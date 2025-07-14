import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Chat = () => {
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const stompClient = useRef(null);

  const connect = () => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8083/websocket'),
      onConnect: () => {
        setConnected(true);

        // Subscribe to the topic
        client.subscribe('/topic/public', (msg) => {
          const message = JSON.parse(msg.body);
          setChatMessages((prev) => [...prev, message]);
        });

        // Send JOIN message
        client.publish({
          destination: '/app/chat.register',
          body: JSON.stringify({
            sender: username,
            type: 'JOIN'
          })
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onError: (error) => {
        console.error('STOMP error:', error);
        setConnected(false);
      }
    });

    stompClient.current = client;
    client.activate();
  };

  const sendMessage = () => {
    if (stompClient.current && message.trim()) {
      stompClient.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({
          sender: username,
          content: message,
          type: 'CHAT'
        })
      });
      setMessage('');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded mt-10">
      {!connected ? (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={connect}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <>
          <div className="h-64 overflow-y-scroll border p-4 rounded mb-4 bg-gray-50">
            {chatMessages.map((msg, idx) => (
              <p key={idx} className="mb-1">
                {msg.type === 'JOIN' && <em>{msg.sender} joined the chat</em>}
                {msg.type === 'LEAVE' && <em>{msg.sender} left the chat</em>}
                {msg.type === 'CHAT' && <strong>{msg.sender}:</strong>} {msg.type === 'CHAT' && msg.content}
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow border p-2 rounded"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;

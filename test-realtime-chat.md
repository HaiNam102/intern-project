# Test Real-time Chat Functionality

## Prerequisites

1. **Start the required services:**
   ```bash
   # Start MySQL database
   # Start User Service (port 8081)
   # Start Chat Message Service (port 8083)
   # Start Frontend (port 3000)
   ```

2. **Verify services are running:**
   - User Service: http://localhost:8081
   - Chat Message Service: http://localhost:8083
   - Socket.IO Server: http://localhost:8099
   - Frontend: http://localhost:3000

## Testing Steps

### 1. Test WebSocket Connection

Open browser console and run:
```javascript
// Test WebSocket connection
import { testWebSocketConnection } from './src/utils/websocketTest.js';
testWebSocketConnection()
  .then(() => console.log('✅ WebSocket connection successful'))
  .catch(error => console.error('❌ WebSocket connection failed:', error));
```

### 2. Test Real-time Message Sending

```javascript
// Test sending a message
import { testChatMessage } from './src/utils/websocketTest.js';
testChatMessage(1, "Hello from test!")
  .then(data => console.log('✅ Message sent and received:', data))
  .catch(error => console.error('❌ Message test failed:', error));
```

### 3. Manual Testing Steps

1. **Login to the application**
2. **Navigate to Chat section**
3. **Check WebSocket connection status** (should show "Đã kết nối realtime")
4. **Select a conversation**
5. **Send a message**
6. **Open another browser/tab and login with different user**
7. **Join the same conversation**
8. **Verify real-time message delivery**

### 4. Expected Behavior

✅ **Real-time Features Working:**
- WebSocket connection established
- Messages appear instantly without page refresh
- Typing indicators show when users are typing
- Messages are persisted in database
- Multiple users can chat simultaneously

❌ **Common Issues to Check:**
- CORS errors in browser console
- Socket.IO connection errors
- Authentication token issues
- Database connection problems

## Debug Commands

### Check Socket.IO Server Logs
```bash
# Look for these log messages:
# "Socket server started on port 8099"
# "Client connected: [session-id]"
# "Client joining conversation: [conversation-id]"
# "Message broadcasted to conversation [id]: [message]"
```

### Check Frontend Console
```javascript
// Check WebSocket connection status
console.log(chatWebSocketService.getConnectionStatus());

// Check current conversation
console.log(currentConversation);

// Check messages state
console.log(messages);
```

### Test API Endpoints
```bash
# Test conversation list
curl -H "Authorization: Bearer [token]" http://localhost:8083/conversations

# Test messages for conversation
curl -H "Authorization: Bearer [token]" http://localhost:8083/messages?conversationId=1

# Test sending message
curl -X POST -H "Authorization: Bearer [token]" -H "Content-Type: application/json" \
  -d '{"conversationId": 1, "message": "Test message"}' \
  http://localhost:8083/messages/create
```

## Troubleshooting

### WebSocket Connection Issues
1. Check if Socket.IO server is running on port 8099
2. Verify CORS configuration allows frontend origin
3. Check authentication token is valid
4. Check browser console for connection errors

### Message Not Appearing
1. Check if user is in the correct conversation room
2. Verify message is being saved to database
3. Check Socket.IO event handlers are properly registered
4. Verify message format matches expected structure

### Typing Indicators Not Working
1. Check typing event handlers are registered
2. Verify typing timeout is working correctly
3. Check if other users are receiving typing events

## Performance Testing

### Load Testing
```javascript
// Test multiple concurrent users
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    testChatMessage(1, `Message from user ${i}`);
  }, i * 1000);
}
```

### Memory Testing
- Monitor WebSocket connections
- Check for memory leaks in long-running sessions
- Verify proper cleanup on disconnect

## Security Testing

1. **Authentication:**
   - Test with invalid token
   - Test with expired token
   - Test without token

2. **Authorization:**
   - Test accessing conversations user doesn't belong to
   - Test sending messages to unauthorized conversations

3. **Input Validation:**
   - Test with very long messages
   - Test with special characters
   - Test with XSS attempts

## Success Criteria

✅ **Real-time chat is working when:**
- Messages appear instantly for all users in conversation
- Typing indicators work correctly
- WebSocket connection status shows as connected
- Messages are persisted in database
- No console errors related to WebSocket
- Multiple users can chat simultaneously
- Connection reconnects automatically if lost 
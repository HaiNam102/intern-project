package com.example.chat_message.Controller;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import com.example.chat_message.Dto.ApiResponse;
import com.example.chat_message.Dto.Response.UserResponse;
import com.example.chat_message.Model.WebSocketSession;
import com.example.chat_message.Repository.httpClient.UserClient;
import com.example.chat_message.Service.WebSocketSessionService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketHandler {
    SocketIOServer server;
    UserClient userClient;
    WebSocketSessionService webSocketSessionService;
    
    // Map to store user's current conversation
    Map<String, String> userConversations = new HashMap<>();

    @OnConnect
    public void clientConnected(SocketIOClient client) {
        String token = client.getHandshakeData().getHttpHeaders().get("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            client.disconnect(); // Ngắt kết nối nếu không có token hoặc sai định dạng
            log.info("Client disconnected due to invalid token: {}", client.getSessionId());
            return;
        }

        try {
            ApiResponse<UserResponse> user = userClient.getUserByToken(token);
            // Persist webSocketSession
            WebSocketSession webSocketSession = WebSocketSession.builder()
                    .socketSessionId(client.getSessionId().toString())
                    .userId(user.getData().getUserId())
                    .createdAt(Instant.now())
                    .build();
            webSocketSession = webSocketSessionService.create(webSocketSession);

            log.info("WebSocketSession created with id: {} for user: {}", webSocketSession.getId(), user.getData().getUserId());
        } catch (Exception e) {
            log.error("Error creating WebSocket session: {}", e.getMessage());
            client.disconnect();
        }
    }

    @OnDisconnect
    public void clientDisconnected(SocketIOClient client) {
        log.info("Client disconnected: {}", client.getSessionId());
        webSocketSessionService.deleteSession(client.getSessionId().toString());
        // Remove from user conversations map
        userConversations.remove(client.getSessionId().toString());
    }

    @OnEvent("send_message")
    public void handleSendMessage(SocketIOClient client, Map<String, Object> data) {
        try {
            String conversationId = (String) data.get("conversationId");
            String message = (String) data.get("message");
            
            log.info("Received message from client {}: {} in conversation {}", 
                    client.getSessionId(), message, conversationId);
            
            // Broadcast message to all clients in the same conversation
            server.getRoomOperations(conversationId).sendEvent("message", data);
            
        } catch (Exception e) {
            log.error("Error handling send_message: {}", e.getMessage());
        }
    }

    @OnEvent("join_conversation")
    public void handleJoinConversation(SocketIOClient client, Map<String, Object> data) {
        try {
            String conversationId = (String) data.get("conversationId");
            
            log.info("Client {} joining conversation: {}", client.getSessionId(), conversationId);
            
            // Join the room
            client.joinRoom(conversationId);
            
            // Store user's current conversation
            userConversations.put(client.getSessionId().toString(), conversationId);
            
            // Notify other users in the conversation
            Map<String, Object> message = new HashMap<>();
            message.put("userId", client.getSessionId().toString());
            message.put("conversationId", conversationId);

            server.getRoomOperations(conversationId).sendEvent("user_joined", message);


        } catch (Exception e) {
            log.error("Error handling join_conversation: {}", e.getMessage());
        }
    }

    @OnEvent("leave_conversation")
    public void handleLeaveConversation(SocketIOClient client, Map<String, Object> data) {
        try {
            String conversationId = (String) data.get("conversationId");
            
            log.info("Client {} leaving conversation: {}", client.getSessionId(), conversationId);
            
            // Leave the room
            client.leaveRoom(conversationId);
            
            // Remove from user conversations map
            userConversations.remove(client.getSessionId().toString());
            
            // Notify other users in the conversation
            Map<String, Object> message = new HashMap<>();
            message.put("userId", client.getSessionId().toString());
            message.put("conversationId", conversationId);

            server.getRoomOperations(conversationId).sendEvent("user_left", message);

            
        } catch (Exception e) {
            log.error("Error handling leave_conversation: {}", e.getMessage());
        }
    }

    @OnEvent("typing")
    public void handleTyping(SocketIOClient client, Map<String, Object> data) {
        try {
            String conversationId = (String) data.get("conversationId");
            
            log.info("Client {} typing in conversation: {}", client.getSessionId(), conversationId);
            
            // Broadcast typing notification to other users in the conversation
            Map<String, Object> message = new HashMap<>();
            message.put("userId", client.getSessionId().toString());
            message.put("conversationId", conversationId);

            server.getRoomOperations(conversationId).sendEvent("typing", message);


        } catch (Exception e) {
            log.error("Error handling typing: {}", e.getMessage());
        }
    }

    @OnEvent("stop_typing")
    public void handleStopTyping(SocketIOClient client, Map<String, Object> data) {
        try {
            String conversationId = (String) data.get("conversationId");
            
            log.info("Client {} stopped typing in conversation: {}", client.getSessionId(), conversationId);
            
            // Broadcast stop typing notification to other users in the conversation
            Map<String, Object> message = new HashMap<>();
            message.put("userId", client.getSessionId().toString());
            message.put("conversationId", conversationId);

            server.getRoomOperations(conversationId).sendEvent("stop_typing", message);

            
        } catch (Exception e) {
            log.error("Error handling stop_typing: {}", e.getMessage());
        }
    }

    @PostConstruct
    public void startServer() {
        server.start();
        server.addListeners(this);
        log.info("Socket server started on port 8099");
    }

    @PreDestroy
    public void stopServer() {
        server.stop();
        log.info("Socket server stopped");
    }
}





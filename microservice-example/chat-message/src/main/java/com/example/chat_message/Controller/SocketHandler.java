package com.example.chat_message.Controller;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
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

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketHandler {
    SocketIOServer server;
    //    IdentityService identityService;
    UserClient userClient;
    WebSocketSessionService webSocketSessionService;

    @OnConnect
    public void clientConnected(SocketIOClient client) {
        String token = client.getHandshakeData().getHttpHeaders().get("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            client.disconnect(); // Ngắt kết nối nếu không có token hoặc sai định dạng
            log.info("Client connected: {}", client.getSessionId());
            return;
        }

        ApiResponse<UserResponse> user = userClient.getUserByToken(token);
        // Persist webSocketSession
        WebSocketSession webSocketSession = WebSocketSession.builder()
                .socketSessionId(client.getSessionId().toString())
                .userId(user.getData().getUserId())
                .createdAt(Instant.now())
                .build();
        webSocketSession = webSocketSessionService.create(webSocketSession);

        log.info("WebSocketSession created with id: {}", webSocketSession.getId());
    }

    @OnDisconnect
    public void clientDisconnected(SocketIOClient client) {
        log.info("Client disConnected: {}", client.getSessionId());
        webSocketSessionService.deleteSession(client.getSessionId().toString());
    }

    @PostConstruct
    public void startServer() {
        server.start();
        server.addListeners(this);
        log.info("Socket server started");
    }

    @PreDestroy
    public void stopServer() {
        server.stop();
        log.info("Socket server stoped");
    }
}





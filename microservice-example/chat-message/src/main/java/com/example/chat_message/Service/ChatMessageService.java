package com.example.chat_message.Service;

import com.example.chat_message.Dto.ApiResponse;
import com.example.chat_message.Dto.Request.ChatMessageRequest;
import com.example.chat_message.Dto.Response.ChatMessageResponse;
import com.example.chat_message.Dto.Response.UserResponse;
import com.example.chat_message.Mapper.ChatMessageMapper;
import com.example.chat_message.Model.ChatMessage;
import com.example.chat_message.Model.Conversation;
import com.example.chat_message.Model.WebSocketSession;
import com.example.chat_message.Repository.ChatMessageRepository;
import com.example.chat_message.Repository.ConversationRepository;
import com.example.chat_message.Repository.WebSocketSessionRepository;
import com.example.chat_message.Repository.httpClient.UserClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import com.corundumstudio.socketio.SocketIOServer;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatMessageService {
    WebSocketSessionRepository webSocketSessionRepository;
    ChatMessageRepository chatMessageRepository;
    ConversationRepository conversationRepository;
    UserClient profileClient;
    ChatMessageMapper chatMessageMapper;
    SocketIOServer socketIOServer;
    ObjectMapper objectMapper;

    public List<ChatMessageResponse> getMessages(Long conversationId, String authHeader) {
        Conversation conversation = conversationRepository.findById(conversationId).
                orElseThrow(() -> new RuntimeException("Not found"));
        String token = authHeader.replace("Bearer ", "");
        ApiResponse<UserResponse> user = profileClient.getUserByToken(token);

//        if(!conversation.getUsers().contains(user.getData().getUserId().toString())){
//            throw new RuntimeException("No auth");
//        }
        
        List<ChatMessage> chatMessages = chatMessageRepository.findAllByConversationIdOrderByCreatedDateDesc(conversationId);
        List<ChatMessageResponse> chatMessageResponse = chatMessages.stream()
                .map(chatMessageMapper::toChatMessageResponse)
                .toList();
        return chatMessageResponse;
    }

    public ChatMessageResponse create(ChatMessageRequest request,String authHeader) throws JsonProcessingException {
        ApiResponse<UserResponse> user = profileClient.getUserByToken(authHeader);
        Long userId = user.getData().getUserId();
        // Validate conversationId
        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new RuntimeException("CONVERSATION_NOT_FOUND"));

        UserResponse foundParticipant = null;
        List<Long> participantIds = conversation.getUsers();
        for (Long participantId : participantIds) {
            if (userId.equals(participantId)) {
                ApiResponse<UserResponse> userResponse = profileClient.getUserByToken1(userId);
                foundParticipant = userResponse.getData();
                break;
            }
        }
        if (foundParticipant == null) {
            throw new RuntimeException("Không tìm thấy người tham gia với userId: " + userId);
        }

        if (Objects.isNull(user)) {
            throw new RuntimeException("UNCATEGORIZED_EXCEPTION");
        }
        // Build Chat message Info
        ChatMessage chatMessage = chatMessageMapper.toChatMessage(request);
        chatMessage.setUser_id(foundParticipant.getUserId());
        chatMessage.setTimestamp(Instant.now());

        // Create chat message
        chatMessage = chatMessageRepository.save(chatMessage);

        // Convert to Response
        ChatMessageResponse chatMessageResponse = chatMessageMapper.toChatMessageResponse(chatMessage);
        
        // Broadcast message via Socket.IO to all participants in the conversation
        try {
            String conversationId = request.getConversationId().toString();
            
            // Create message data for Socket.IO
            Map<String, Object> messageData = Map.of(
                "id", chatMessageResponse.getId(),
                "conversationId", chatMessageResponse.getConversationId(),
                "message", chatMessageResponse.getMessage(),
                "userId", chatMessageResponse.getSender(),
                "timestamp", chatMessageResponse.getCreatedDate(),
                "me", false // Will be set to true for the sender
            );
            
            // Broadcast to all clients in the conversation room
            socketIOServer.getRoomOperations(conversationId).sendEvent("message", messageData);
            
            log.info("Message broadcasted to conversation {}: {}", conversationId, chatMessageResponse.getMessage());
            
        } catch (Exception e) {
            log.error("Error broadcasting message via Socket.IO: {}", e.getMessage());
        }

        return chatMessageResponse;
    }
}

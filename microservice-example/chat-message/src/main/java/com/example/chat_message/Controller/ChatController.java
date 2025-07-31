package com.example.chat_message.Controller;

import com.example.chat_message.Dto.ApiResponse;
import com.example.chat_message.Dto.Request.ChatMessageRequest;
import com.example.chat_message.Dto.Response.ChatMessageResponse;
import com.example.chat_message.Model.ChatMessage;
import com.example.chat_message.Repository.ChatMessageRepository;
import com.example.chat_message.Service.ChatMessageService;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/messages")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {
    ChatMessageService chatMessageService;

    @GetMapping
    ApiResponse<List<ChatMessageResponse>> getMessages(
            @RequestParam("conversationId") Long conversationId,
            @RequestHeader("Authorization") String authHeader) {
        return ApiResponse.<List<ChatMessageResponse>>builder()
                .code(1000)
                .message("get success")
                .data(chatMessageService.getMessages(conversationId,authHeader))
                .build();
    }

    @PostMapping("/create")
    ApiResponse<ChatMessageResponse> create(
            @RequestBody @Valid ChatMessageRequest request,
            @RequestHeader("Authorization") String authHeader ) throws JsonProcessingException {
        return ApiResponse.<ChatMessageResponse>builder()
                .data(chatMessageService.create(request,authHeader))
                .build();
    }
}

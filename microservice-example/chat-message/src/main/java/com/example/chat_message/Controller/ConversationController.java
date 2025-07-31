package com.example.chat_message.Controller;

import com.example.chat_message.Dto.ApiResponse;
import com.example.chat_message.Dto.Request.ConversationRequest;
import com.example.chat_message.Dto.Response.ConversationResponse;
import com.example.chat_message.Dto.Response.UserResponse;
import com.example.chat_message.Repository.httpClient.UserClient;
import com.example.chat_message.Service.ConversationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/conversations")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationController {
    ConversationService conversationService;
    UserClient userClient;

    @PostMapping("/create")
    ApiResponse<ConversationResponse> createConversation(@RequestBody @Valid ConversationRequest request,
                                                         @RequestHeader("Authorization") String authHeader) {
        return ApiResponse.<ConversationResponse>builder()
                .data(conversationService.create(request,authHeader))
                .build();
    }

    @GetMapping("/my-conversations")
    ApiResponse<List<ConversationResponse>> myConversations(@RequestHeader("Authorization") String authHeader) {
        ApiResponse<UserResponse> user = userClient.getUserByToken(authHeader);
        return ApiResponse.<List<ConversationResponse>>builder()
                .data(conversationService.myConversations(user.getData().getUserId()))
                .build();
    }
}

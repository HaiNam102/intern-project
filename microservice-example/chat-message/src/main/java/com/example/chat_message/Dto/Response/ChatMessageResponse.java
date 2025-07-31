package com.example.chat_message.Dto.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageResponse {
    String id;
    Long conversationId;
    boolean me;
    String message;
    Long sender;
    Instant createdDate;
}


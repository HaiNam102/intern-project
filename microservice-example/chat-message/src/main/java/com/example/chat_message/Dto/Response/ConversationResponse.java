package com.example.chat_message.Dto.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationResponse {
    String id;
    String type; // GROUP, DIRECT
    String participantsHash;
    String conversationAvatar;
    String conversationName;
    List<Long> participants;
    Instant createdDate;
    Instant modifiedDate;
}


package com.example.chat_message.Dto.Request;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationRequest {
    String type;

    @Size(min = 1)
    @NotNull
    List<Long> participantIds;
}

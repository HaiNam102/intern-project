package com.example.chat_message.Mapper;


import com.example.chat_message.Dto.Response.ConversationResponse;
import com.example.chat_message.Model.Conversation;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ConversationMapper {
    ConversationResponse toConversationResponse(Conversation conversation);

    List<ConversationResponse> toConversationResponseList(List<Conversation> conversations);
}
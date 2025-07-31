package com.example.chat_message.Mapper;

import com.example.chat_message.Dto.ChatResponse;
import com.example.chat_message.Dto.Request.ChatMessageRequest;
import com.example.chat_message.Dto.Response.ChatMessageResponse;
import com.example.chat_message.Model.ChatMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ChatMessageMapper {
    ChatMessageMapper INSTANCE = Mappers.getMapper(ChatMessageMapper.class);

    @Mapping(source = "user_id",target = "sender")
    @Mapping(source = "timestamp",target = "createdDate")
    ChatMessageResponse toChatMessageResponse(ChatMessage chatMessage);

    @Mapping(source = "conversationId",target = "conversation.id")
    ChatMessage toChatMessage(ChatMessageRequest request);
}

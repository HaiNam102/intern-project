package com.example.chat_message.Mapper;

import com.example.chat_message.Dto.ChatResponse;
import com.example.chat_message.Model.ChatMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ChatMapper {
    ChatMapper INSTANCE = Mappers.getMapper(ChatMapper.class);

    @Mapping(source = "content",target = "message")
    ChatResponse toChatResponse(ChatMessage chatMessage);
}

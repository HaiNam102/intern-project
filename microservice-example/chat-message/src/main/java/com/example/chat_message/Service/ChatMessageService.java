package com.example.chat_message.Service;

import com.example.chat_message.Model.ChatMessage;
import com.example.chat_message.Repository.ChatMessageRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatMessageService {
    ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now().toString());
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getRecentMessages() {
        return chatMessageRepository.findAll();
    }
}

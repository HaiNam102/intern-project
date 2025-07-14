package com.example.chat_message.Repository;

import com.example.chat_message.Model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {

}

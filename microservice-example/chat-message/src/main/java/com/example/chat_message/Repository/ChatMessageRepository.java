package com.example.chat_message.Repository;

import com.example.chat_message.Model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.conversation.id = :conversationId ORDER BY cm.timestamp DESC")
    List<ChatMessage> findAllByConversationIdOrderByCreatedDateDesc(@Param("conversationId") Long conversationId);
}

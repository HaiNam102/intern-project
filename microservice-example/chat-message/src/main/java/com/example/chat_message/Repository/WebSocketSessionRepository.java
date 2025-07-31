package com.example.chat_message.Repository;

import com.example.chat_message.Model.WebSocketSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebSocketSessionRepository extends JpaRepository<WebSocketSession,Long> {
    List<WebSocketSession> findAllByUserIdIn(List<Long> userIds);

    void deleteBySocketSessionId(String socketId);
}

package com.example.chat_message.Repository;

import com.example.chat_message.Model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation,Long> {
    Optional<Conversation> findByParticipantsHash(String participantsHash);

    @Query("SELECT c FROM Conversation c JOIN c.users u WHERE u = :userId")
    List<Conversation> findAllByUsersContaining(@Param("userId") Long userId);
}

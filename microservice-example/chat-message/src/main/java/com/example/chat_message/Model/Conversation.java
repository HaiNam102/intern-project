package com.example.chat_message.Model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Indexed;

import java.time.Instant;
import java.util.List;

@Entity
@Data
@Table(name = "conversation")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversation_id")
    Long id;

    @Column(name = "type")
    String type;

    @Column(name = "participants_hash", unique = true)
    String participantsHash;

    @ElementCollection
    @CollectionTable(name = "conversation_users", joinColumns = @JoinColumn(name = "conversation_id"))
    @Column(name = "user_id")
    List<Long> users;

    Instant createdDate;

    Instant modifiedDate;
}

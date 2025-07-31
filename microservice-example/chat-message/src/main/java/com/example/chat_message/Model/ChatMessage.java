package com.example.chat_message.Model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Entity
@Data
@Table(name = "chat_message")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "conversation_id")
    Conversation conversation;

    @Column(name = "message")
    String message;

    @Column(name = "user_id")
    Long user_id;

    @Column(name = "timestamp")
    Instant timestamp;
}

package com.example.chat_message.Model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "web_socket_session")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WebSocketSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    @Column(name = "socket_session_id")
    String socketSessionId;

    @Column(name = "user_id")
    Long userId;

    @Column(name = "created_at")
    Instant createdAt;
}

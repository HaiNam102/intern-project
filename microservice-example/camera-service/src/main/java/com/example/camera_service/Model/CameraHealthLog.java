package com.example.camera_service.Model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Entity
@Table(name = "camera_health_log")
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CameraHealthLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    Long logId;

    @ManyToOne
    @JoinColumn(name = "camera_id")
    Camera camera;

    @Column(name = "time_stamp")
    Instant timeStamp;

    @Column(name = "is_online")
    Boolean isOnline;

    @Column(name = "fps")
    float fps;

    @Column(name = "resolution")
    String resolution;

    @Column(name = "error_message")
    String errorMessage;
}

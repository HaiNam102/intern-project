package com.example.camera_service.Model;

import com.example.camera_service.Enum.Status;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "camera")
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Camera {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "camera_id")
    Long cameraId;

    @Column(name = "name_camera")
    String nameCamera;

    @Column(name = "location")
    String location;

    @Column(name = "stream_url")
    String streamUrl;

    @Column(name = "status")
    Status status;
}

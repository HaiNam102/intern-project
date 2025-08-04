package com.example.camera_service.Dto.Res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CameraHealthStatusDto {
    private Long cameraId;
    private String cameraName;
    private String streamUrl;
    private boolean isOnline;
    private String errorMessage;
    private String resolution;
    private float fps;
    private Instant timestamp;
    private String status; // ONLINE, OFFLINE, MAINTENANCE
} 
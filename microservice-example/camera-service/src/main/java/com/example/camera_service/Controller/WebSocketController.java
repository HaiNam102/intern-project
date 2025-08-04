package com.example.camera_service.Controller;

import com.example.camera_service.Dto.Res.CameraHealthStatusDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    @MessageMapping("/subscribe-camera-health")
    @SendTo("/topic/camera-health")
    public CameraHealthStatusDto subscribeToCameraHealth(CameraHealthStatusDto message, SimpMessageHeaderAccessor headerAccessor) {
        log.info("Client subscribed to camera health updates: {}", headerAccessor.getSessionId());
        return message;
    }

    @MessageMapping("/subscribe-camera-health-specific")
    @SendTo("/topic/camera-health/{cameraId}")
    public CameraHealthStatusDto subscribeToSpecificCameraHealth(CameraHealthStatusDto message, SimpMessageHeaderAccessor headerAccessor) {
        log.info("Client subscribed to specific camera health updates: {}", headerAccessor.getSessionId());
        return message;
    }
} 
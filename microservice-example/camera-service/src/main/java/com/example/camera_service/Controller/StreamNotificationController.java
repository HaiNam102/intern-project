package com.example.camera_service.Controller;

import com.example.camera_service.Dto.Req.StreamStartRequest;
import com.example.camera_service.Dto.Res.ApiResponse;
import com.example.camera_service.Dto.Res.StreamNotification;
import com.example.camera_service.Dto.Res.UserResponse;
import com.example.camera_service.Repository.httpClient.UserClient;
import com.example.camera_service.Service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@RequiredArgsConstructor
public class StreamNotificationController {
    EmailService emailService;
    UserClient userClient;

    @MessageMapping("/stream/start")
    @SendTo("/topic/stream-notifications")
    public StreamNotification handleStreamStart(StreamStartRequest streamStartRequest) {
        ApiResponse<UserResponse> userResponseApiResponse = userClient.getUserByToken("Bearer "  + streamStartRequest.getToken());
        String email = userResponseApiResponse.getData().getEmail();
        emailService.sendStreamStartNotification(email);
        return new StreamNotification("Stream started and notification sent");
    }
}

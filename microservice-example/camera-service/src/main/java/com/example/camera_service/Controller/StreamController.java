package com.example.camera_service.Controller;

import com.example.camera_service.Dto.Res.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stream")
@RequiredArgsConstructor
public class StreamController {

    @GetMapping("/test")
    public ApiResponse<String> testConnection() {
        return ApiResponse.<String>builder()
                .code(200)
                .message("WebSocket endpoint is available at ws://localhost:8084/stream")
                .data("OK")
                .build();
    }

    @GetMapping("/status")
    public ApiResponse<String> getStatus() {
        return ApiResponse.<String>builder()
                .code(200)
                .message("Camera service is running")
                .data("OK")
                .build();
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}

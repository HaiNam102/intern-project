package com.example.camera_service.Controller;


import com.example.camera_service.Dto.Req.CameraReq;
import com.example.camera_service.Dto.Res.ApiResponse;
import com.example.camera_service.Dto.Res.CameraStatisticsDto;
import com.example.camera_service.Dto.Res.CameraHealthStatusDto;
import com.example.camera_service.Model.Camera;
import java.time.Instant;
import com.example.camera_service.Service.CameraHealthService;
import com.example.camera_service.Service.CameraService;
import com.example.camera_service.Service.CameraAutoHealthService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CameraController {

    CameraService cameraService;
    CameraHealthService cameraHealthService;
    CameraAutoHealthService cameraAutoHealthService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody CameraReq cameraReq) {
        Camera camera = cameraService.createCamera(cameraReq);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("create success")
                .data(camera)
                .build());
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("get success")
                .data(cameraService.getAllCamera())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("get success")
                .data(cameraService.getCameraById(id))
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CameraReq cameraReq) {
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("create success")
                .data(cameraService.updateCamera(id, cameraReq))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        cameraService.deleteCamera(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("delete success")
                .build());
    }

    @PostMapping("/{id}/check-health")
    public ResponseEntity<?> checkHealth(@PathVariable Long id) {
        cameraHealthService.checkCameraHealth(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("Health check completed")
                .build());
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<?> getCameraStatistics() {
        CameraStatisticsDto statistics = cameraHealthService.getCameraStatistics();
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("Statistics retrieved successfully")
                .data(statistics)
                .build());
    }
    
    @GetMapping("/offline-count")
    public ResponseEntity<?> getOfflineCameraCount() {
        long offlineCount = cameraHealthService.countOfflineCameras();
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("Offline camera count retrieved")
                .data(offlineCount)
                .build());
    }
    
    @PostMapping("/{id}/check-health-now")
    public ResponseEntity<?> checkHealthNow(@PathVariable Long id) {
        cameraAutoHealthService.checkSpecificCamera(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("Health check initiated")
                .build());
    }
    
    @PostMapping("/test-websocket")
    public ResponseEntity<?> testWebSocket() {
        try {
            // Gửi test message qua WebSocket
            CameraHealthStatusDto testDto = CameraHealthStatusDto.builder()
                    .cameraId(999L)
                    .cameraName("Test Camera")
                    .streamUrl("test://url")
                    .isOnline(true)
                    .errorMessage("")
                    .resolution("1920x1080")
                    .fps(30.0f)
                    .timestamp(Instant.now())
                    .status("ONLINE")
                    .build();
            
            // Gửi thông báo test
            cameraHealthService.sendTestWebSocketMessage(testDto);
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(200)
                    .message("Test WebSocket message sent")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(500)
                    .message("Error sending test message: " + e.getMessage())
                    .build());
        }
    }
    
    @PostMapping("/force-refresh-status")
    public ResponseEntity<?> forceRefreshStatus() {
        try {
            // Force refresh tất cả camera
            cameraAutoHealthService.autoCheckAllCameras();
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(200)
                    .message("Force refresh completed")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(500)
                    .message("Error force refresh: " + e.getMessage())
                    .build());
        }
    }
}


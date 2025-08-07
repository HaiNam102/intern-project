package com.example.camera_service.Controller;


import com.example.camera_service.Dto.Req.CameraReq;
import com.example.camera_service.Dto.Res.ApiResponse;
import com.example.camera_service.Dto.Res.CameraStatisticsDto;
import com.example.camera_service.Dto.Res.CameraHealthStatusDto;
import com.example.camera_service.Dto.Res.CameraRes;
import com.example.camera_service.Model.Camera;
import java.time.Instant;
import java.util.Map;
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
        
        // Xóa trạng thái camera khỏi bộ nhớ
        cameraAutoHealthService.removeCameraStatus(id);
        
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
    
    @PostMapping("/test-email-notification")
    public ResponseEntity<?> testEmailNotification() {
        try {
            // Tạo camera test để gửi email
            CameraRes testCamera = CameraRes.builder()
                    .cameraId(999L)
                    .nameCamera("Test Camera")
                    .streamUrl("rtsp://test.url")
                    .location("Test Location")
                    .build();
            
            // Gửi email test
            cameraAutoHealthService.getEmailService().sendCameraOfflineNotification("admin@example.com", testCamera, "Test error message");
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(200)
                    .message("Test email notification sent")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(500)
                    .message("Error sending test email: " + e.getMessage())
                    .build());
        }
    }
    
    @GetMapping("/email-config")
    public ResponseEntity<?> getEmailConfig() {
        try {
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(200)
                    .message("Email configuration retrieved")
                    .data(Map.of(
                        "adminEmails", cameraAutoHealthService.getEmailConfig().getAdminEmails(),
                        "enableEmailNotifications", cameraAutoHealthService.getEmailConfig().isEnableEmailNotifications(),
                        "enableOnlineNotifications", cameraAutoHealthService.getEmailConfig().isEnableOnlineNotifications()
                    ))
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(500)
                    .message("Error getting email config: " + e.getMessage())
                    .build());
        }
    }
    
    @GetMapping("/camera-status")
    public ResponseEntity<?> getCameraStatus() {
        try {
            Map<Long, Boolean> statusMap = cameraAutoHealthService.getCameraStatusMap();
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(200)
                    .message("Camera status retrieved")
                    .data(statusMap)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(500)
                    .message("Error getting camera status: " + e.getMessage())
                    .build());
        }
    }
    
    @DeleteMapping("/{id}/clear-status")
    public ResponseEntity<?> clearCameraStatus(@PathVariable Long id) {
        try {
            cameraAutoHealthService.removeCameraStatus(id);
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(200)
                    .message("Camera status cleared from memory")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(500)
                    .message("Error clearing camera status: " + e.getMessage())
                    .build());
        }
    }
}


package com.example.camera_service.Service;

import com.example.camera_service.Config.EmailConfig;
import com.example.camera_service.Dto.Res.CameraRes;
import com.example.camera_service.Repository.CameraRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CameraAutoHealthService {
    
    CameraService cameraService;
    CameraHealthService cameraHealthService;
    EmailService emailService;
    EmailConfig emailConfig;
    Map<Long, Boolean> cameraPreviousStatus = new ConcurrentHashMap<>();
//    CameraRepository cameraRepository;

    @Scheduled(fixedRate = 5000) // 10 seconds
    public void autoCheckAllCameras() {
        log.info("Bắt đầu kiểm tra sức khỏe tự động cho tất cả camera...");
        
        try {
            List<CameraRes> allCameras = cameraService.getAllCamera();
            
            for (CameraRes camera : allCameras) {
                try {
                    checkCameraHealthSilently(camera);
                } catch (Exception e) {
                    log.error("Lỗi khi kiểm tra camera {}: {}", camera.getNameCamera(), e.getMessage());
                }
            }
            
            log.info("Hoàn thành kiểm tra sức khỏe tự động cho {} camera", allCameras.size());
            
        } catch (Exception e) {
            log.error("Lỗi trong quá trình kiểm tra sức khỏe tự động: {}", e.getMessage());
        }
    }

    private void checkCameraHealthSilently(CameraRes cameraRes) {
        ProcessBuilder pb = new ProcessBuilder(
                "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                "stream=width,height,r_frame_rate", "-of", "default=noprint_wrappers=1",
                cameraRes.getStreamUrl()
        );

        String output = null;
        boolean isOnline = false;
        String errMess = "";
        
        try {
            Process process = pb.start();
            output = new BufferedReader(new InputStreamReader(process.getInputStream()))
                    .lines().collect(Collectors.joining("\n"));
            
            // Kiểm tra xem output có hợp lệ không
            isOnline = !output.isBlank() && output.contains("width=") && output.contains("height=");
            
            if (!isOnline) {
                errMess = "Camera không thể cung cấp RTSP stream";
                log.warn("Camera {} offline: {}", cameraRes.getNameCamera(), errMess);
            }
            
        } catch (IOException e) {
            errMess = "Lỗi kết nối: " + e.getMessage();
            isOnline = false;
            log.warn("Camera {} offline do lỗi kết nối: {}", cameraRes.getNameCamera(), e.getMessage());
        }
        
        // Cập nhật trạng thái camera
        updateCameraStatus(cameraRes, isOnline, errMess);
    }

    private void updateCameraStatus(CameraRes cameraRes, boolean isOnline, String errorMessage) {
        try {
            log.info("Auto check - Cập nhật trạng thái camera {}: {}", cameraRes.getNameCamera(), isOnline ? "ONLINE" : "OFFLINE");
            
            // Lấy trạng thái trước đó của camera
            Boolean previousStatus = cameraPreviousStatus.get(cameraRes.getCameraId());
            
            // Gọi service kiểm tra sức khỏe để cập nhật trạng thái và gửi WebSocket
            cameraHealthService.checkCameraHealth(cameraRes.getCameraId());
            
            // Kiểm tra xem có sự thay đổi trạng thái không
            boolean statusChanged = previousStatus == null || !previousStatus.equals(isOnline);
            
            if (!isOnline) {
                log.info("Camera {} đã được đánh dấu offline", cameraRes.getNameCamera());
                
                // Chỉ gửi email khi camera chuyển từ online sang offline
                if (statusChanged && emailConfig.isEnableEmailNotifications()) {
                    try {
                        for (String email : emailConfig.getAdminEmails()) {
                            emailService.sendCameraOfflineNotification(email, cameraRes, errorMessage);
                            log.info("Đã gửi email thông báo camera {} offline đến {} (trạng thái thay đổi)", cameraRes.getNameCamera(), email);
                        }
                    } catch (Exception e) {
                        log.error("Lỗi khi gửi email thông báo camera {} offline: {}", cameraRes.getNameCamera(), e.getMessage());
                    }
                } else if (!statusChanged) {
                    log.info("Camera {} vẫn offline, không gửi email thông báo", cameraRes.getNameCamera());
                }
            } else {
                log.info("Camera {} đã được đánh dấu online", cameraRes.getNameCamera());
                
                // Chỉ gửi email khi camera chuyển từ offline sang online
                if (statusChanged && emailConfig.isEnableEmailNotifications() && emailConfig.isEnableOnlineNotifications()) {
                    try {
                        for (String email : emailConfig.getAdminEmails()) {
                            emailService.sendCameraOnlineNotification(email, cameraRes);
                            log.info("Đã gửi email thông báo camera {} online đến {} (trạng thái thay đổi)", cameraRes.getNameCamera(), email);
                        }
                    } catch (Exception e) {
                        log.error("Lỗi khi gửi email thông báo camera {} online: {}", cameraRes.getNameCamera(), e.getMessage());
                    }
                } else if (!statusChanged) {
                    log.info("Camera {} vẫn online, không gửi email thông báo", cameraRes.getNameCamera());
                }
            }
            
            // Cập nhật trạng thái hiện tại vào map
            cameraPreviousStatus.put(cameraRes.getCameraId(), isOnline);
            
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật trạng thái camera {}: {}", cameraRes.getNameCamera(), e.getMessage());
        }
    }

    public void checkSpecificCamera(Long cameraId) {
        try {
            CameraRes camera = cameraService.getCameraById(cameraId);
            checkCameraHealthSilently(camera);
        } catch (Exception e) {
            log.error("Lỗi khi kiểm tra camera {}: {}", cameraId, e.getMessage());
        }
    }
    
    public EmailService getEmailService() {
        return emailService;
    }
    
    public EmailConfig getEmailConfig() {
        return emailConfig;
    }
    
    // Method để xóa trạng thái camera khỏi map (khi camera bị xóa)
    public void removeCameraStatus(Long cameraId) {
        cameraPreviousStatus.remove(cameraId);
        log.info("Đã xóa trạng thái camera {} khỏi bộ nhớ", cameraId);
    }
    
    // Method để xem trạng thái hiện tại của tất cả camera
    public Map<Long, Boolean> getCameraStatusMap() {
        return new ConcurrentHashMap<>(cameraPreviousStatus);
    }
} 
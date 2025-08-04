package com.example.camera_service.Service;

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
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CameraAutoHealthService {
    
    CameraService cameraService;
    CameraHealthService cameraHealthService;
    CameraRepository cameraRepository;

    @Scheduled(fixedRate = 10000) // 30 seconds
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
            
            // Gọi service kiểm tra sức khỏe để cập nhật trạng thái và gửi WebSocket
            cameraHealthService.checkCameraHealth(cameraRes.getCameraId());
            
            if (!isOnline) {
                log.info("Camera {} đã được đánh dấu offline", cameraRes.getNameCamera());
            } else {
                log.info("Camera {} đã được đánh dấu online", cameraRes.getNameCamera());
            }
            
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
} 
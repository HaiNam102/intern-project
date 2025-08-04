package com.example.camera_service.Service;

import com.example.camera_service.Dto.Req.CameraReq;
import com.example.camera_service.Dto.Res.CameraHealthStatusDto;
import com.example.camera_service.Dto.Res.CameraRes;
import com.example.camera_service.Dto.Res.CameraStatisticsDto;
import com.example.camera_service.Exception.ApiException;
import com.example.camera_service.Exception.ErrorCode;
import com.example.camera_service.Mapper.CameraMapper;
import com.example.camera_service.Model.Camera;
import com.example.camera_service.Model.CameraHealthLog;
import com.example.camera_service.Repository.CameraHealthLogRepository;
import com.example.camera_service.Repository.CameraRepository;
import com.example.camera_service.Enum.Status;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CameraHealthService {
    CameraHealthLogRepository cameraHealthLogRepository;
    CameraRepository cameraRepository;
    SimpMessagingTemplate simpMessagingTemplate;
    CameraMapper cameraMapper;
    CameraService cameraService;

    public void checkCameraHealth(Long id) {
        log.info("Bắt đầu kiểm tra sức khỏe camera ID: {}", id);
        CameraRes cameraRes = cameraService.getCameraById(id);
        Camera camera = cameraMapper.toCamera(cameraRes);
        log.info("Camera: {} - Stream URL: {}", cameraRes.getNameCamera(), cameraRes.getStreamUrl());

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

            isOnline = !output.isBlank() && output.contains("width=") && output.contains("height=");
            log.info("Camera {} - Output: {} - isOnline: {}", cameraRes.getNameCamera(), output, isOnline);
            
            if (!isOnline) {
                errMess = "Camera không thể cung cấp RTSP stream";
                camera.setStatus(Status.OFFLINE);
                cameraRepository.save(camera);

                long offlineCount = countOfflineCameras();
                log.info("Camera {} offline. Tổng số camera offline: {}", cameraRes.getNameCamera(), offlineCount);

                sendOfflineCameraCount(offlineCount);
            } else {
                camera.setStatus(Status.ONLINE);
                cameraRepository.save(camera);
                log.info("Camera {} online. Đã cập nhật trạng thái.", cameraRes.getNameCamera());
            }
            
        } catch (IOException e) {
            errMess = "Lỗi kết nối: " + e.getMessage();
            isOnline = false;

            camera.setStatus(Status.OFFLINE);
            cameraRepository.save(camera);

            long offlineCount = countOfflineCameras();
            log.info("Camera {} offline do lỗi kết nối. Tổng số camera offline: {}", cameraRes.getNameCamera(), offlineCount);

            sendOfflineCameraCount(offlineCount);
        }

        String resolution = isOnline ? parseResolution(output) : "0x0";
        float fps = isOnline ? parseFps(output) : 0.0f;
        
        CameraHealthLog log1 = CameraHealthLog.builder()
                .camera(camera)
                .errorMessage(errMess)
                .timeStamp(Instant.now())
                .isOnline(isOnline)
                .fps(fps)
                .resolution(resolution)
                .build();

        cameraHealthLogRepository.save(log1);

        CameraHealthStatusDto statusDto = CameraHealthStatusDto.builder()
                .cameraId(cameraRes.getCameraId())
                .cameraName(cameraRes.getNameCamera())
                .streamUrl(cameraRes.getStreamUrl())
                .isOnline(isOnline)
                .errorMessage(errMess)
                .resolution(resolution)
                .fps(fps)
                .timestamp(Instant.now())
                .status(isOnline ? "ONLINE" : "OFFLINE")
                .build();

        try {
            // Gửi thông tin camera health đến tất cả client đang subscribe
            simpMessagingTemplate.convertAndSend("/topic/camera-health", statusDto);
            log.info("Đã gửi thông báo WebSocket cho camera {}: {}", cameraRes.getNameCamera(), isOnline ? "ONLINE" : "OFFLINE");
            
            // Gửi thông tin cụ thể cho camera này
            simpMessagingTemplate.convertAndSend("/topic/camera-health/" + id, statusDto);
            
            // Gửi thông báo về số camera offline
            if (!isOnline) {
                long offlineCount = countOfflineCameras();
                sendOfflineCameraCount(offlineCount);
                log.info("Đã gửi thông báo số camera offline: {}", offlineCount);
            }
            
        } catch (Exception e) {
            log.error("Lỗi khi gửi thông báo WebSocket: {}", e.getMessage());
        }
    }
    
    /**
     * Kiểm tra sức khỏe camera với timeout để tránh treo
     */
    public void checkCameraHealthWithTimeout(Long id) {
        try {
            // Tạo thread riêng để kiểm tra với timeout
            Thread checkThread = new Thread(() -> {
                try {
                    checkCameraHealth(id);
                } catch (Exception e) {
                    log.error("Lỗi khi kiểm tra camera {}: {}", id, e.getMessage());
                }
            });
            
            checkThread.start();
            
            // Timeout sau 10 giây
            checkThread.join(10000);
            
            if (checkThread.isAlive()) {
                checkThread.interrupt();
                log.warn("Timeout khi kiểm tra camera {}", id);
            }
            
        } catch (InterruptedException e) {
            log.error("Thread bị interrupt khi kiểm tra camera {}: {}", id, e.getMessage());
        }
    }
    
    /**
     * Đếm số camera offline
     */
    public long countOfflineCameras() {
        return cameraRepository.countByStatus(Status.OFFLINE);
    }
    
    /**
     * Gửi thông báo về số camera offline qua WebSocket
     */
    private void sendOfflineCameraCount(long offlineCount) {
        try {
            simpMessagingTemplate.convertAndSend("/topic/camera-offline-count", offlineCount);
            log.info("Đã gửi thông báo số camera offline: {}", offlineCount);
        } catch (Exception e) {
            log.error("Lỗi khi gửi thông báo số camera offline: {}", e.getMessage());
        }
    }
    
    /**
     * Gửi test message qua WebSocket
     */
    public void sendTestWebSocketMessage(CameraHealthStatusDto testDto) {
        try {
            simpMessagingTemplate.convertAndSend("/topic/camera-health", testDto);
            log.info("Đã gửi test message qua WebSocket: {}", testDto.getCameraName());
        } catch (Exception e) {
            log.error("Lỗi khi gửi test message: {}", e.getMessage());
        }
    }
    
    /**
     * Lấy thống kê camera
     */
    public CameraStatisticsDto getCameraStatistics() {
        long totalCameras = cameraRepository.count();
        long onlineCameras = cameraRepository.countByStatus(Status.ONLINE);
        long offlineCameras = cameraRepository.countByStatus(Status.OFFLINE);
        long unknownCameras = cameraRepository.countByStatus(Status.UNKNOWN);
        
        return CameraStatisticsDto.builder()
                .totalCameras(totalCameras)
                .onlineCameras(onlineCameras)
                .offlineCameras(offlineCameras)
                .unknownCameras(unknownCameras)
                .build();
    }

    private String parseResolution(String output) {
        String width = output.lines().filter(l -> l.startsWith("width")).findFirst().orElse("width=0").split("=")[1];
        String height = output.lines().filter(l -> l.startsWith("height")).findFirst().orElse("height=0").split("=")[1];
        return width + "x" + height;
    }

    private float parseFps(String output) {
        String fpsLine = output.lines().filter(l -> l.startsWith("r_frame_rate")).findFirst().orElse("r_frame_rate=0/1").split("=")[1];
        String[] parts = fpsLine.split("/");
        return Float.parseFloat(parts[0]) / Float.parseFloat(parts[1]);
    }
    

}

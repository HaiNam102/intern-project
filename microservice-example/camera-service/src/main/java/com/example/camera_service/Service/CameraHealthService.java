package com.example.camera_service.Service;

import com.example.camera_service.Dto.Req.CameraReq;
import com.example.camera_service.Dto.Res.CameraRes;
import com.example.camera_service.Exception.ApiException;
import com.example.camera_service.Exception.ErrorCode;
import com.example.camera_service.Mapper.CameraMapper;
import com.example.camera_service.Model.Camera;
import com.example.camera_service.Model.CameraHealthLog;
import com.example.camera_service.Repository.CameraHealthLogRepository;
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
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CameraHealthService {
    CameraHealthLogRepository cameraHealthLogRepository;
//    SimpMessagingTemplate simpMessagingTemplate;
    CameraMapper cameraMapper;
    CameraService cameraService;

    public void checkCameraHealth(Long id) {
        CameraRes cameraRes = cameraService.getCameraById(id);
        // Dùng FFprobe từ FFmpeg để check stream (mô phỏng)
        ProcessBuilder pb = new ProcessBuilder(
                "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                "stream=width,height,r_frame_rate", "-of", "default=noprint_wrappers=1",
                cameraRes.getStreamUrl()
        );

        String output = null;
        try {
            Process process = pb.start();
            output = new BufferedReader(new InputStreamReader(process.getInputStream()))
                    .lines().collect(Collectors.joining("\n"));
        } catch (IOException e) {
            e.printStackTrace();
        }
        boolean isOnline = !output.isBlank();
        String errMess ="";
        if(isOnline == false){
            errMess = "Camera not active";
            throw new RuntimeException("Camera not active");
        }
        // Parse các thông số cần thiết (giả sử output hợp lệ)
        String resolution = parseResolution(output);
        float fps = parseFps(output);
        Camera camera = cameraMapper.toCamera(cameraRes);
        CameraHealthLog log = CameraHealthLog.builder()
                .camera(camera)
                .errorMessage(errMess)
                .timeStamp(Instant.now())
                .isOnline(isOnline)
                .fps(fps)
                .resolution(resolution)
                .build();

        cameraHealthLogRepository.save(log);

        // Gửi thông báo real-time qua WebSocket
//        simpMessagingTemplate.convertAndSend("/topic/camera-status", log);
    }

    private String parseResolution(String output) {
        // ví dụ: width=1920\nheight=1080
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

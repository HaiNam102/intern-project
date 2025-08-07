package com.example.camera_service.Config;

import com.example.camera_service.Dto.Res.CameraRes;
import com.example.camera_service.Model.Camera;
import com.example.camera_service.Repository.CameraRepository;
import com.example.camera_service.Service.CameraService;
import com.example.camera_service.Service.CameraStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class StreamWebSocketHandler extends BinaryWebSocketHandler {

    private final Map<Long, CameraStream> activeStreams = new ConcurrentHashMap<>();
    private final CameraService cameraService;
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            log.info("WebSocket connection attempt from: {}", session.getRemoteAddress());

            UriComponents uri = UriComponentsBuilder.fromUri(session.getUri()).build();
            String cameraIdStr = uri.getQueryParams().getFirst("cameraId");
            if (cameraIdStr == null) {
                log.error("No camera ID provided in WebSocket connection");
                session.close(CloseStatus.BAD_DATA);
                return;
            }

            Long cameraId = Long.parseLong(cameraIdStr);
            log.info("WebSocket connection established for camera: {}", cameraId);
            CameraRes cameraRes = cameraService.getCameraById(cameraId);
            String rtspUrl = cameraRes.getStreamUrl();
            if (rtspUrl == null) {
                log.error("Camera {} not found or RTSP URL not available", cameraId);
                session.close(CloseStatus.BAD_DATA);
                return;
            }

            log.info("RTSP URL for camera {}: {}", cameraId, rtspUrl);

            // Tạo stream nếu chưa có
            CameraStream stream = activeStreams.computeIfAbsent(cameraId, id -> new CameraStream(id, rtspUrl));

            // Tạo clientSession gắn với WebSocketSession
            CameraStream.ClientSession clientSession = new CameraStream.ClientSession(session) {
                @Override
                public boolean isOpen() {
                    return session.isOpen();
                }

                @Override
                public void send(byte[] data) {
                    try {
                        if (session.isOpen()) {
                            session.sendMessage(new BinaryMessage(data));
                        }
                    } catch (Exception e) {
                        log.debug("Error sending binary message: {}", e.getMessage());
                    }
                }
            };

            // Thêm client vào stream
            stream.addClient(clientSession);

            // Lưu thông tin để dùng khi đóng kết nối
            session.getAttributes().put("cameraId", cameraId);
            session.getAttributes().put("clientSession", clientSession);

            log.info("Client connected to camera {}. Total clients: {}", cameraId, stream.getClientCount());

        } catch (Exception e) {
            log.error("Error establishing connection: {}", e.getMessage(), e);
            try {
                session.close(CloseStatus.SERVER_ERROR);
            } catch (Exception ex) {
                log.error("Error closing session: {}", ex.getMessage());
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        try {
            Long cameraId = (Long) session.getAttributes().get("cameraId");
            CameraStream.ClientSession clientSession =
                    (CameraStream.ClientSession) session.getAttributes().get("clientSession");

            if (cameraId != null && clientSession != null) {
                CameraStream stream = activeStreams.get(cameraId);
                if (stream != null) {
                    stream.removeClient(clientSession);
                    log.info("Client disconnected from camera {}. Remaining clients: {}", cameraId, stream.getClientCount());

                    if (!stream.hasClients()) {
                        activeStreams.remove(cameraId);
                        log.info("Removed stream for camera {} as it has no clients", cameraId);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error during connection close: {}", e.getMessage());
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.error("Transport error: {}", exception.getMessage());
        try {
            session.close(CloseStatus.SERVER_ERROR);
        } catch (Exception e) {
            log.error("Error closing session after transport error: {}", e.getMessage());
        }
    }

}

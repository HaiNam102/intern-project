# Camera Streaming System

## Tổng quan

Hệ thống streaming camera sử dụng:
- **Backend**: Spring Boot với WebSocket
- **Frontend**: React với JSMpeg Player
- **Protocol**: MPEG1 over WebSocket

## Cấu trúc Files

### Backend (Spring Boot)
```
microservice-example/camera-service/
├── src/main/java/com/example/camera_service/
│   ├── Config/
│   │   ├── StreamWebSocketHandler.java    # WebSocket handler
│   │   ├── WebSocketConfig.java           # WebSocket config
│   │   └── CorsConfig.java               # CORS config
│   ├── Service/
│   │   └── CameraStream.java             # Stream management
│   └── Controller/
│       └── StreamController.java         # HTTP endpoints
```

### Frontend (React)
```
microservice_fe/src/
├── Component/
│   ├── CameraList.jsx                    # Camera list UI
│   ├── SimpleJSMpegPlayer.jsx           # JSMpeg player component
│   └── JSMpegPlayer.jsx                 # Advanced player component
├── utils/
│   ├── websocketTest.js                  # WebSocket utilities
│   ├── webglCheck.js                     # WebGL support check
│   └── canvasTest.js                     # Canvas utilities
└── services/
    └── api.js                           # API calls
```

## Cách hoạt động

### 1. Backend Stream Flow
1. Client kết nối WebSocket đến `/stream?cameraId={id}`
2. `StreamWebSocketHandler` xử lý connection
3. `CameraStream` service quản lý stream cho từng camera
4. Backend đọc video từ URL và gửi qua WebSocket

### 2. Frontend Player Flow
1. User click vào camera trong `CameraList`
2. `SimpleJSMpegPlayer` được render
3. Component test backend connection
4. JSMpeg.Player được khởi tạo với WebSocket URL
5. Video stream được hiển thị trên canvas

## Cài đặt và Chạy

### Backend
```bash
cd microservice-example/camera-service
mvn spring-boot:run
```

### Frontend
```bash
cd microservice_fe
npm install
npm start
```

## Troubleshooting

### 1. Backend không khởi động
- Kiểm tra port 8084 có bị chiếm không
- Kiểm tra Java và Maven đã cài đặt
- Xem log trong console

### 2. WebSocket không kết nối
- Kiểm tra backend có chạy không: `curl http://localhost:8084/api/stream/ping`
- Kiểm tra CORS config
- Xem browser console cho WebSocket errors

### 3. Video không hiển thị
- Kiểm tra JSMpeg library đã load
- Kiểm tra canvas element có được tạo không
- Xem browser console cho JSMpeg errors

### 4. Stream bị gián đoạn
- Kiểm tra network connection
- Kiểm tra backend log cho errors
- Restart backend service

## Debug Info

<!-- ### Backend URLs
- HTTP API: `http://localhost:8084/api/`
- WebSocket: `ws://localhost:8084/stream?cameraId={id}`
- Health Check: `http://localhost:8084/api/stream/ping` -->

### Frontend Debug
- Mở browser DevTools
- Xem Console tab cho logs
- Xem Network tab cho WebSocket connections
- Xem Application tab cho WebSocket frames

## Cấu hình

### Backend Configuration
```properties
# application.properties
server.port=8084
spring.application.name=camera-service
```

### Frontend Configuration
```javascript
// WebSocket URL
// const wsUrl = `ws://localhost:8084/stream?cameraId=${cameraId}`;

// JSMpeg Options
const playerOptions = {
  canvas: canvas,
  autoplay: true,
  audio: false,
  disableGl: true,
  disableWebAssembly: true
};
```

## Dependencies

### Backend
- Spring Boot WebSocket
- Spring Boot Web
- Lombok

### Frontend
- React
- JSMpeg Player
- Axios

## Performance Tips

1. **Backend**:
   - Sử dụng connection pooling
   - Implement stream buffering
   - Monitor memory usage

2. **Frontend**:
   - Disable WebGL nếu không cần
   - Implement connection retry
   - Clean up resources khi component unmount

## Security Considerations

1. **Authentication**: Implement JWT cho WebSocket connections
2. **Authorization**: Kiểm tra quyền truy cập camera
3. **CORS**: Cấu hình đúng cho production
4. **Rate Limiting**: Giới hạn số connection đồng thời 
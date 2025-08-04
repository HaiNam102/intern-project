# WebSocket Camera Health Monitoring

## Tổng quan

Tính năng WebSocket realtime cho camera health monitoring cho phép frontend nhận thông tin cập nhật trạng thái camera theo thời gian thực mà không cần refresh trang.

## Cấu hình Backend

### 1. WebSocket Configuration
- **File**: `microservice-example/camera-service/src/main/java/com/example/camera_service/Config/WebSocketConfig.java`
- **Endpoint**: `/ws` (STOMP over SockJS)
- **Topics**:
  - `/topic/camera-health` - Thông tin health của tất cả camera
  - `/topic/camera-health/{cameraId}` - Thông tin health của camera cụ thể

### 2. Camera Health Service
- **File**: `microservice-example/camera-service/src/main/java/com/example/camera_service/Service/CameraHealthService.java`
- Tự động gửi thông tin camera health qua WebSocket khi check health
- Gửi thông tin chi tiết: resolution, fps, error message, timestamp

### 3. DTO Structure
```java
public class CameraHealthStatusDto {
    private Long cameraId;
    private String cameraName;
    private String streamUrl;
    private boolean isOnline;
    private String errorMessage;
    private String resolution;
    private float fps;
    private Instant timestamp;
    private String status; // ONLINE, OFFLINE, MAINTENANCE
}
```

## Cấu hình Frontend

### 1. WebSocket Service
- **File**: `microservice_fe/src/services/websocket.js`
- Kết nối tự động khi component mount
- Hỗ trợ subscribe/unsubscribe cho từng camera
- Tự động reconnect khi mất kết nối

### 2. Components Integration

#### CameraList Component
- Hiển thị trạng thái WebSocket connection
- Cập nhật realtime status cho từng camera
- Hiển thị thông tin chi tiết: resolution, fps, timestamp
- Notification khi camera online/offline

#### CameraDetail Component
- Subscribe đến camera cụ thể
- Hiển thị thông tin health realtime
- Alert notification cho trạng thái camera

## Cách sử dụng

### 1. Khởi động Backend
```bash
cd microservice-example/camera-service
mvn spring-boot:run
```

### 2. Khởi động Frontend
```bash
cd microservice_fe
npm start
```

### 3. Test WebSocket Connection
1. Mở browser developer tools
2. Vào tab Console
3. Kiểm tra log: "Connected to WebSocket: ..."

### 4. Test Camera Health Check
1. Vào trang Camera List
2. Click "Kiểm tra sức khỏe" cho camera bất kỳ
3. Quan sát thông tin realtime được cập nhật
4. Kiểm tra notification

## WebSocket Topics

### Subscribe to All Camera Health Updates
```javascript
WebSocketService.subscribeToCameraHealth((data) => {
  console.log('Camera health update:', data);
  // Handle update
});
```

### Subscribe to Specific Camera Health Updates
```javascript
WebSocketService.subscribeToSpecificCameraHealth(cameraId, (data) => {
  console.log('Specific camera health update:', data);
  // Handle update
});
```

### Unsubscribe
```javascript
WebSocketService.unsubscribeFromCameraHealth();
WebSocketService.unsubscribeFromSpecificCameraHealth(cameraId);
```

## Message Format

### Camera Health Status Message
```json
{
  "cameraId": 1,
  "cameraName": "Camera 1",
  "streamUrl": "rtsp://example.com/stream",
  "isOnline": true,
  "errorMessage": "",
  "resolution": "1920x1080",
  "fps": 30.0,
  "timestamp": "2024-01-01T12:00:00Z",
  "status": "ONLINE"
}
```

## Error Handling

### Backend Errors
- Camera không hoạt động: `"Camera not active"`
- FFprobe error: Exception được log
- WebSocket connection error: Log trong console

### Frontend Errors
- Connection failed: Hiển thị warning alert
- Message parsing error: Log trong console
- Subscription error: Log trong console

## Performance Considerations

### Backend
- WebSocket session timeout: 15 phút
- Message buffer size: 8KB
- Binary message buffer: 1MB

### Frontend
- Auto-reconnect khi mất kết nối
- Cleanup subscriptions khi component unmount
- Debounce notifications để tránh spam

## Troubleshooting

### WebSocket không kết nối
1. Kiểm tra backend đã start chưa
2. Kiểm tra port 8080 có bị block không
3. Kiểm tra CORS configuration
4. Kiểm tra browser console errors

### Không nhận được updates
1. Kiểm tra WebSocket connection status
2. Kiểm tra subscription đã đúng topic chưa
3. Kiểm tra backend logs
4. Kiểm tra camera health check có thành công không

### Performance Issues
1. Giảm frequency của health checks
2. Implement message batching
3. Optimize message payload size
4. Monitor WebSocket connection count 
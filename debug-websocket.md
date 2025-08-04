# Debug WebSocket Real-time Issues

## 🔍 **Các bước debug:**

### 1. **Kiểm tra Backend Logs:**
```bash
# Chạy camera service với debug logging
cd microservice-example/camera-service
mvn spring-boot:run

# Kiểm tra logs trong console:
- "Bắt đầu kiểm tra sức khỏe tự động cho tất cả camera..."
- "Bắt đầu kiểm tra sức khỏe camera ID: ..."
- "Camera: ... - Stream URL: ..."
- "Camera ... - Output: ... - isOnline: ..."
- "Camera ... online. Đã cập nhật trạng thái."
- "Đã gửi thông báo WebSocket cho camera ...: ONLINE"
```

### 2. **Kiểm tra Frontend Console:**
```javascript
// Mở Developer Tools > Console
// Kiểm tra các log:
- "Attempting to connect to WebSocket..."
- "WebSocket connected successfully"
- "Dashboard received camera health update: ..."
```

### 3. **Test từng bước:**

#### **Bước 1: Test WebSocket Connection**
- Nhấn "Test WebSocket" trên Dashboard
- Kiểm tra console có log: "Dashboard received camera health update"
- Nếu không có → WebSocket connection có vấn đề

#### **Bước 2: Test Auto Check**
- Nhấn "Force Refresh" trên Dashboard
- Kiểm tra backend logs có chạy auto check không
- Kiểm tra frontend có nhận được thông báo không

#### **Bước 3: Test Manual Check**
- Vào Camera Detail
- Nhấn "Kiểm tra sức khỏe"
- Kiểm tra logs và thông báo

### 4. **Common Issues & Solutions:**

#### **Issue 1: Backend không gửi WebSocket message**
**Symptoms:**
- Backend logs: "Camera ... online" nhưng không có "Đã gửi thông báo WebSocket"
- Frontend không nhận được thông báo

**Solutions:**
1. Kiểm tra `simpMessagingTemplate` có null không
2. Kiểm tra WebSocket configuration
3. Kiểm tra CORS settings

#### **Issue 2: Frontend không kết nối WebSocket**
**Symptoms:**
- Console: "WebSocket connection error"
- Alert: "Không thể kết nối WebSocket"

**Solutions:**
1. Kiểm tra port 8084 có chạy không
2. Kiểm tra CORS configuration
3. Kiểm tra firewall/antivirus

#### **Issue 3: Frontend nhận message nhưng không update UI**
**Symptoms:**
- Console: "Dashboard received camera health update"
- Nhưng UI không thay đổi

**Solutions:**
1. Kiểm tra `setCameraHealthStatus` có được gọi không
2. Kiểm tra `getRealTimeStatus` logic
3. Kiểm tra React state updates

### 5. **Debug Commands:**

#### **Backend Debug:**
```bash
# Kiểm tra WebSocket endpoint
curl -X GET http://localhost:8084/ws

# Test camera health check
curl -X POST http://localhost:8084/api/cameras/1/check-health

# Test force refresh
curl -X POST http://localhost:8084/api/cameras/force-refresh-status
```

#### **Frontend Debug:**
```javascript
// Trong browser console
// Kiểm tra WebSocket connection
WebSocketService.isConnected()

// Kiểm tra camera health status
console.log('Camera Health Status:', cameraHealthStatus)

// Force reconnect WebSocket
WebSocketService.disconnect()
WebSocketService.connect()
```

### 6. **Expected Flow:**

✅ **Khi camera online:**
1. Backend: `checkCameraHealth()` → `isOnline = true`
2. Backend: `camera.setStatus(Status.ONLINE)` → `cameraRepository.save()`
3. Backend: `simpMessagingTemplate.convertAndSend()` → WebSocket message
4. Frontend: `subscribeToCameraHealth()` → nhận message
5. Frontend: `setCameraHealthStatus()` → update state
6. Frontend: UI re-render → hiển thị status mới

### 7. **Troubleshooting Checklist:**

- [ ] Backend logs có "Bắt đầu kiểm tra sức khỏe camera"
- [ ] Backend logs có "Camera ... online"
- [ ] Backend logs có "Đã gửi thông báo WebSocket"
- [ ] Frontend console có "WebSocket connected successfully"
- [ ] Frontend console có "Dashboard received camera health update"
- [ ] UI có cập nhật status
- [ ] Statistics cards có cập nhật số liệu 
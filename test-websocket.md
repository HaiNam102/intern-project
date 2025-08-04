# Hướng dẫn Test WebSocket Real-time

## 🔧 **Các bước test:**

### 1. **Kiểm tra Backend:**
```bash
# Chạy camera service
cd microservice-example/camera-service
mvn spring-boot:run
```

### 2. **Kiểm tra Frontend:**
```bash
# Chạy frontend
cd microservice_fe
npm start
```

### 3. **Test WebSocket Connection:**

#### **Bước 1: Mở Dashboard**
- Truy cập: `http://localhost:3000/camera/dashboard`
- Kiểm tra alert "Kết nối WebSocket thành công"

#### **Bước 2: Test WebSocket**
- Nhấn nút "Test WebSocket" trên Dashboard
- Kiểm tra console browser có log: "Dashboard received camera health update"
- Kiểm tra thông báo: "Test WebSocket message sent successfully"

#### **Bước 3: Test Auto Check**
- Tạo camera với RTSP URL không hợp lệ
- Đợi 10 giây (auto check interval)
- Kiểm tra camera chuyển sang trạng thái OFFLINE
- Kiểm tra thống kê dashboard cập nhật

### 4. **Debug Logs:**

#### **Backend Logs:**
```bash
# Kiểm tra logs camera service
tail -f logs/camera-service.log

# Các log quan trọng:
- "Bắt đầu kiểm tra sức khỏe tự động cho tất cả camera..."
- "Đã gửi thông báo WebSocket cho camera ..."
- "Đã gửi thông báo số camera offline: ..."
```

#### **Frontend Console:**
```javascript
// Mở Developer Tools > Console
// Các log quan trọng:
- "Attempting to connect to WebSocket..."
- "WebSocket connected successfully"
- "Dashboard received camera health update: ..."
```

### 5. **Troubleshooting:**

#### **Nếu WebSocket không kết nối:**
1. Kiểm tra port 8084 có đang chạy không
2. Kiểm tra CORS configuration
3. Kiểm tra firewall/antivirus

#### **Nếu không nhận được thông báo:**
1. Kiểm tra console browser có lỗi không
2. Kiểm tra backend logs
3. Test với nút "Test WebSocket"

#### **Nếu auto check không hoạt động:**
1. Kiểm tra @EnableScheduling đã được bật
2. Kiểm tra interval time (hiện tại 10 giây)
3. Kiểm tra logs auto check

### 6. **Expected Behavior:**

✅ **Khi camera offline:**
- Backend: Log "Camera ... offline"
- Frontend: Thông báo "Camera ... đã ngoại tuyến"
- Dashboard: Số camera offline tăng, online giảm

✅ **Khi camera online:**
- Backend: Log "Camera ... online"
- Frontend: Thông báo "Camera ... đã trực tuyến"
- Dashboard: Số camera online tăng, offline giảm

✅ **Real-time updates:**
- WebSocket connection status: Success
- Statistics cards cập nhật real-time
- Progress bar thay đổi theo tỷ lệ 
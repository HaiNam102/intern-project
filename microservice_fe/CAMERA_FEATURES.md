# Camera Management Features

## Tổng quan

Frontend đã được cập nhật để hỗ trợ đầy đủ các chức năng CRUD (Create, Read, Update, Delete) cho camera dựa trên `CameraController.java` backend.

## Các chức năng chính

### 1. Camera Dashboard (`/camera/dashboard`)
- Hiển thị tổng quan về hệ thống camera
- Thống kê số lượng camera theo trạng thái
- Biểu đồ tình trạng hệ thống
- Danh sách camera gần đây

### 2. Camera List (`/cameras`)
- Hiển thị danh sách tất cả camera
- Chức năng tìm kiếm và lọc
- Các hành động: Xem chi tiết, Chỉnh sửa, Xóa, Kiểm tra sức khỏe
- Nút thêm camera mới

### 3. Create Camera (`/camera/create`)
- Form tạo camera mới
- Validation dữ liệu
- Redirect sau khi tạo thành công

### 4. Edit Camera (`/camera/edit/:id`)
- Form chỉnh sửa thông tin camera
- Load dữ liệu hiện tại
- Validation và cập nhật

### 5. Camera Detail (`/camera/detail/:id`)
- Hiển thị chi tiết thông tin camera
- Các hành động: Chỉnh sửa, Xem stream, Kiểm tra sức khỏe
- Thông tin kỹ thuật chi tiết

### 6. Camera Stream (`/camera/:cameraId`)
- Xem stream video từ camera
- WebSocket connection
- Controls cho stream

## API Endpoints được sử dụng

```javascript
// Camera CRUD Operations
GET    /api/cameras              // Lấy tất cả camera
GET    /api/cameras/{id}         // Lấy camera theo ID
POST   /api/cameras/create       // Tạo camera mới
PUT    /api/cameras/{id}         // Cập nhật camera
DELETE /api/cameras/{id}         // Xóa camera

// Health Check
POST   /api/cameras/{id}/check-health  // Kiểm tra sức khỏe camera

// Stream Operations
POST   /api/cameras/{id}/start-stream  // Bắt đầu stream
POST   /api/cameras/{id}/stop-stream   // Dừng stream
```

## Cấu trúc dữ liệu Camera

```javascript
{
  id: number,           // ID camera
  nameCamera: string,   // Tên camera
  location: string,     // Vị trí
  streamUrl: string,    // URL stream
  status: string,       // Trạng thái (ONLINE/OFFLINE/MAINTENANCE)
  createdAt: string,    // Ngày tạo
  updatedAt: string     // Ngày cập nhật
}
```

## Components đã tạo/cập nhật

### 1. API Service (`src/services/api.js`)
- `callGetAllCameras()` - Lấy tất cả camera
- `callGetCameraById(id)` - Lấy camera theo ID
- `callCreateCamera(data)` - Tạo camera mới
- `callUpdateCamera(id, data)` - Cập nhật camera
- `callDeleteCamera(id)` - Xóa camera
- `callHealthCheck(id)` - Kiểm tra sức khỏe camera

### 2. CameraList Component
- Hiển thị danh sách camera dạng grid
- Chức năng CRUD đầy đủ
- Loading states và error handling
- Responsive design

### 3. CreateCamera Component
- Form tạo camera mới
- Validation và error handling
- Redirect sau khi tạo thành công

### 4. EditCamera Component
- Form chỉnh sửa camera
- Load dữ liệu hiện tại
- Validation và cập nhật

### 5. CameraDetail Component
- Hiển thị chi tiết camera
- Các hành động liên quan
- Thông tin kỹ thuật

### 6. CameraDashboard Component
- Dashboard tổng quan
- Thống kê và biểu đồ
- Navigation đến các chức năng khác

## Routing

```javascript
/cameras                    // Danh sách camera
/camera/dashboard          // Dashboard tổng quan
/camera/create             // Tạo camera mới
/camera/edit/:id           // Chỉnh sửa camera
/camera/detail/:id         // Chi tiết camera
/camera/:cameraId          // Xem stream camera
```

## Tính năng nổi bật

1. **Real-time Updates**: Tự động cập nhật dữ liệu sau các thao tác
2. **Error Handling**: Xử lý lỗi và hiển thị thông báo phù hợp
3. **Loading States**: Hiển thị trạng thái loading cho UX tốt hơn
4. **Responsive Design**: Tương thích với nhiều kích thước màn hình
5. **Confirmation Dialogs**: Xác nhận trước khi thực hiện các hành động quan trọng
6. **Status Indicators**: Hiển thị trạng thái camera bằng màu sắc và icon

## Cách sử dụng

1. **Xem Dashboard**: Truy cập `/camera/dashboard` để xem tổng quan
2. **Quản lý Camera**: Truy cập `/cameras` để xem danh sách và thực hiện các thao tác
3. **Thêm Camera**: Click "Thêm Camera" hoặc truy cập `/camera/create`
4. **Chỉnh sửa**: Click nút "Sửa" trên camera card
5. **Xem chi tiết**: Click nút "Chi tiết" để xem thông tin đầy đủ
6. **Xem stream**: Click "Xem stream" để xem video trực tiếp

## Lưu ý

- Đảm bảo backend camera-service đang chạy trên port 8084
- CORS đã được cấu hình ở backend
- WebSocket connection cho stream video
- Error handling cho các trường hợp network issues 
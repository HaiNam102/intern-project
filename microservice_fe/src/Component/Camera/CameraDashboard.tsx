import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Progress,
  List,
  Avatar,
  Tag,
  Alert,
  Spin,
  message
} from 'antd';
import {
  CameraOutlined,
  EyeOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  ReloadOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { callGetAllCameras } from '../../services/api'; // Adjust the import path as necessary
import WebSocketService from '../../services/websocket';

// Kiểu dữ liệu cho camera
interface Camera {
  cameraId: number;
  nameCamera: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | string;
}

// Kiểu dữ liệu realtime từ WebSocket
interface CameraHealthData {
  cameraId: number;
  cameraName: string;
  online: boolean;
  errorMessage?: string;
  resolution?: string;
  fps?: number;
}

// Kiểu dữ liệu trả về từ API
interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

const CameraDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [cameraHealthStatus, setCameraHealthStatus] = useState<
    Record<number, CameraHealthData>
  >({});

  useEffect(() => {
    fetchCameras();
    connectWebSocket();

    return () => {
      WebSocketService.unsubscribeFromCameraHealth();
      WebSocketService.disconnect();
    };
  }, []);

  const connectWebSocket = async (): Promise<void> => {
    try {
      await WebSocketService.connect();
      setWsConnected(true);

      WebSocketService.subscribeToCameraHealth((data: CameraHealthData) => {
        setCameraHealthStatus(prev => ({
          ...prev,
          [data.cameraId]: data
        }));

        if (data.online) {
          message.success(`Camera ${data.cameraName} đã trực tuyến`);
        } else {
          message.error(`Camera ${data.cameraName} đã ngoại tuyến: ${data.errorMessage}`);
        }
      });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setWsConnected(false);
    }
  };

  const fetchCameras = async (): Promise<void> => {
    try {
      setLoading(true);
      const response: ApiResponse<Camera[]> = await callGetAllCameras();
      if (response.code === 200) {
        setCameras(response.data || []);
      } else {
        message.error(response.message || 'Không thể tải dữ liệu camera');
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
      message.error('Không thể tải dữ liệu camera');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ONLINE':
        return 'success';
      case 'OFFLINE':
        return 'error';
      case 'MAINTENANCE':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'ONLINE':
        return 'Trực tuyến';
      case 'OFFLINE':
        return 'Ngoại tuyến';
      case 'MAINTENANCE':
        return 'Bảo trì';
      default:
        return 'Không xác định';
    }
  };

  const getRealTimeStatus = (camera: Camera): string => {
    const healthData = cameraHealthStatus[camera.cameraId];
    if (healthData) {
      return healthData.online ? 'ONLINE' : 'OFFLINE';
    }
    return camera.status;
  };

  const totalCameras = cameras.length;
  const onlineCameras = cameras.filter(
    camera => getRealTimeStatus(camera) === 'ONLINE'
  ).length;
  const offlineCameras = cameras.filter(
    camera => getRealTimeStatus(camera) === 'OFFLINE'
  ).length;
  const maintenanceCameras = cameras.filter(
    camera => camera.status === 'MAINTENANCE'
  ).length;

  const onlinePercentage =
    totalCameras > 0 ? (onlineCameras / totalCameras) * 100 : 0;

  const recentCameras = cameras.slice(0, 5);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}
      >
        <div>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <DashboardOutlined />
            Camera Dashboard
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Tổng quan hệ thống camera và monitoring realtime
          </p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchCameras} loading={loading}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/camera/create')}
          >
            Thêm Camera
          </Button>
        </Space>
      </div>

      {/* WebSocket Status */}
      <Alert
        message={
          wsConnected
            ? 'Kết nối Camera thành công - Nhận cập nhật realtime'
            : 'Không thể kết nối Camera'
        }
        type={wsConnected ? 'success' : 'warning'}
        icon={wsConnected ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
        style={{ marginBottom: '24px' }}
        showIcon
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số Camera"
              value={totalCameras}
              prefix={<CameraOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Camera Trực tuyến"
              value={onlineCameras}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Camera Ngoại tuyến"
              value={offlineCameras}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Camera Bảo trì"
              value={maintenanceCameras}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* System Health */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Tình trạng Hệ thống" size="default">
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <span>Tỷ lệ Camera hoạt động</span>
                <span>{onlinePercentage.toFixed(1)}%</span>
              </div>
              <Progress
                percent={onlinePercentage}
                status={
                  onlinePercentage >= 80
                    ? 'success'
                    : onlinePercentage >= 50
                    ? 'normal'
                    : 'exception'
                }
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068'
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#666'
              }}
            >
              <span>Tốt: ≥80%</span>
              <span>Trung bình: 50-79%</span>
              <span>Kém: &lt;50%</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Thống kê Nhanh" size="default">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {onlineCameras}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Đang hoạt động</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                  {offlineCameras}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Cần kiểm tra</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                  {maintenanceCameras}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Đang bảo trì</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {totalCameras}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Tổng cộng</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Cameras */}
      <Card title="Camera Gần đây" size="default">
        <List
          itemLayout="horizontal"
          dataSource={recentCameras}
          renderItem={(camera) => {
            const realTimeStatus = getRealTimeStatus(camera);
            const healthData = cameraHealthStatus[camera.cameraId];

            return (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/camera/detail/${camera.cameraId}`)}
                  >
                    Chi tiết
                  </Button>,
                  <Button
                    type="link"
                    icon={<CameraOutlined />}
                    onClick={() => navigate(`/camera/${camera.cameraId}`)}
                  >
                    Xem stream
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<CameraOutlined />} />}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {camera.nameCamera}
                      <Tag color={getStatusColor(realTimeStatus)}>
                        {getStatusText(realTimeStatus)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <div>Vị trí: {camera.location}</div>
                      {healthData && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#666',
                            marginTop: '4px'
                          }}
                        >
                          Độ phân giải: {healthData.resolution} | FPS: {healthData.fps}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
        {cameras.length > 5 && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Button type="link" onClick={() => navigate('/cameras')}>
              Xem tất cả camera ({cameras.length})
            </Button>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card title="Hành động Nhanh" size="default" style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              block
              onClick={() => navigate('/camera/create')}
            >
              Thêm Camera Mới
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              size="large"
              icon={<CameraOutlined />}
              block
              onClick={() => navigate('/cameras')}
            >
              Quản lý Camera
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              size="large"
              icon={<ReloadOutlined />}
              block
              onClick={fetchCameras}
              loading={loading}
            >
              Làm mới Dữ liệu
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CameraDashboard;


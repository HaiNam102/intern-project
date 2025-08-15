import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Space, Tag, message, Spin, Divider, Alert } from 'antd';
import {
  CameraOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  WifiOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { callGetCameraById, callHealthCheck } from '../../services/api';
import WebSocketService from '../../services/websocket';

interface Camera {
  id: number;
  cameraId: number;
  nameCamera: string;
  location: string;
  status: string;
  streamUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

interface HealthStatus {
  cameraId: number;
  cameraName: string;
  online: boolean;
  isOnline?: boolean;
  errorMessage?: string;
  resolution?: string;
  fps?: number;
  timestamp?: string;
}

interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

const CameraDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [camera, setCamera] = useState<Camera | null>(null);
  const [loading, setLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchCameraDetail();
    connectWebSocket();

    return () => {
      if (id) {
        WebSocketService.unsubscribeFromSpecificCameraHealth(id);
      }
      WebSocketService.disconnect();
    };
  }, [id]);

  const connectWebSocket = async (): Promise<void> => {
    try {
      await WebSocketService.connect();
      setWsConnected(true);

      if (id) {
        WebSocketService.subscribeToSpecificCameraHealth(id, (data: HealthStatus) => {
          setHealthStatus(data);
          if (data.isOnline || data.online) {
            message.success(`Camera ${data.cameraName} đã trực tuyến`);
          } else {
            message.error(`Camera ${data.cameraName} đã ngoại tuyến: ${data.errorMessage}`);
          }
        });

        WebSocketService.subscribeToCameraHealth((data: HealthStatus) => {
          if (id && data.cameraId === parseInt(id)) {
            setHealthStatus(data);
          }
        });
      }
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setWsConnected(false);
    }
  };

  const fetchCameraDetail = async (): Promise<void> => {
    try {
      setLoading(true);
      if (!id) {
        message.error('Không tìm thấy ID camera');
        return;
      }
      const response: ApiResponse<Camera> = await callGetCameraById(id);

      if (response.code === 200) {
        setCamera(response.data);
      } else {
        message.error('Không thể tải thông tin camera');
      }
    } catch (error) {
      console.error('Error fetching camera detail:', error);
      message.error('Không thể tải thông tin camera');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckHealth = async (): Promise<void> => {
    setHealthLoading(true);
    try {
      message.loading('Đang kiểm tra sức khỏe camera...', 0);
      if (!id) {
        message.error('Không tìm thấy ID camera');
        return;
      }
      const response = await callHealthCheck(id);
      message.destroy();

      if (response.code === 200) {
        message.success('Đã kiểm tra sức khỏe camera - Kết quả sẽ được cập nhật trong vài giây');
        await fetchCameraDetail();
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi kiểm tra sức khỏe camera');
      }
    } catch (error) {
      message.destroy();
      console.error('Error checking camera health:', error);
      message.error('Không thể kiểm tra sức khỏe camera');
    } finally {
      setHealthLoading(false);
    }
  };

  const handleEditCamera = (): void => {
    navigate(`/camera/edit/${id}`);
  };

  const handleViewStream = (): void => {
    navigate(`/camera/${id}`, { state: { camera } });
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

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải thông tin camera...</div>
      </div>
    );
  }

  if (!camera) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>
          Không tìm thấy thông tin camera
        </div>
        <Button
          type="primary"
          onClick={() => navigate('/cameras')}
          style={{ marginTop: '16px' }}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/cameras')}
            type="text"
          >
            Quay lại
          </Button>
          <h1 style={{ margin: 0 }}>
            <CameraOutlined style={{ marginRight: '8px' }} />
            Chi tiết Camera
          </h1>
        </div>
        <Space>
          <Button
            icon={<WifiOutlined />}
            onClick={handleCheckHealth}
            loading={healthLoading}
          >
            Kiểm tra sức khỏe
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={handleEditCamera}
          >
            Chỉnh sửa
          </Button>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={handleViewStream}
          >
            Xem stream
          </Button>
        </Space>
      </div>

      {/* WebSocket Connection Status */}
      <Alert
        message={wsConnected ? "Kết nối WebSocket thành công" : "Không thể kết nối WebSocket"}
        type={wsConnected ? "success" : "warning"}
        icon={wsConnected ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
        style={{ marginBottom: '16px' }}
        showIcon
      />

      {/* Real-time Health Status */}
      {healthStatus && (
        <Alert
          message={`Trạng thái camera: ${(healthStatus.isOnline || healthStatus.online) ? 'Trực tuyến' : 'Ngoại tuyến'}`}
          description={
            <div>
              <p><strong>Độ phân giải:</strong> {healthStatus.resolution}</p>
              <p><strong>FPS:</strong> {healthStatus.fps}</p>
              <p><strong>Thời gian cập nhật:</strong> {healthStatus.timestamp ? new Date(healthStatus.timestamp).toLocaleString('vi-VN') : 'N/A'}</p>
              {healthStatus.errorMessage && (
                <p><strong>Lỗi:</strong> {healthStatus.errorMessage}</p>
              )}
            </div>
          }
          type={(healthStatus.isOnline || healthStatus.online) ? "success" : "error"}
          style={{ marginBottom: '16px' }}
          showIcon
        />
      )}

      {/* Camera Info */}
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f6ffed',
        borderRadius: '8px',
        border: '1px solid #b7eb8f'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
          <strong>Camera Information</strong>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          ID: <strong>{camera.id}</strong> | Status:{' '}
          <Tag color={getStatusColor(camera.status)}>
            {getStatusText(camera.status)}
          </Tag>
        </p>
      </div>

      {/* Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        <Card title="Thông tin cơ bản" size="default">
          <Descriptions column={1} size="default">
            <Descriptions.Item label="ID Camera">{camera.cameraId}</Descriptions.Item>
            <Descriptions.Item label="Tên Camera">{camera.nameCamera}</Descriptions.Item>
            <Descriptions.Item label="Vị trí">{camera.location}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(camera.status)} style={{ fontSize: 14, padding: '4px 8px' }}>
                {getStatusText(camera.status)}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Thông tin kỹ thuật" size="default">
          <Descriptions column={1} size="default">
            <Descriptions.Item label="Stream URL">
              <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                {camera.streamUrl}
              </code>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {camera.createdAt ? new Date(camera.createdAt).toLocaleString('vi-VN') : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {camera.updatedAt ? new Date(camera.updatedAt).toLocaleString('vi-VN') : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <Divider />

      {/* Actions */}
      <Card title="Hành động" size="default" style={{ textAlign: 'center' }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="large"
            onClick={handleViewStream}
          >
            Xem Stream
          </Button>
          <Button
            icon={<EditOutlined />}
            size="large"
            onClick={handleEditCamera}
          >
            Chỉnh sửa
          </Button>
          <Button
            icon={<WifiOutlined />}
            size="large"
            onClick={handleCheckHealth}
            loading={healthLoading}
          >
            Kiểm tra sức khỏe
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default CameraDetail;


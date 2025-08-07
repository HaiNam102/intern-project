import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Descriptions, Space, Tag, message, Spin, Modal, Popconfirm, Alert, Image, Tooltip } from 'antd';
import { 
  PlayCircleOutlined, 
  StopOutlined, 
  EyeOutlined, 
  CameraOutlined,
  WifiOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { 
  callGetAllCameras, 
  callDeleteCamera, 
  callHealthCheck 
} from '../../services/api';
import WebSocketService from '../../services/websocket';

const CameraList = () => {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [wsConnected, setWsConnected] = useState(false);
  const [cameraHealthStatus, setCameraHealthStatus] = useState({});

  useEffect(() => {
    fetchCameras();
    connectWebSocket();
    
    return () => {
      // Cleanup WebSocket subscriptions
      WebSocketService.unsubscribeFromCameraHealth();
      WebSocketService.disconnect();
    };
  }, []);

  const connectWebSocket = async () => {
    try {
      await WebSocketService.connect();
      setWsConnected(true);
      
      // Subscribe to general camera health updates
      WebSocketService.subscribeToCameraHealth((data) => {
        console.log('Received camera health update:', data);
        setCameraHealthStatus(prev => ({
          ...prev,
          [data.cameraId]: data
        }));
        
        // Show notification based on status
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

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const response = await callGetAllCameras();
      if (response.code === 200) {
        setCameras(response.data || []);
        console.log('Fetched cameras:', response.data);
      } else {
        message.error('Không thể tải danh sách camera');
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
      message.error('Không thể tải danh sách camera');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCameras();
      message.success('Đã cập nhật danh sách camera');
    } catch (error) {
      console.error('Error refreshing cameras:', error);
      message.error('Không thể cập nhật danh sách camera');
    } finally {
      setRefreshing(false);
    }
  };

  const handleViewStream = (camera) => {
    const realTimeStatus = getRealTimeStatus(camera);
    const displayStatus = realTimeStatus ? realTimeStatus.status : camera.status;
    
    if (displayStatus !== 'ONLINE') {
      message.warning('Camera đang offline - Không thể xem stream');
      return;
    }
    
    navigate(`/camera/${camera.cameraId}`, { 
      state: { camera } 
    });
  };

  const handleEditCamera = (camera) => {
    navigate(`/camera/edit/${camera.cameraId}`, { 
      state: { camera } 
    });
  };

  const handleViewDetail = (camera) => {
    navigate(`/camera/detail/${camera.cameraId}`);
  };

  const handleDeleteCamera = async (cameraId) => {
    setDeleteLoading(prev => ({ ...prev, [cameraId]: true }));
    try {
      const response = await callDeleteCamera(cameraId);
      if (response.code === 200) {
        message.success('Đã xóa camera thành công');
        await fetchCameras(); // Refresh list
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi xóa camera');
      }
    } catch (error) {
      console.error('Error deleting camera:', error);
      message.error('Không thể xóa camera');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [cameraId]: false }));
    }
  };

  const handleCheckHealth = async (cameraId) => {
    try {
      message.loading('Đang kiểm tra sức khỏe camera...', 0);
      const response = await callHealthCheck(cameraId);
      message.destroy();
      
      if (response.code === 200) {
        message.success(`Đã kiểm tra sức khỏe camera - Kết quả sẽ được cập nhật trong vài giây`);
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi kiểm tra sức khỏe camera');
      }
    } catch (error) {
      message.destroy();
      console.error('Error checking camera health:', error);
      message.error('Không thể kiểm tra sức khỏe camera');
    }
  };

  const handleCreateCamera = () => {
    navigate('/camera/create');
  };

  const getStatusColor = (status) => {
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

  const getStatusText = (status) => {
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

  const getRealTimeStatus = (camera) => {
    const healthData = cameraHealthStatus[camera.cameraId];
    if (healthData) {
      return {
        status: healthData.online ? 'ONLINE' : 'OFFLINE',
        resolution: healthData.resolution,
        fps: healthData.fps,
        timestamp: healthData.timestamp,
        errorMessage: healthData.errorMessage
      };
    }
    return null;
  };

  // Function to get camera image based on camera ID
  const getCameraImage = (cameraId) => {
    const imageMap = {
      1: '/images/camera-1.svg',
      2: '/images/camera-2.svg',
      3: '/images/camera-3.svg'
    };
    return imageMap[cameraId] || '/images/camera-default.svg';
  };

  // Function to get camera image based on status
  const getCameraImageByStatus = (status) => {
    switch (status) {
      case 'ONLINE':
        return '/images/camera-1.svg';
      case 'OFFLINE':
        return '/images/camera-2.svg';
      case 'MAINTENANCE':
        return '/images/camera-3.svg';
      default:
        return '/images/camera-default.svg';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải danh sách camera...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* System Status */}
      <Alert
        message="Hệ thống tự động kiểm tra camera mỗi 10 giây - Thống kê real-time"
        type="info"
        icon={<CheckCircleOutlined />}
        style={{ marginBottom: '20px' }}
        showIcon
      />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>
          <CameraOutlined style={{ marginRight: '8px' }} />
          Danh sách Camera
        </h1>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={refreshing}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreateCamera}
          >
            Thêm Camera
          </Button>
          <Button 
            type="primary" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/camera/dashboard')}
          >
            Trang chủ
          </Button>
        </Space>
      </div>

      {/* WebSocket Connection Status */}
      <Alert
        message={wsConnected ? "Kết nối Camera thành công - Nhận cập nhật realtime" : "Không thể kết nối WebSocket"}
        type={wsConnected ? "success" : "warning"}
        icon={wsConnected ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
        style={{ marginBottom: '16px' }}
        showIcon
      />

      <div style={{ 
        marginBottom: '20px', 
        padding: '16px', 
        backgroundColor: '#f6ffed', 
        borderRadius: '8px',
        border: '1px solid #b7eb8f'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
          <strong>Camera Service Integration</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CameraOutlined style={{ color: '#52c41a' }} />
            <span>Tổng số camera: <strong>{cameras.length}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <WifiOutlined style={{ color: wsConnected ? '#52c41a' : '#ff4d4f' }} />
            <span>WebSocket: </span>
            <Tag color={wsConnected ? 'success' : 'error'}>
              {wsConnected ? 'Kết nối' : 'Ngắt kết nối'}
            </Tag>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <span>Hình ảnh: </span>
            <Tag color="blue">Đã bật</Tag>
          </div>
        </div>
      </div>
      
      {cameras.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px dashed #d9d9d9'
        }}>
          <Image
            src="/images/camera-default.svg"
            alt="No cameras"
            style={{ 
              maxWidth: '200px', 
              maxHeight: '150px',
              marginBottom: '16px',
              opacity: 0.5
            }}
            preview={false}
          />
          <h3 style={{ color: '#666', marginBottom: '8px' }}>Chưa có camera nào</h3>
          <p style={{ color: '#999', marginBottom: '16px' }}>Hãy thêm camera đầu tiên để bắt đầu</p>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCamera}>
            Thêm Camera
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px' }}>
          {cameras.map((camera) => {
            const realTimeStatus = getRealTimeStatus(camera);
            const displayStatus = realTimeStatus ? realTimeStatus.status : camera.status;
            const cameraImage = getCameraImageByStatus(displayStatus);
            
            return (
              <Card
                key={camera.cameraId}
                cover={
                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: displayStatus === 'ONLINE' ? '#f6ffed' : 
                                   displayStatus === 'OFFLINE' ? '#fff2f0' : '#f8f9fa', 
                    textAlign: 'center',
                    borderBottom: '1px solid #f0f0f0',
                    position: 'relative'
                  }}>
                    <Image
                      src={cameraImage}
                      alt={`Camera ${camera.nameCamera}`}
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '150px',
                        objectFit: 'contain',
                        filter: displayStatus === 'OFFLINE' ? 'grayscale(50%)' : 'none'
                      }}
                      preview={false}
                    />
                    {displayStatus === 'ONLINE' && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#52c41a',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        ONLINE
                      </div>
                    )}
                    {displayStatus === 'OFFLINE' && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#ff4d4f',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        OFFLINE
                      </div>
                    )}
                  </div>
                }
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CameraOutlined />
                    {camera.nameCamera}
                    <Badge 
                      status={getStatusColor(displayStatus)} 
                      text={getStatusText(displayStatus)} 
                    />
                    {realTimeStatus && (
                      <Tag color="blue" size="small">Realtime</Tag>
                    )}
                  </div>
                }
                extra={
                  <Space>
                    <Tooltip title="Kiểm tra sức khỏe camera">
                      <Button
                        type="text"
                        icon={<WifiOutlined />}
                        onClick={() => handleCheckHealth(camera.cameraId)}
                        size="small"
                        style={{
                          color: displayStatus === 'ONLINE' ? '#52c41a' : '#ff4d4f'
                        }}
                      >
                        Kiểm tra
                      </Button>
                    </Tooltip>
                    <Tooltip title="Xem chi tiết camera">
                      <Button
                        type="text"
                        icon={<InfoCircleOutlined />}
                        onClick={() => handleViewDetail(camera)}
                        size="small"
                      >
                        Chi tiết
                      </Button>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa camera">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditCamera(camera)}
                        size="small"
                      >
                        Sửa
                      </Button>
                    </Tooltip>
                    <Popconfirm
                      title="Xóa camera"
                      description="Bạn có chắc chắn muốn xóa camera này?"
                      onConfirm={() => handleDeleteCamera(camera.cameraId)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        loading={deleteLoading[camera.cameraId]}
                        size="small"
                        title="Xóa"
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                    <Tooltip 
                      title={displayStatus !== 'ONLINE' ? 'Camera đang offline - Không thể xem stream' : 'Xem stream camera'}
                    >
                      <Button
                        type={displayStatus === 'ONLINE' ? 'primary' : 'default'}
                        icon={<EyeOutlined />}
                        onClick={() => handleViewStream(camera)}
                        disabled={displayStatus !== 'ONLINE'}
                        style={{
                          opacity: displayStatus === 'ONLINE' ? 1 : 0.6,
                          color: displayStatus === 'ONLINE' ? undefined : '#999'
                        }}
                      >
                        Xem stream
                      </Button>
                    </Tooltip>
                  </Space>
                }
                hoverable
              >
                <Descriptions size="small" column={1}>
                  <Descriptions.Item label="ID">{camera.cameraId}</Descriptions.Item>
                  <Descriptions.Item label="Tên">{camera.nameCamera}</Descriptions.Item>
                  <Descriptions.Item label="Vị trí">{camera.location}</Descriptions.Item>
                  <Descriptions.Item label="Stream URL">
                    <code style={{ fontSize: '12px' }}>{camera.streamUrl}</code>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag color={getStatusColor(displayStatus)}>
                        {getStatusText(displayStatus)}
                      </Tag>
                      {displayStatus === 'ONLINE' && (
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          Hoạt động
                        </Tag>
                      )}
                      {displayStatus === 'OFFLINE' && (
                        <Tag color="red" icon={<ExclamationCircleOutlined />}>
                          Không kết nối
                        </Tag>
                      )}
                    </div>
                  </Descriptions.Item>
                  {realTimeStatus && (
                    <>
                      <Descriptions.Item label="Độ phân giải">
                        <Tag color="blue">{realTimeStatus.resolution}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="FPS">
                        <Tag color="cyan">{realTimeStatus.fps}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Cập nhật lúc">
                        <Tag color="purple">
                          {new Date(realTimeStatus.timestamp).toLocaleString('vi-VN')}
                        </Tag>
                      </Descriptions.Item>
                      {realTimeStatus.errorMessage && (
                        <Descriptions.Item label="Lỗi">
                          <Tag color="red">{realTimeStatus.errorMessage}</Tag>
                        </Descriptions.Item>
                      )}
                    </>
                  )}
                </Descriptions>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CameraList;

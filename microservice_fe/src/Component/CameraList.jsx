import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Descriptions, Space, Tag, message, Spin, Modal, Popconfirm } from 'antd';
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
  PlusOutlined
} from '@ant-design/icons';
import { 
  callGetAllCameras, 
  callDeleteCamera, 
  callHealthCheck 
} from '../services/api';

const CameraList = () => {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    fetchCameras();
  }, []);

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
      const response = await callHealthCheck(cameraId);
      if (response.code === 200) {
        message.success(`Đã kiểm tra sức khỏe camera ${cameraId}`);
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi kiểm tra sức khỏe camera');
      }
    } catch (error) {
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
        </Space>
      </div>

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
        {/* <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
          <li>Backend API: <code>/api/cameras</code></li>
          <li>CRUD Operations: Create, Read, Update, Delete</li>
          <li>Health check: <code>POST /api/cameras/{camera.id}/check-health</code></li>
          <li>Total cameras: <strong>{cameras.length}</strong></li>
        </ul> */}
      </div>
      
      {cameras.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px dashed #d9d9d9'
        }}>
          <CameraOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <h3 style={{ color: '#666', marginBottom: '8px' }}>Chưa có camera nào</h3>
          <p style={{ color: '#999', marginBottom: '16px' }}>Hãy thêm camera đầu tiên để bắt đầu</p>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCamera}>
            Thêm Camera
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
          {cameras.map((camera) => (
            <Card
              key={camera.cameraId}
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CameraOutlined />
                  {camera.nameCamera}
                  <Badge 
                    status={getStatusColor(camera.status)} 
                    text={getStatusText(camera.status)} 
                  />
                </div>
              }
              extra={
                                 <Space>
                   <Button
                     type="text"
                     icon={<WifiOutlined />}
                     onClick={() => handleCheckHealth(camera.cameraId)}
                     size="small"
                     title="Kiểm tra sức khỏe"
                   >
                     Kiểm tra
                   </Button>
                   <Button
                     type="text"
                     icon={<InfoCircleOutlined />}
                     onClick={() => handleViewDetail(camera)}
                     size="small"
                     title="Xem chi tiết"
                   >
                     Chi tiết
                   </Button>
                   <Button
                     type="text"
                     icon={<EditOutlined />}
                     onClick={() => handleEditCamera(camera)}
                     size="small"
                     title="Chỉnh sửa"
                   >
                     Sửa
                   </Button>
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
                   <Button
                     type="primary"
                     icon={<EyeOutlined />}
                     onClick={() => handleViewStream(camera)}
                   >
                     Xem stream
                   </Button>
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
                  <Tag color={getStatusColor(camera.status)}>
                    {getStatusText(camera.status)}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CameraList;

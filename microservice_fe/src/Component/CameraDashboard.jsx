import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Button, Space, message, Spin } from 'antd';
import { 
  CameraOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  WarningOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { callGetAllCameras } from '../services/api';

const CameraDashboard = () => {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    maintenance: 0
  });

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const response = await callGetAllCameras();
      if (response.code === 200) {
        const cameraList = response.data || [];
        setCameras(cameraList);
        
        // Calculate statistics
        const total = cameraList.length;
        const online = cameraList.filter(c => c.status === 'ONLINE').length;
        const offline = cameraList.filter(c => c.status === 'OFFLINE').length;
        const maintenance = cameraList.filter(c => c.status === 'MAINTENANCE').length;
        
        setStats({ total, online, offline, maintenance });
      } else {
        message.error('Không thể tải dữ liệu camera');
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
      message.error('Không thể tải dữ liệu camera');
    } finally {
      setLoading(false);
    }
  };

  const getHealthPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.online / stats.total) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE':
        return '#52c41a';
      case 'OFFLINE':
        return '#ff4d4f';
      case 'MAINTENANCE':
        return '#faad14';
      default:
        return '#d9d9d9';
    }
  };

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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0 }}>
          <CameraOutlined style={{ marginRight: '8px' }} />
          Camera Dashboard
        </h1>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchCameras}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/camera/create')}
          >
            Thêm Camera
          </Button>
             <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/cameras')}
          >
            Danh sach Camera
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số Camera"
              value={stats.total}
              prefix={<CameraOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={stats.online}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ngoại tuyến"
              value={stats.offline}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bảo trì"
              value={stats.maintenance}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Health Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
        <Col xs={24} lg={12}>
          <Card title="Tình trạng hệ thống" size="large">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Progress
                type="circle"
                percent={getHealthPercentage()}
                format={percent => `${percent}%`}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size={120}
              />
              <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
                {stats.online}/{stats.total} camera đang hoạt động
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân bố trạng thái" size="large">
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Đang hoạt động</span>
                  <span>{stats.online}</span>
                </div>
                <Progress 
                  percent={stats.total > 0 ? Math.round((stats.online / stats.total) * 100) : 0} 
                  strokeColor="#52c41a"
                  showInfo={false}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Ngoại tuyến</span>
                  <span>{stats.offline}</span>
                </div>
                <Progress 
                  percent={stats.total > 0 ? Math.round((stats.offline / stats.total) * 100) : 0} 
                  strokeColor="#ff4d4f"
                  showInfo={false}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Bảo trì</span>
                  <span>{stats.maintenance}</span>
                </div>
                <Progress 
                  percent={stats.total > 0 ? Math.round((stats.maintenance / stats.total) * 100) : 0} 
                  strokeColor="#faad14"
                  showInfo={false}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Cameras */}
      <Card title="Camera gần đây" size="large">
        {cameras.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <CameraOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>Chưa có camera nào</div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => navigate('/camera/create')}
              style={{ marginTop: '16px' }}
            >
              Thêm Camera đầu tiên
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {cameras.slice(0, 6).map((camera) => (
              <Card 
                key={camera.id} 
                size="small" 
                hoverable
                onClick={() => navigate(`/camera/detail/${camera.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: getStatusColor(camera.status) 
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                      {camera.nameCamera}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {camera.location}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    ID: {camera.id}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CameraDashboard; 
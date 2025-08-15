import React, { useRef, useState, useEffect } from 'react';
import { Button, Badge, Descriptions } from 'antd';
import {
  PlayCircleOutlined,
  StopOutlined,
  CameraOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import JSMpeg from '@cycjimmy/jsmpeg-player'; // JS class
import styled from 'styled-components';

// Giao diện tổng thể
const PageContainer = styled.div`
  padding: 24px;
  max-width: 1280px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
`;

// Tiêu đề
const Title = styled.h1`
  display: flex;
  align-items: center;
  font-size: 24px;
  margin-bottom: 16px;
  gap: 10px;
  color: #333;
`;

// Nút điều khiển
const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

// Stream container
const StreamContainer = styled.div`
  position: relative;
  width: 100%;
  height: 480px;
  border-radius: 10px;
  background: #000;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

// Canvas
const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  border-radius: 10px;
`;

interface CameraInfo {
  cameraId: number;
  name: string;
  location: string;
}

const CameraStream = (): React.ReactElement => {
  const { cameraId } = useParams<{ cameraId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<any>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const cameraInfo: Record<number, CameraInfo> = {
    1: { cameraId: 1, name: 'Camera Cổng Chính', location: 'Cổng vào' },
    2: { cameraId: 2, name: 'Camera Nhà Xe', location: 'Tầng hầm B1' },
    3: { cameraId: 3, name: 'Camera Hành Lang', location: 'Tầng 2' },
  };

  const currentCamera = cameraInfo[parseInt(cameraId || '1')];

  const handleStartStream = (): void => {
    if (!canvasRef.current) return;
    
    const wsUrl = `ws://localhost:8084/stream?cameraId=${currentCamera?.cameraId}`;
    const options = {
      canvas: canvasRef.current,
      autoplay: true,
      audio: false,
    };

    playerRef.current = new JSMpeg.VideoElement(canvasRef.current, wsUrl, options);
    setIsStreaming(true);
  };

  const handleStopStream = (): void => {
    if (playerRef.current) {
      playerRef.current.destroy?.();
      playerRef.current.source?.socket?.close?.();
      playerRef.current = null;
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    return () => handleStopStream();
  }, []);

  return (
    <PageContainer>
      <Title>
        <CameraOutlined />
        {currentCamera?.name || 'Không xác định'}
      </Title>

      <Controls>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/cameras')}>
          Quay lại
        </Button>
        <Button
          icon={<PlayCircleOutlined />}
          onClick={handleStartStream}
          disabled={isStreaming}
          type="primary"
        >
          Bắt đầu
        </Button>
        <Button
          icon={<StopOutlined />}
          onClick={handleStopStream}
          disabled={!isStreaming}
          danger
        >
          Dừng
        </Button>
      </Controls>

      <StreamContainer>
        <StyledCanvas ref={canvasRef} />
      </StreamContainer>

      <Descriptions size="small" bordered style={{ marginTop: 20 }}>
        <Descriptions.Item label="Camera ID">{currentCamera?.cameraId}</Descriptions.Item>
        <Descriptions.Item label="Vị trí">{currentCamera?.location}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Badge
            status={isStreaming ? 'processing' : 'default'}
            text={isStreaming ? 'connected' : 'disconnected'}
          />
        </Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default CameraStream;

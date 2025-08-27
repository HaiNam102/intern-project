import SockJS from 'sockjs-client';
import { Stomp, Client, StompSubscription, IMessage } from '@stomp/stompjs';

type CameraHealthCallback = (data: any) => void;

class WebSocketService {
  private stompClient: Client | any;
  private connected: boolean;
  private subscriptions: Map<string, StompSubscription>;

  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('http://localhost:8084/ws');
      this.stompClient = Stomp.over(socket as any);
      
      // Enable debug logging
      this.stompClient.debug = (str: string) => {
        console.log('STOMP Debug:', str);
      };
      
      this.stompClient.connect({}, 
        (frame: string) => {
          console.log('Connected to WebSocket: ' + frame);
          this.connected = true;
          resolve();
        },
        (error: any) => {
          console.error('WebSocket connection error:', error);
          this.connected = false;
          reject(error);
        }
      );
    });
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.connected = false;
      this.subscriptions.clear();
    }
  }

  subscribeToCameraHealth(callback: CameraHealthCallback): StompSubscription | undefined {
    if (!this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.stompClient.subscribe('/topic/camera-health', (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing camera health message:', error);
      }
    });

    this.subscriptions.set('camera-health', subscription);
    return subscription;
  }

  subscribeToSpecificCameraHealth(cameraId: string | number, callback: CameraHealthCallback): StompSubscription | undefined {
    if (!this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.stompClient.subscribe(`/topic/camera-health/${cameraId}`, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing specific camera health message:', error);
      }
    });

    this.subscriptions.set(`camera-health-${cameraId}`, subscription);
    return subscription;
  }

  unsubscribeFromCameraHealth(): void {
    const subscription = this.subscriptions.get('camera-health');
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete('camera-health');
    }
  }

  unsubscribeFromSpecificCameraHealth(cameraId: string | number): void {
    const subscription = this.subscriptions.get(`camera-health-${cameraId}`);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(`camera-health-${cameraId}`);
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export default new WebSocketService();



import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('http://localhost:8084/ws');
      this.stompClient = Stomp.over(socket);
      
      // Enable debug logging
      this.stompClient.debug = (str) => {
        console.log('STOMP Debug:', str);
      };
      
      this.stompClient.connect({}, 
        (frame) => {
          console.log('Connected to WebSocket: ' + frame);
          this.connected = true;
          resolve();
        },
        (error) => {
          console.error('WebSocket connection error:', error);
          this.connected = false;
          reject(error);
        }
      );
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.connected = false;
      this.subscriptions.clear();
    }
  }

  subscribeToCameraHealth(callback) {
    if (!this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.stompClient.subscribe('/topic/camera-health', (message) => {
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

  subscribeToSpecificCameraHealth(cameraId, callback) {
    if (!this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.stompClient.subscribe(`/topic/camera-health/${cameraId}`, (message) => {
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

  unsubscribeFromCameraHealth() {
    const subscription = this.subscriptions.get('camera-health');
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete('camera-health');
    }
  }

  unsubscribeFromSpecificCameraHealth(cameraId) {
    const subscription = this.subscriptions.get(`camera-health-${cameraId}`);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(`camera-health-${cameraId}`);
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService(); 
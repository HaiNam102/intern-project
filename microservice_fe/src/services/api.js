import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084/api';

// Camera API calls
export const callGetAllCameras = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cameras`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cameras:', error);
    throw error;
  }
};

export const callGetCameraById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cameras/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching camera by id:', error);
    throw error;
  }
};

export const callCreateCamera = async (cameraData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cameras/create`, cameraData);
    return response.data;
  } catch (error) {
    console.error('Error creating camera:', error);
    throw error;
  }
};

export const callUpdateCamera = async (id, cameraData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/cameras/${id}`, cameraData);
    return response.data;
  } catch (error) {
    console.error('Error updating camera:', error);
    throw error;
  }
};

export const callDeleteCamera = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cameras/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting camera:', error);
    throw error;
  }
};

export const callStartStream = async (cameraId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cameras/${cameraId}/start-stream`);
    return response.data;
  } catch (error) {
    console.error('Error starting stream:', error);
    throw error;
  }
};

export const callStopStream = async (cameraId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cameras/${cameraId}/stop-stream`);
    return response.data;
  } catch (error) {
    console.error('Error stopping stream:', error);
    throw error;
  }
};

export const callHealthCheck = async (cameraId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cameras/${cameraId}/check-health`);
    return response.data;
  } catch (error) {
    console.error('Error checking camera health:', error);
    throw error;
  }
}; 
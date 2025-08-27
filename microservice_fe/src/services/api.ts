import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8084/api';

// Định nghĩa interface cho Camera
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

interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

// Camera API calls
export const callGetAllCameras = async (): Promise<ApiResponse<Camera[]>> => {
  const response: AxiosResponse<ApiResponse<Camera[]>> = await axios.get(`${API_BASE_URL}/cameras`);
  return response.data;
};

export const callGetCameraById = async (id: number): Promise<ApiResponse<Camera>> => {
  try {
    const response: AxiosResponse<ApiResponse<Camera>> = await axios.get(`${API_BASE_URL}/cameras/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching camera by id:', error);
    throw error;
  }
};


export const callCreateCamera = async (
  cameraData: Partial<Camera>
): Promise<ApiResponse<Camera>> => {
  try {
    const response: AxiosResponse<ApiResponse<Camera>> = await axios.post(
      `${API_BASE_URL}/cameras/create`,
      cameraData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating camera:', error);
    throw error;
  }
};


// services/api.ts
export const callUpdateCamera = async (
  id: number,
  cameraData: Partial<Camera>
): Promise<ApiResponse<Camera>> => {
  try {
    const response: AxiosResponse<ApiResponse<Camera>> = await axios.put(
      `${API_BASE_URL}/cameras/${id}`,
      cameraData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating camera:', error);
    throw error;
  }
};



export const callDeleteCamera = async (id: number): Promise<ApiResponse<Camera[]>> => {
  const response: AxiosResponse<ApiResponse<Camera[]>> = await axios.delete(`${API_BASE_URL}/cameras/${id}`);
  return response.data;
};

export const callStartStream = async (cameraId: number): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.post(`${API_BASE_URL}/cameras/${cameraId}/start-stream`);
    return response.data;
  } catch (error) {
    console.error('Error starting stream:', error);
    throw error;
  }
};

export const callStopStream = async (cameraId: number): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.post(`${API_BASE_URL}/cameras/${cameraId}/stop-stream`);
    return response.data;
  } catch (error) {
    console.error('Error stopping stream:', error);
    throw error;
  }
};

export const callHealthCheck = async (cameraId: number): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.post(`${API_BASE_URL}/cameras/${cameraId}/check-health`);
    return response.data;
  } catch (error) {
    console.error('Error checking camera health:', error);
    throw error;
  }
};

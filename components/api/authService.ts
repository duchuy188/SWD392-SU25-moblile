import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Nếu đã có type RegisterData thì import, nếu chưa thì định nghĩa tạm
export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
}

const BASE_URL = 'https://swd392-su25-backend.onrender.com'; // Đổi thành domain backend mới
export const TOKEN_KEY = '@App:token';
export const REFRESH_TOKEN_KEY = '@App:refreshToken';
export const USER_KEY = '@App:user';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const errorMessage = (error.response?.data as any)?.error || 'Đã có lỗi xảy ra';
    Alert.alert('Thông báo', errorMessage);
    return Promise.reject(error.response?.data);
  }
);

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    const response = await api.post('/api/auth/logout', { refreshToken });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
};

export default api;

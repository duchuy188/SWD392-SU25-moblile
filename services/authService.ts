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
  async (error: AxiosError) => {
    const errorMessage = (error.response?.data as any)?.error || 'Đã có lỗi xảy ra';
    if (error.response?.status === 401) {
      // Nếu là lỗi xác thực do sai mật khẩu thì chỉ Alert, không chuyển trang
      if (typeof errorMessage === 'string' && errorMessage.includes('Mật khẩu hiện tại không chính xác')) {
        Alert.alert('Thông báo', errorMessage);
      } else {
        await AsyncStorage.setItem('NEED_LOGIN_REDIRECT', 'true');
        Alert.alert('Thông báo', errorMessage, [
          {
            text: 'OK',
            onPress: () => {
              try {
                // Chuyển trang login nếu dùng expo-router
                const router = require('expo-router').router;
                if (router && typeof router.replace === 'function') {
                  router.replace('/login');
                }
              } catch (e) {}
            },
          },
        ]);
      }
    } else {
      Alert.alert('Thông báo', errorMessage);
    }
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

  forgotPassword: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post('/api/auth/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (email: string, resetToken: string, newPassword: string) => {
    const response = await api.post('/api/auth/reset-password', { email, resetToken, newPassword });
    return response.data;
  },

  updateUser: async (data: any) => {
    // Nếu là FormData (upload file)
    if (data instanceof FormData) {
      const response = await api.put('/api/auth/update', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Gửi JSON như cũ
      const response = await api.put('/api/auth/update', data);
      return response.data;
    }
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default api;

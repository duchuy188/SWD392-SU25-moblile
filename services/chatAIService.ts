import axios, { AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from './authService';

const BASE_URL = 'https://swd392-su25-backend.onrender.com';

// Create separate API instance for chat without alert interceptor
const chatApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor to include token in requests
chatApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Chat API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor without alerts - just log errors
chatApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const errorData = error.response?.data as any;

    // Don't show alerts, just return the error data
    return Promise.reject(errorData || error);
  }
);

// Gửi tin nhắn (có thể kèm ảnh)
export const sendMessage = async (
  message: string,
  chatId?: string,
  image?: { uri: string; name: string; type: string }
): Promise<any> => {
  try {
    const formData = new FormData();

    if (message) {
      formData.append('message', message);
    }

    if (chatId) {
      formData.append('chatId', chatId);
    }

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any);
    }

    const response: AxiosResponse = await chatApi.post('/api/chat/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tạo cuộc trò chuyện mới
export const createNewConversation = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await chatApi.post('/api/chat/new');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy lịch sử chat của user hiện tại
export const getConversationHistory = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await chatApi.get('/api/chat/history');
    return response.data;
  } catch (error: any) {
    // Handle specific cases for empty history
    if (
      error?.message?.includes('Chưa có lịch sử chat') ||
      error?.message?.includes('No chat history')
    ) {
      return {
        conversations: [],
        message: error.message || 'Chưa có lịch sử chat nào',
      };
    }

    throw error;
  }
};

// Lấy chi tiết 1 cuộc trò chuyện
export const getConversationById = async (chatId: string): Promise<any> => {
  try {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    const response: AxiosResponse = await chatApi.get(`/api/chat/${chatId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xóa 1 cuộc trò chuyện
export const deleteConversationById = async (chatId: string): Promise<any> => {
  try {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    const response: AxiosResponse = await chatApi.delete(`/api/chat/${chatId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Utility function để check auth status cho chat
export const checkChatAuth = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  } catch (error) {
    return false;
  }
};

// Utility function để clear chat auth
export const clearChatAuth = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
  }
};

// Export chatApi instance nếu cần dùng trực tiếp
export { chatApi };

export default chatApi;

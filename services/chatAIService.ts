import api from './authService'; // Dùng chung instance đã có token, baseURL
import { AxiosResponse } from 'axios';

// Gửi tin nhắn (có thể kèm ảnh)
export const sendMessage = async (
  message: string,
  chatId?: string,
  image?: { uri: string; name: string; type: string }
): Promise<any> => {
  const formData = new FormData();
  if (message) formData.append('message', message);
  if (chatId) formData.append('chatId', chatId);
  if (image) {
    formData.append('image', {
      uri: image.uri,
      name: image.name,
      type: image.type,
    } as any);
  }

  const response: AxiosResponse = await api.post('/api/chat/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Tạo cuộc trò chuyện mới
export const createNewConversation = async (): Promise<any> => {
  const response = await api.post('/api/chat/new');
  return response.data;
};

// Lấy lịch sử chat của user hiện tại
export const getConversationHistory = async (): Promise<any> => {
  const response = await api.get('/api/chat/history');
  return response.data;
};

// Lấy chi tiết 1 cuộc trò chuyện
export const getConversationById = async (chatId: string): Promise<any> => {
  const response = await api.get(`/api/chat/${chatId}`);
  return response.data;
};

// Xóa 1 cuộc trò chuyện
export const deleteConversationById = async (chatId: string): Promise<any> => {
  const response = await api.delete(`/api/chat/${chatId}`);
  return response.data;
};

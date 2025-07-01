import api from './authService'; // Dùng chung instance đã có token, baseURL

// Lấy danh sách ngành học (có thể truyền params để lọc/tìm kiếm)
export const getMajors = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  subjects?: string[] | string;
  campus?: string;
  includeFilters?: boolean;
  quickSearch?: boolean;
}) => {
  const response = await api.get('/api/majors', { params });
  return response.data;
};

// Lấy chi tiết 1 ngành học
export const getMajorById = async (majorId: string) => {
  const response = await api.get(`/api/majors/${majorId}`);
  return response.data;
};

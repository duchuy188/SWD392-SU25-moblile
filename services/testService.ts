import api from './authService'; // Dùng chung instance đã có token, baseURL

// Lấy danh sách các bài test
export const getTests = async () => {
  const response = await api.get('/api/test/');
  return response.data;
};

// Lấy chi tiết 1 bài test
export const getTestById = async (testId: string) => {
  const response = await api.get(`/api/test/${testId}`);
  return response.data;
};

// Nộp bài test
export const submitTest = async (testId: string, answers: any[]) => {
  const response = await api.post(`/api/test/${testId}/submit`, { answers });
  return response.data;
};

// Lấy kết quả test của user hiện tại
export const getMyTestResults = async () => {
  const response = await api.get('/api/test/my-results');
  return response.data;
};

// Lấy chi tiết kết quả test theo id
export const getTestResultById = async (resultId: string) => {
  const response = await api.get(`/api/test/results/${resultId}`);
  return response.data;
};

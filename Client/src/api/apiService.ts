import axios from 'axios';

export const apiService = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

apiService.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) throw error;
    let message = 'Không thể kết nối máy chủ. Vui lòng thử lại.';
    if (axios.isAxiosError<unknown>(error)) {
      const data = error.response?.data;
      if (typeof data === 'object' && data !== null && 'message' in data) {
        if (typeof data.message === 'string') message = data.message;
        else if (
          Array.isArray(data.message) &&
          data.message.every((item: unknown) => typeof item === 'string')
        )
          message = data.message.join(' ');
      } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        message = 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.';
      } else if (error.response) {
        message = `Máy chủ trả lỗi ${error.response.status}. Vui lòng thử lại.`;
      }
    }
    throw new Error(message, { cause: error });
  },
);

export default apiService;

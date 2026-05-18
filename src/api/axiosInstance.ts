import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 30000, // 30초 (AI 진단 응답 대기)
  headers: {
    'Content-Type': 'application/json',
  },
});

// [선택사항] 인터셉터: 요청을 보내기 전에 실행됩니다 (예: 토큰 넣기)
axiosInstance.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에 토큰이 있다면 자동으로 헤더에 추가
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
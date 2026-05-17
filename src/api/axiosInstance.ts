import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  // Vite 환경변수 사용 (나중에 .env 파일에서 설정 가능)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', 
  timeout: 5000, // 5초 이상 응답 없으면 타임아웃
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
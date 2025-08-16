import axios from 'axios';

/** axios 생성한 것을 컴포넌트에서 사용함. */
export const client = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * API 요청 시 accessToken이 필요한 경우
 * sessionStorage에서 관리
 */
client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  token && (config.headers.Authorization = `Bearer ${token}`);
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // 리프레시 토큰 발급
    if (error.response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default client;

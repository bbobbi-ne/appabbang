import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // 리프레시 토큰 발급
    if (error.response.status === 401) {
      // localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default client;

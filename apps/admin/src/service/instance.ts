import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import { refresh } from './api';

const API_BASE_URL = `${import.meta.env.VITE_APPABBANG_API_URL}`;

export const baseInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const requireAccessTokenInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

requireAccessTokenInstance.interceptors.response.use();

/** 요청 인터셉터 */
const reqInt = (request: any) => {
  const { accessToken } = useAuthStore.getState();

  return accessToken
    ? {
        ...request,
        headers: {
          ...request.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    : request;
};

const resInt = async (error: any) => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    const newAccessToken = await refresh();

    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

    return requireAccessTokenInstance(originalRequest);
  }

  return Promise.reject(error);
};

requireAccessTokenInstance.interceptors.request.use(reqInt);
requireAccessTokenInstance.interceptors.response.use((response) => response, resInt);

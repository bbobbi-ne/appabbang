import { HttpClient, type ApiConfig } from '@/api/http-client';
import { useAuthStore } from '@/stores/authStore';
import { refreshCreate } from '@/service/auth-api';

export class CustomHttpClient extends HttpClient {
  constructor(config: ApiConfig = {}) {
    super({
      ...config,
    });

    // ✅ 요청 인터셉터
    this.instance.interceptors.request.use((request) => {
      const { accessToken } = useAuthStore.getState();
      console.log(request, '요청 리퀘스트');

      if ((request as any).secure && accessToken) {
        request.headers?.set?.('Authorization', `Bearer ${accessToken}`);
      }

      return request;
    });

    // ✅ 응답 인터셉터
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await refreshCreate();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken.data}`;
            return this.instance(originalRequest);
          } catch (e) {
            throw new Error('accessToken 재발급 실패');
          }
        }

        return Promise.reject(error);
      },
    );
  }
}

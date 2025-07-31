import { HttpClient, type ApiConfig } from '@/api/http-client';
import { useAuthStore } from '@/stores/auth-store';
import { refreshCreate } from '@/service/auth-api';

export class CustomHttpClient extends HttpClient {
  constructor(config: ApiConfig = {}) {
    super({
      ...config,
      securityWorker: () => {
        const { accessToken } = useAuthStore.getState();
        if (!accessToken) return;
        return {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    });

    // ✅ 응답 인터셉터
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { data: newAccessToken } = await refreshCreate();
            useAuthStore.getState().setAccessToken(newAccessToken);

            // 재요청 시 헤더 재설정
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };

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

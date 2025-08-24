// src/service/instance.ts
import { HttpClient, type ApiConfig } from '@/api/http-client';
import { useAuthStore } from '@/stores/auth-store';

/**
 * CustomHttpClient
 *
 * - HttpClient를 확장하여 토큰 자동 추가 & 403 시 refresh 재시도 기능
 * - refreshFn을 생성자 주입으로 받아 순환 참조 방지
 */
export class CustomHttpClient extends HttpClient {
  constructor(
    config: ApiConfig = {},
    private refreshFn?: () => Promise<{ data: string }>,
  ) {
    super({
      ...config,
      withCredentials: true,
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

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this.refreshFn) {
            throw new Error('refresh 함수가 설정되지 않음');
          }

          try {
            const { data: newAccessToken } = await this.refreshFn();
            useAuthStore.getState().setAccessToken(newAccessToken);

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

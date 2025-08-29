import { HttpClient, type ApiConfig } from '@/api/http-client';
import { useAccessTokenStore } from '@/store/session';
import { useCustomerStore } from '@/store/customer';

function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

/**
 * CustomHttpClient
 *
 * - HttpClient 확장
 * - 토큰 자동 추가
 * - 401/403 시 refresh 시도
 * - refresh 실패 시 상태 초기화
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
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) return;
        return {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    });

    if (this.refreshFn) {
      this.instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          // refresh 요청 자체라면 retry 금지
          if (originalRequest.url.includes('/auth/refresh')) {
            return Promise.reject(error);
          }

          if (
            (error.response?.status === 403 || error.response?.status === 401) &&
            !originalRequest._retry
          ) {
            originalRequest._retry = true;

            if (!this.refreshFn) {
              throw new Error('refresh 함수가 설정되지 않음');
            }

            try {
              const { data: newAccessToken } = await this.refreshFn();
              useAccessTokenStore.getState().set(newAccessToken);

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
}

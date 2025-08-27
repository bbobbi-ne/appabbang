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

    // if (this.refreshFn) {
    //   this.instance.interceptors.response.use(
    //     (response) => response,
    //     async (error) => {
    //       const originalRequest = error.config;
    //       const status = error.response?.status;

    //       // 401/403 + 원래 요청 한 번만 재시도
    //       if ((status === 401 || status === 403) && !originalRequest._retry) {
    //         originalRequest._retry = true;

    //         // refresh 요청 자체이면 interceptor 무시
    //         if (originalRequest._isRefreshRequest) {
    //           useAccessTokenStore.getState().reset();
    //           useCustomerStore.getState().reset();
    //           deleteCookie('refreshToken');
    //           return Promise.reject(error);
    //         }

    //         if (!this.refreshFn) {
    //           return Promise.reject(new Error('refresh 함수가 설정되지 않음'));
    //         }

    //         try {
    //           // refresh 요청 호출
    //           const { data: newAccessToken } = await this.refreshFn();

    //           // 상태 및 세션에 저장
    //           sessionStorage.setItem('accessToken', newAccessToken);
    //           useAccessTokenStore.getState().set(newAccessToken);

    //           // 헤더 업데이트 후 원래 요청 재시도
    //           originalRequest.headers = {
    //             ...originalRequest.headers,
    //             Authorization: `Bearer ${newAccessToken}`,
    //           };

    //           return this.instance(originalRequest);
    //         } catch (e: any) {
    //           // refresh 실패 시 상태 초기화
    //           useAccessTokenStore.getState().reset();
    //           useCustomerStore.getState().reset();
    //           deleteCookie('refreshToken');

    //           return Promise.reject(e);
    //         }
    //       }

    //       return Promise.reject(error);
    //     },
    //   );
    // }
  }
}

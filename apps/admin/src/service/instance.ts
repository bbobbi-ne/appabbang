import { HttpClient, type ApiConfig } from '@/api/http-client';
import { useAuthStore } from '@/stores/auth-store';
import { refreshCreate } from '@/service/auth-api';

/**
 * CustomHttpClient
 *
 * - 기본 HttpClient를 확장한 커스텀 클라이언트
 * - 요청 시 accessToken을 Authorization 헤더에 자동 첨부
 * - 응답에서 403(Forbidden) 발생 시 refresh token을 사용해 accessToken 재발급 후 재시도
 */
export class CustomHttpClient extends HttpClient {
  constructor(config: ApiConfig = {}) {
    super({
      ...config,
      withCredentials: true, // 쿠키 자동 포함
      // ✅ 요청 시 실행되는 securityWorker
      securityWorker: () => {
        const { accessToken } = useAuthStore.getState();
        if (!accessToken) return; // 토큰이 없으면 아무 것도 안 함
        return {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Bearer 토큰 헤더 추가
          },
        };
      },
    });

    // ✅ 응답 인터셉터
    this.instance.interceptors.response.use(
      // 정상 응답은 그대로 반환
      (response) => response,
      // 에러 응답 처리
      async (error) => {
        const originalRequest = error.config;

        // 403 에러이면서 아직 재시도 안 한 경우
        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // refresh token으로 새 accessToken 발급
            const { data: newAccessToken } = await refreshCreate();

            // 스토어에 새로운 accessToken 저장
            useAuthStore.getState().setAccessToken(newAccessToken);

            // 재요청 시 Authorization 헤더에 새 토큰 적용
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };

            // 실패했던 요청 재시도
            return this.instance(originalRequest);
          } catch (e) {
            // refresh token도 만료되었거나 실패 시
            throw new Error('accessToken 재발급 실패');
          }
        }

        // 다른 에러는 그대로 throw
        return Promise.reject(error);
      },
    );
  }
}

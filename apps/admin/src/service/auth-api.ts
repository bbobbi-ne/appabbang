import { toast } from 'sonner';
import { CustomHttpClient } from '@/service/instance';
import { Auth } from '@/api/Auth';
import { useAuthStore } from '@/stores/auth-store';
import type { LoginCreatePayload } from '@/api/data-contracts';

// Auth API 인스턴스 생성
const authApi = new Auth(new CustomHttpClient());

/**
 * 로그인 API 호출
 * @param {LoginCreatePayload} param0 - id, pw, type 정보를 포함한 로그인 요청 데이터
 * @returns accessToken을 담은 객체
 */
export const loginCreate = async ({ id, pw, type }: LoginCreatePayload) => {
  try {
    // 서버에 로그인 요청
    const response = await authApi.loginCreate({ id, pw, type });

    // 성공 토스트 알림
    toast.success('로그인에 성공했습니다!.');

    // Zustand 스토어에 Access Token 저장
    useAuthStore.getState().setAccessToken(response.data.accessToken!);

    return {
      data: response.data.accessToken,
    };
  } catch (error: any) {
    // 서버에서 전달된 에러 메시지 추출
    const message = error.data?.message || '로그인에 실패했습니다.';

    // 실패 토스트 알림
    toast.error('로그인에 실패했습니다.', {
      description: message,
    });

    // 호출 측에서 핸들링할 수 있도록 예외 던짐
    throw new Error(message);
  }
};

/**
 * 현재 로그인한 사용자 정보 조회
 * @returns 사용자 정보 객체
 */
export async function getMe() {
  try {
    // secure 옵션으로 인증된 사용자 정보 요청
    const response = await authApi.getAuth({ secure: true });

    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data?.message || '유저 정보를 불러오는데 실패했습니다.';

    toast.error('유저 정보를 불러오는데 실패했습니다.', {
      description: message,
    });

    throw new Error(message);
  }
}

/**
 * Refresh Token을 사용하여 Access Token 재발급
 * @returns 새로 발급된 Access Token
 */
export const refreshCreate = async () => {
  try {
    // withCredentials 옵션을 사용하여 쿠키 기반 Refresh Token 전송
    const response = await authApi.refreshCreate({
      withCredentials: true,
    });

    const accessToken = response.data.accessToken!;

    // 상태 스토어에 새로운 토큰 저장
    useAuthStore.getState().setAccessToken(accessToken);

    return {
      data: accessToken,
    };
  } catch (error: any) {
    console.error(error, '리프레시 에러');

    const message = error.data?.message || '토큰 재발급에 실패했습니다.';

    // 인증 상태 초기화 (로그아웃 처리)
    useAuthStore.getState().clearAccessToken();
    useAuthStore.getState().clearAuth();

    toast.error('토큰 재발급에 실패했습니다.', {
      description: message,
    });

    throw new Error(message);
  }
};

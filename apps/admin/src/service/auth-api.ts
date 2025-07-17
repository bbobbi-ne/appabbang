import { toast } from 'sonner';
import { CustomHttpClient } from '@/service/instance';
import { Auth } from '@/api/Auth';
import { useAuthStore } from '@/stores/auth-store';
import type { LoginCreatePayload } from '@/api/data-contracts';

const authApi = new Auth(new CustomHttpClient());
// 로그인
export const loginCreate = async ({ id, pw, type }: LoginCreatePayload) => {
  try {
    const response = await authApi.loginCreate({ id, pw, type });
    toast.success('로그인에 성공했습니다!.');
    useAuthStore.getState().setAccessToken(response.data.accessToken!);
    return {
      data: response.data.accessToken,
    };
  } catch (error: any) {
    const message = error.data.message || '로그인에 실패했습니다.';
    toast.error('로그인에 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

// 사용자 정보 조회
export async function getMe() {
  try {
    const response = await authApi.getAuth({ secure: true });
    // toast.success('유저 정보를 불러오는데 성공했습니다.');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '유저 정보를 불러오는데 실패했습니다.';
    toast.error('유저 정보를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

// 리프레시 토큰을 이용한 엑세스토큰 재발급
export const refreshCreate = async () => {
  try {
    const response = await authApi.refreshCreate({
      withCredentials: true,
    });
    const accessToken = response.data.accessToken!;
    useAuthStore.getState().setAccessToken(accessToken);
    return {
      data: accessToken,
    };
  } catch (error: any) {
    console.error(error, '리프레시에러');
    const message = error.data.message || '토큰 재발급에 실패했습니다.';
    useAuthStore.getState().clearAccessToken();
    useAuthStore.getState().clearAuth();
    toast.error('토큰 재발급에 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

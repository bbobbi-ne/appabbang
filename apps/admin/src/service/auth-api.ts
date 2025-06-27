import { toast } from 'sonner';
import type { ApiResponse } from './common';
import { withCredentialsInstance, requireAccessTokenInstance } from './instance';

export interface Admin {
  id: string;
  name: string;
  role: '10' | '20';
}

// ✅ 로그인
export async function login(req: { id: string; pw: string }): Promise<ApiResponse<string>> {
  try {
    const response = await withCredentialsInstance.post('/auth/login', req);
    toast.success('로그인에 성공했습니다!.');
    return {
      data: response.data.accessToken,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '로그인에 실패했습니다.';
    toast.error('로그인에 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

// ✅ 사용자 정보 조회
export async function getMe(): Promise<ApiResponse<Admin>> {
  try {
    const response = await requireAccessTokenInstance.get('/auth/me');
    // toast.success('유저 정보를 불러오는데 성공했습니다.');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '유저 정보를 불러오는데 실패했습니다.';
    toast.error('유저 정보를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

// ✅ 리프레시 토큰으로 AccessToken 재발급
export async function refresh(): Promise<ApiResponse<string>> {
  try {
    const response = await withCredentialsInstance.post('/auth/refresh');
    // toast.success('토큰 재발급에 성공했습니다.');
    return {
      data: response.data.accessToken,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '토큰 재발급에 실패했습니다.';
    toast.error('토큰 재발급에 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

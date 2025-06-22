import { useAuthStore } from '@/stores/authStore';
import { withCredentialsInstance, requireAccessTokenInstance } from './instance';

interface LoginRequest {
  id: string;
  pw: string;
}

interface LoginSuccessResponse {
  success: true;
  accessToken: string;
}

interface LoginErrorResponse {
  success: false;
  message: string;
}

interface RefreshSuccessResponse {
  success: true;
  accessToken: string;
}

interface RefreshErrorResponse {
  success: false;
  message: string;
}
export interface GetMeSuccessResponse {
  success: true;
  auth: User;
}

export interface GetMeErrorResponse {
  success: false;
  message: string;
}
export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'SUB';
  // 필요한 필드를 추가하세요
}

// ✅ 로그인
export async function login(req: LoginRequest): Promise<LoginSuccessResponse | LoginErrorResponse> {
  try {
    const response = await withCredentialsInstance.post('/auth/login', req);

    console.log(response);
    return {
      success: true,
      accessToken: response.data.accessToken,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '로그인에 실패했습니다.';
    return {
      success: false,
      message,
    };
  }
}

// ✅ 사용자 정보 조회
export async function getMe(): Promise<GetMeSuccessResponse | GetMeErrorResponse> {
  try {
    const response = await requireAccessTokenInstance.get<User>('/auth/me');
    return {
      success: true,
      auth: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '유저 정보를 불러오는데 실패했습니다.',
    };
  }
}

// ✅ 리프레시 토큰으로 AccessToken 재발급
export async function refresh(): Promise<RefreshSuccessResponse | RefreshErrorResponse> {
  try {
    const response = await withCredentialsInstance.post('/auth/refresh');
    return {
      success: true,
      accessToken: response.data.accessToken,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '토큰 재발급에 실패했습니다.';
    return {
      success: false,
      message,
    };
  }
}

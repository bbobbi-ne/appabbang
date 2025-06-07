import { baseInstance, requireAccessTokenInstance } from './instance';

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

export async function login(req: LoginRequest): Promise<LoginSuccessResponse | LoginErrorResponse> {
  try {
    const response = await baseInstance.post('/auth/login', req);
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

export async function getMe(req: string) {
  try {
    const res = await requireAccessTokenInstance.get('/auth/me', {
      headers: { Authorization: `Bearer ${req}` },
    });

    return res.data;
  } catch (error: any) {
    return error;
  }
}

export async function refresh() {
  try {
    const response = await baseInstance.post('/auth/refresh');
    return response.data.accessToken;
  } catch (error: any) {
    return error.message;
  }
}

import { Auth } from '@/api/Auth';
import type { LoginCreatePayload } from '@/api/data-contracts';
import { CustomHttpClient } from '../httpclient-instance';
import { useAccessTokenStore } from '@/store/session';
import { useCustomerStore } from '@/store/customer';

const authApi = new Auth(new CustomHttpClient({}, refreshCreate));
function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

export const AuthService = {
  login: async (data: LoginCreatePayload) => {
    try {
      const response = await authApi.loginCreate(data);
      return response.data;
    } catch (error: any) {
      console.log(error);
      const message = error.response.data?.error.message || '로그인에 실패했습니다.';

      throw new Error(message);
    }
  },
  logout: async () => {
    const response = await authApi.logoutCreate();
    return response.data;
  },
};

export async function refreshCreate(): Promise<{ data: string }> {
  try {
    const response = await authApi.refreshCreate({
      withCredentials: true,
    });

    const accessToken = response.data.accessToken!;

    sessionStorage.setItem('accessToken', accessToken);
    useAccessTokenStore.getState().set(accessToken);
    return { data: accessToken };
  } catch (error: any) {
    const message = error.response?.data?.message || '토큰 재발급에 실패했습니다.';
    useAccessTokenStore.getState().reset();
    useCustomerStore.getState().reset();
    deleteCookie('refreshToken');

    throw new Error(message);
  }
}

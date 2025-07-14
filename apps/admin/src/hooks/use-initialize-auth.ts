import { useAuthStore } from '@/stores/authStore';
import { refreshCreate, getMe } from '@/service/auth-api';
import { useQuery } from '@tanstack/react-query';

export async function InitializeAuth() {
  try {
    const { accessToken: currentToken, setAccessToken, setAuth } = useAuthStore.getState();

    let accessToken = currentToken;
    console.log(currentToken, '주스탠드 저장토큰');

    // 1. accessToken이 없으면 refresh 시도
    if (!accessToken) {
      const response = await refreshCreate();
      if (!response.data) {
        throw new Error('accessToken 재발급 실패');
      }

      accessToken = response.data;
      setAccessToken(accessToken);
    }

    // 2. 세션에 캐시된 유저 정보가 있는 경우 우선 사용
    const raw = sessionStorage.getItem('auth-storage');
    const parsed = raw ? JSON.parse(raw) : null;
    const cachedAuth = parsed?.state?.auth;

    console.log(cachedAuth, '저장된 유저정보');

    if (cachedAuth) {
      setAuth(cachedAuth);
      return { accessToken, auth: cachedAuth };
    }

    // 3. 그렇지 않으면 getMe 실행
    const result = await getMe();
    if (!result.data) {
      throw new Error('유저 정보를 불러오지 못했습니다.');
    }

    setAuth(result.data);
    return { accessToken, auth: result.data };
  } catch (error) {
    console.error('❌ 인증 초기화 실패:', error);
    useAuthStore.getState().clearAccessToken();
    useAuthStore.getState().clearAuth();
    throw error;
  }
}

export function useInitializeAuth() {
  return useQuery({
    queryKey: ['initialize', 'auth'],
    queryFn: InitializeAuth,
    staleTime: 1000 * 60 * 60, // 1시간
    retry: 0,
  });
}

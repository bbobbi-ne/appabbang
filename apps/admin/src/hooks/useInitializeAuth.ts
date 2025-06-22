import { getMe, refresh } from '@/service/api';
import { useAuthStore } from '@/stores/authStore';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

async function InitializeAuth() {
  try {
    const {
      accessToken: currentToken,
      setAccessToken,
      setAuth,
      clearAuth,
      clearAccessToken,
    } = useAuthStore.getState();

    let accessToken = currentToken;

    // accessToken이 없으면 refresh 시도
    if (!accessToken) {
      const response = await refresh();

      if (!response.success) {
        console.warn('🔒 accessToken 재발급 실패:', response.message);
        clearAccessToken();
        clearAuth();
        throw new Error('accessToken 재발급 실패');
      }

      accessToken = response.accessToken;
      setAccessToken(accessToken);
    }

    // 세션에서 auth 가져오기
    const raw = sessionStorage.getItem('auth-storage');
    const parsed = raw ? JSON.parse(raw) : null;
    const cachedAuth = parsed?.state?.auth;

    // auth 데이터가 없으면 getMe 호출해서 가져오기
    let auth = cachedAuth;

    if (!auth) {
      const result = await getMe();

      if (!result.success) {
        clearAccessToken();
        clearAuth();
        throw new Error(result.message || '유저 정보를 불러오지 못했습니다.');
      }

      auth = result.auth;
    }

    setAuth(auth);

    return { accessToken, auth };
  } catch (error) {
    console.error('❌ 인증 초기화 실패:', error);
    throw error;
  }
}

export function useInitializeAuth() {
  return useQuery({
    queryFn: InitializeAuth,
    staleTime: 60 * 60 * 1000,
    queryKey: ['initialize', 'auth'],
    retry: 0,
  });
}

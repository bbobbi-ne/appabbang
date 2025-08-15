import { useAuthStore } from '@/stores/auth-store';
import { refreshCreate, getMe } from '@/service/auth-api';
import { useQuery } from '@tanstack/react-query';

/**
 * 🔹 인증 초기화 함수
 * 1. 기존 accessToken이 없으면 refresh 토큰으로 재발급 시도
 * 2. 세션 스토리지에 캐시된 유저 정보를 우선 사용
 * 3. 캐시가 없으면 getMe API 호출하여 유저 정보 조회
 * 4. 인증 실패 시 상태 초기화
 */
export async function InitializeAuth() {
  try {
    const { accessToken: currentToken, setAccessToken, setAuth } = useAuthStore.getState();

    let accessToken = currentToken;

    // 1️⃣ accessToken이 없으면 refresh 토큰으로 재발급 시도
    if (!accessToken) {
      const response = await refreshCreate();
      if (!response.data) {
        throw new Error('accessToken 재발급 실패');
      }

      accessToken = response.data;
      setAccessToken(accessToken);
    }

    // 2️⃣ 세션 스토리지에 캐시된 유저 정보가 있으면 우선 사용
    const raw = sessionStorage.getItem('auth-storage');
    const parsed = raw ? JSON.parse(raw) : null;
    const cachedAuth = parsed?.state?.auth;

    if (cachedAuth) {
      setAuth(cachedAuth);
      return { accessToken, auth: cachedAuth };
    }

    // 3️⃣ 캐시가 없으면 getMe API 호출
    const result = await getMe();
    if (!result.data) {
      throw new Error('유저 정보를 불러오지 못했습니다.');
    }

    setAuth(result.data);
    return { accessToken, auth: result.data };
  } catch (error) {
    console.error('❌ 인증 초기화 실패:', error);

    // 4️⃣ 인증 실패 시 상태 초기화
    useAuthStore.getState().clearAccessToken();
    useAuthStore.getState().clearAuth();
    throw error;
  }
}

/**
 * 🔹 React Query 훅: 인증 초기화
 * InitializeAuth를 호출하여 인증 상태를 초기화하고 캐싱
 * staleTime: 1시간, retry: 0
 */
export function useInitializeAuth() {
  return useQuery({
    queryKey: ['initialize', 'auth'], // 쿼리 키
    queryFn: InitializeAuth, // 인증 초기화 함수
    staleTime: 1000 * 60 * 60, // 1시간
    retry: 0, // 실패 시 재시도 없음
  });
}

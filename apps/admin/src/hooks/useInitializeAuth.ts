import { getMe, refresh } from '@/service/api';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';

export function useInitializeAuth() {
  return useQuery({
    queryFn: async () => {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        const auth = sessionStorage.getItem('auth-storage') || (await getMe(accessToken));

        return { accessToken, auth };
      } else {
        const accessToken = await refresh();
        const auth = sessionStorage.getItem('auth-storage') || (await getMe(accessToken));

        return { accessToken, auth };
      }
    },
    staleTime: Infinity,
    queryKey: ['refresh', 'auth'],
    retry: 3,
  });
}

import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/api/auth-service';
import { useAccessTokenStore } from '@/store/session';
import { useCustomerStore } from '@/store/customer';
import type { LoginCreatePayload } from '@/api/data-contracts';

/** 로그인 */
export function useGetAuthLoginMutation() {
  const createAddressMutation = useMutation({
    mutationFn: (data: LoginCreatePayload) => AuthService.login(data),
    onSuccess: (data) => {
      const accessToken = data.accessToken;
      const { id, name, no } = data.data;
      const user = { id, name, no };
      if (accessToken) {
        // sessionStorage에 저장
        sessionStorage.setItem('accessToken', accessToken);

        // Zustand store에 저장
        useAccessTokenStore.getState().set(accessToken);
        useCustomerStore.getState().set({
          ...user,
          defaultAddressNo: 0,
          isMarketingTermsAgreed: true,
          isPrivacyTermsAgreed: true,
          isServiceTermsAgreed: true,
          type: 'customer',
        });
      }
    },
    onError: (error: any) => {
      console.error('로그인 실패', error);
    },
  });

  return createAddressMutation;
}

/** 로그아웃 */
export function useLogoutMutation() {
  const createAddressMutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      sessionStorage.removeItem('accessToken');

      // Zustand store에 저장
      useAccessTokenStore.getState().reset();
      useCustomerStore.getState().reset();
    },
    onError: (error: any) => {
      console.error('로그아웃 실패', error);
    },
  });

  return createAddressMutation;
}

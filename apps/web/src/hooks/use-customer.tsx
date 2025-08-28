import { useMutation } from '@tanstack/react-query';
import { useAccessTokenStore } from '@/store/session';
import { useCustomerStore } from '@/store/customer';
import type { CustomersCreatePayload } from '@/api/data-contracts';
import { CustomerService } from '@/services/api/customer-service';

/** 회원가입 */
export function useCreateCustomerMutation() {
  const createAddressMutation = useMutation({
    mutationFn: (data: CustomersCreatePayload) => CustomerService.create(data),
    onSuccess: (data) => {
      const accessToken = data.accessToken;
      const { id, name, no, isMarketingTermsAgreed, isPrivacyTermsAgreed, isServiceTermsAgreed } =
        data.data;
      const user = {
        id,
        name,
        no,
        isMarketingTermsAgreed,
        isPrivacyTermsAgreed,
        isServiceTermsAgreed,
      };
      if (accessToken) {
        // sessionStorage에 저장
        sessionStorage.setItem('accessToken', accessToken);

        // Zustand store에 저장
        useAccessTokenStore.getState().set(accessToken);
        useCustomerStore.getState().set({
          ...user,
          defaultAddressNo: 0,
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

/** 이메일 인증 */
export function useSendEmailMutation() {
  const createAddressMutation = useMutation({
    mutationFn: CustomerService.sendEmail,
    onError: (error: any) => {
      console.error('Send Email Error', error);
    },
  });

  return createAddressMutation;
}

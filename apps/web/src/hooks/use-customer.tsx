import { useMutation } from '@tanstack/react-query';
import { useAccessTokenStore } from '@/store/session';
import { useCustomerStore } from '@/store/customer';
import type {
  CheckIdCreatePayload,
  CompareCodeCreatePayload,
  CustomersCreatePayload,
  EmailCreatePayload,
  IdEmailCreatePayload,
  SendEmailCreatePayload,
} from '@/api/data-contracts';
import { CustomerService } from '@/services/api/customer-service';
import useToast from './useToast';

const { addToast } = useToast();

/**
 * 회원가입
 * onSuccess 이후 저장소에 담긴 email code 리셋
 *  */
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
    onError: (_: any) => {
      addToast({ type: 'error', message: '회원가입 과정에서 오류가 발생했습니다.' });
    },
  });

  return createAddressMutation;
}
/**
 * 회원가입
 * onSuccess 이후 저장소에 담긴 email code 리셋
 *  */
export function useDeleteCustomerMutation() {
  const createAddressMutation = useMutation({
    mutationFn: () => CustomerService.delete(),
    onSuccess: () => {
      addToast({
        type: 'success',
        message: '그 동안 아빠빵을 이용해주셔서 감사합니다. 🙇‍♀️ 메인페이지로 이동합니다.',
      });
      useAccessTokenStore.getState().reset();
      useCustomerStore.getState().reset();
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        message: error.response.data.error.message || '회원탈퇴 과정에서 오류가 발생했습니다.',
      });
    },
  });

  return createAddressMutation;
}

/**
 * 아이디 중복체크 :: 존재하는 아이디 찾기
 * @params id
 */
export function useGetCheckIdMutation() {
  const mutation = useMutation({
    mutationFn: (data: CheckIdCreatePayload) => CustomerService.getCheckId(data),
  });

  return mutation;
}

/**
 * 이메일 가져오기
 * @param email
 */
export function useGetEmailMutation() {
  const mutation = useMutation({
    mutationFn: (data: EmailCreatePayload) => CustomerService.getEmail(data),
  });

  return mutation;
}

/** 입력한 이메일로 인증코드 전송 */
export function useSendEmailMutation() {
  const mutation = useMutation({
    mutationFn: (data: SendEmailCreatePayload) => CustomerService.sendEmail(data),
  });

  return mutation;
}

/** 이메일 인증번호 비교 */
export function useCompareEmailCodeMutation() {
  const mutation = useMutation({
    mutationFn: (data: CompareCodeCreatePayload) => CustomerService.compareCode(data),
  });

  return mutation;
}

/**
 * 입력한 아이디와 이메일 가져오기
 */
export function useGetIdEmailMutation() {
  const mutation = useMutation({
    mutationFn: (data: IdEmailCreatePayload) => CustomerService.getIdEmail(data),
  });

  return mutation;
}

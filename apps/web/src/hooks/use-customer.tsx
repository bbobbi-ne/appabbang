import { useMutation } from '@tanstack/react-query';
import { useAccessTokenStore } from '@/store/session';
import { useCustomerStore } from '@/store/customer';
import type {
  CheckIdCreatePayload,
  CompareCodeCreatePayload,
  CustomersCreatePayload,
  EmailCreatePayload,
  SendEmailCreatePayload,
} from '@/api/data-contracts';
import { CustomerService } from '@/services/api/customer-service';
import useToast from './useToast';
import type { JoinSchemaType } from '@/validate/join-form-schema';
import type { UseFormReturn } from 'react-hook-form';

const { addToast } = useToast();

/**
 * 회원가입
 * onSuccess 이후 저장소에 담긴 email code 리셋
 *  */
export function useCreateCustomerMutation(resetEmailCode: () => void) {
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
      // 외부 onSuccess 후처리
      resetEmailCode();
      addToast({ type: 'success', message: `${name}님, 환영합니다!` });
      setTimeout(() => (window.location.href = '/'), 1500);
    },
    onError: (error: any) => {
      console.error('로그인 실패', error);
      addToast({ type: 'error', message: '' });
    },
  });

  return createAddressMutation;
}

/**
 * 아이디 중복체크 :: 존재하는 아이디 찾기
 * @params id
 */
export function useGetCheckIdMutation(form: UseFormReturn<JoinSchemaType>) {
  const mutation = useMutation({
    mutationFn: (data: CheckIdCreatePayload) => CustomerService.getCheckId(data),
    onSuccess: (data) => {
      if (data.id) {
        form.setError('id', { type: 'value', message: '이미 존재하는 아이디입니다.' });
        form.setFocus('id');
      } else {
        form.clearErrors('id');
      }
    },
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
export function useSendEmailMutation(
  setEmailCode: (code: string) => void,
  setShowCode: (flag: boolean) => void,
  form: UseFormReturn<JoinSchemaType>,
) {
  const mutation = useMutation({
    mutationFn: (data: SendEmailCreatePayload) => CustomerService.sendEmail(data),
    onSuccess: ({ code }) => {
      // code를 상태관리에 임시저장(회원가입 완료 후 제거할 것)
      sessionStorage.setItem('code', code);
      setEmailCode(code);
      form && form.clearErrors('email');
      setShowCode(true);
    },
    onError: (error: any) => {
      console.error('Send Email Error', error);
    },
  });

  return mutation;
}

/** 이메일 인증번호 비교 */
export function useCompareEmailCodeMutation(
  form: UseFormReturn<JoinSchemaType>,
  setCheck: (flag: boolean) => void,
  resetEmailCode: () => void,
) {
  const mutation = useMutation({
    mutationFn: (data: CompareCodeCreatePayload) => CustomerService.compareCode(data),
    onSuccess: (data) => {
      if (Number(data.code) === 200) {
        form.clearErrors('code');
        setCheck(true);
        resetEmailCode();
      } else {
        form.setError('code', { type: 'value', message: '인증번호가 일치하지 않습니다.' });
        setCheck(false);
      }
    },
    onError: () => {
      addToast({ type: 'error', message: '이메일 인증번호 비교 오류가 발생했습니다.' });
    },
  });

  return mutation;
}

/**
 * 유저 APIs
 */

import useToast from '@/hooks/useToast';
import axios from 'axios';

const { addToast } = useToast();

/** axios 생성한 것을 컴포넌트에서 사용함. */
const client = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

class CustomError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

/**
 * 회원가입
 */
type ICustomerProps = {
  id: string;
  password: string;
  passwordConfirm: string;
  mobileNumber: string;
  address: string;
  addressDetail: string;
  zipcode: string;
  isServiceTermsAgreed: boolean;
  isPrivacyTermsAgreed: boolean;
  isMarketingTermsAgreed: boolean;
};

export async function createCustomer(data: ICustomerProps) {
  client
    .post('/join', data)
    .then(({ status }) => {
      if (status === 201) return { code: 201, message: 'success' };
      else throw new CustomError(500, 'fail');
    })
    .catch(({ status }) => {
      status === 400 &&
        addToast({
          message: '회원가입 요청에서 문제가 발생했습니다. 관리자 확인이 필요합니다.',
          type: 'error',
        });

      status === 500 &&
        addToast({
          message: '서버에서 회원가입 과정 중 문제가 발생했습니다. 관리자 확인이 필요합니다.',
          type: 'error',
        });
    });
}

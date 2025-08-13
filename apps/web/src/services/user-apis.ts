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
export async function createCustomer(data: {
  id: string;
  pw: string;
  mobileNumber: string;
  address: string;
  addressDetail: string;
  zipcode: string;
  isServiceTermsAgreed: boolean;
  isPrivacyTermsAgreed: boolean;
  isMarketingTermsAgreed: boolean;
}) {
  client
    .post('/customers', data)
    .then((response) => {
      if (response.status === 201) {
        window.sessionStorage.setItem('accessToken', response.data.accessToken);

        addToast({
          type: 'success',
          message: `${response.data.data.name}님, 환영합니다!`,
        });

        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else throw new CustomError(500, 'fail');
    })
    .catch((e) => {
      e.response.status === 500 &&
        addToast({
          message: e.response.data.error.message,
          type: 'error',
        });
    });
}

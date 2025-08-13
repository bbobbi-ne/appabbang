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
    // Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
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
export async function createCustomer(
  data: {
    id: string;
    pw: string;
    mobileNumber: string;
    address: string;
    addressDetail: string;
    zipcode: string;
    isServiceTermsAgreed: boolean;
    isPrivacyTermsAgreed: boolean;
    isMarketingTermsAgreed: boolean;
  },
  set: (accountToken: string) => void,
) {
  client
    .post('/customers', data)
    .then((response) => {
      if (response.status === 201) {
        // accessToken을 상태관리에 저장
        const accessToken = response.data.accessToken;
        sessionStorage.setItem('accessToken', accessToken);
        set(accessToken);

        // success message
        addToast({
          type: 'success',
          message: `${response.data.data.name}님, 환영합니다!`,
        });

        // 메인페이지 이동
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

/**
 * 로그아웃
 */
export const logout = async (accessToken: string, reset: (accessToken: string) => void) => {
  client
    .post('/customers/logout', {}, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => {
      if (response.status === 204) {
        reset(accessToken);

        addToast({
          type: 'success',
          message: '정상적으로 로그아웃되었습니다. 다음에 다시 만나요!',
        });

        // 메인페이지 이동
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    })
    .catch((e) => {
      e.response.status === 500 &&
        addToast({
          type: 'error',
          message: e.response.data.error.message,
        });
    });
};

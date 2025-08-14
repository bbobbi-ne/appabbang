/**
 * 유저 APIs
 */

import useToast from '@/hooks/useToast';
import { client } from './common-apis';

const { addToast } = useToast();

interface ICustomerProps {
  no: number | null;
  id: string | '';
  name: string | '';
  defaultAddressNo: number | null;
  isServiceTermsAgreed: boolean | null;
  isPrivacyTermsAgreed: boolean | null;
  isMarketingTermsAgreed: boolean | null;
  type: string | null;

  // 필요 민감정보
  // mobileNumber
  // providerId
  // providerType
  // refreshToken
}

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
  setAccessToken: (accountToken: string) => void,
  setCustomer: (model: ICustomerProps) => void,
) {
  try {
    const response = await client.post('/auth/customers/join', data);

    if (response.status === 201) {
      // 고객 간단정보를 상태관리에 저장
      const {
        no,
        id,
        name,
        defaultAddressNo,
        isMarketingTermsAgreed,
        isPrivacyTermsAgreed,
        isServiceTermsAgreed,
        type,
      } = response.data.data;

      const model = {
        no,
        id,
        name,
        defaultAddressNo,
        isServiceTermsAgreed,
        isPrivacyTermsAgreed,
        isMarketingTermsAgreed,
        type,
      };
      setCustomer(model);

      // accessToken을 상태관리에 저장
      const accessToken = response.data.accessToken;
      sessionStorage.setItem('accessToken', accessToken);
      setAccessToken(accessToken);

      // success message
      addToast({
        type: 'success',
        message: `${response.data.data.name}님, 환영합니다!`,
      });

      // 메인페이지 이동
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      throw new CustomError(500, 'fail');
    }
  } catch (e: any) {
    addToast({
      type: 'error',
      message: e.response.data.error.message,
    });
  }
}

/** 카카오 인가코드 받기 */
export async function getKakaoCode() {
  client.get(`http://localhost:4000/auth/kakao/url`).then((response) => {
    document.location.href = response.data.url;
  });
}

/**
 * 로그인
 */
export const login = async (
  data: { id: string; pw: string },
  setAccessToken: (accessToken: string) => void,
  setCustomer: (model: ICustomerProps) => void,
) => {
  try {
    const response = await client.post('/auth/customers/login', data);

    if (response.status === 200) {
      // 고객 간단정보를 상태관리에 저장
      const {
        no,
        id,
        name,
        defaultAddressNo,
        isMarketingTermsAgreed,
        isPrivacyTermsAgreed,
        isServiceTermsAgreed,
        type,
      } = response.data.data;

      const model = {
        no,
        id,
        name,
        defaultAddressNo,
        isServiceTermsAgreed,
        isPrivacyTermsAgreed,
        isMarketingTermsAgreed,
        type,
      };
      setCustomer(model);

      // accessToken을 상태관리에 저장
      const accessToken = response.data.accessToken;
      sessionStorage.setItem('accessToken', accessToken);
      setAccessToken(accessToken);

      // success message
      addToast({
        type: 'success',
        message: `${response.data.data.name}님, 환영합니다!`,
      });

      // 메인페이지 이동
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      throw new CustomError(500, 'fail');
    }
  } catch (e: any) {
    addToast({
      type: 'error',
      message: e.response.data.error.message,
    });
  }
};

/**
 * 로그아웃
 */
export const logout = async (accessToken: string, reset: (accessToken: string) => void) => {
  try {
    const response = await client.post(
      '/auth/customers/logout',
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

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
    } else {
      throw new CustomError(500, 'fail');
    }
  } catch (e: any) {
    addToast({
      type: 'error',
      message: e.response.data.error.message,
    });
  }
};

/**
 * 현재 세션의 고객 정보 조회
 */
export const getCustomer = async (accessToken: string) => {
  try {
    const response = await client.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) return response.data;
    else throw new CustomError(500, 'fail');
  } catch (e: any) {
    addToast({
      type: 'error',
      message: e.response.data.error.message,
    });
  }
};

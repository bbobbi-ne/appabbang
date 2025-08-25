/**
 * 유저 APIs
 */

import useToast from '@/hooks/useToast';
import client from './axios';

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

type CustomerProps = {
  id: string;
  pw: string;
  mobileNumber: string;
  address: string;
  addressDetail: string;
  zipcode: string;
  isServiceTermsAgreed: boolean;
  isPrivacyTermsAgreed: boolean;
  isMarketingTermsAgreed: boolean;
};

/**
 * 회원가입
 */
export async function createCustomer(
  data: CustomerProps,
  setAccessToken: (accountToken: string) => void,
  setCustomer: (model: ICustomerProps) => void,
) {
  try {
    const response = await client.post('/customers', data);

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
    const response = await client.post('/auth/login', data);

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

      return { code: 200, message: 'success', name: response.data.data.name };
    } else {
      return { code: response.status, message: '로그인 실패되었습니다.' };
    }
  } catch (e: any) {
    addToast({ type: 'error', message: e.response.data.error.message });
    return { code: 500, message: e.response.data.error.message };
  }
};

/**
 * 로그아웃
 */
export const logout = async (accessToken: string, reset: (accessToken: string) => void) => {
  try {
    const response = await client.post('/auth/logout');

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
export const getCustomerInfo = async () => {
  try {
    const response = await client.get('/my');
    if (response.status === 200) return response.data;
    else throw new CustomError(500, 'fail');
  } catch (e: any) {
    addToast({
      type: 'error',
      message: e.response.data.error.message,
    });
  }
};

/** 고객정보 수정 타입 */
type CustomerInfoType = { id: string; name: string; mobileNumber: string };
/** 고객정보 수정 */
export const updateCustomer = async ({ id, name, mobileNumber }: CustomerInfoType) => {
  const body = { id, name, mobileNumber };
  await client.put('/my', body);
};

/** 고객정보 수정 타입 */
export type CustomePwType = { pw: string; pwModify: string };
/** 고객정보 수정 : 비밀번호 변경 */
export const updateCustomerPw = async ({ pw, pwModify }: CustomePwType) => {
  await client.put('/my/pw', { pw, pwModify });
};

/** 회원가입 인증코드 이메일 전송 */
export const sendEmail = async (email: string, setEmailCode: (code: string) => void) => {
  const response = await client.post('/customers/send-email', { email });

  if (response.status === 200) {
    // code를 상태관리에 저장
    const code = response.data.code;
    sessionStorage.setItem('code', code);
    setEmailCode(code);

    return response.status;
  }
};

/** 이메일 가져오기 */
export const getEmail = async (email: string) => {
  const response = await client.post(`/customers/email`, { email });

  if (response.status === 200) return response.data;
};

/** 아이디 가져오기 */
export const getId = async (email: string, emailCodeReset: () => void) => {
  try {
    const response = await client.post('/customers/id', { email });

    if (response.status === 200) {
      emailCodeReset();
      return response.data;
    }
  } catch (e: any) {
    addToast({ type: 'error', message: e.response.data.error.message });
  }
};

/** 아이디와 이메일 가져오기 */
export const getIdEmail = async (id: string, email: string) => {
  const response = await client.post('/customers/id-email', { id, email });

  if (response.status === 200) return response.data;
};

/**
 * 이메일 인증코드 비교 : 해싱된 인증코드와 비교함
 * id, email : 비밀번호 찾기 화면에서만 필요한 파라미터
 */
export const compareCode = async (
  code: string,
  hashedCode: string,
  id?: string,
  email?: string,
) => {
  const response = await client.post('/customers/compare-code', { code, hashedCode, id, email });
  return response.data;
};

import { Customers } from '@/api/Customers';
import { CustomHttpClient } from '../httpclient-instance';
import { refreshCreate } from './auth-service';
import type {
  CheckIdCreatePayload,
  CompareCodeCreatePayload,
  CustomersCreatePayload,
  EmailCreatePayload,
  SendEmailCreatePayload,
} from '@/api/data-contracts';

const customerApi = new Customers(new CustomHttpClient({}, refreshCreate));

export const CustomerService = {
  /** 회원가입 */
  create: async (data: CustomersCreatePayload) => {
    const response = await customerApi.customersCreate(data);
    return response.data;
  },
  /** 아이디 중복체크 :: 존재하는 아이디 찾기 */
  getCheckId: async (data: CheckIdCreatePayload) => {
    const response = await customerApi.checkIdCreate(data);
    return response.data;
  },
  /** 이메일 조회 */
  getEmail: async (data: EmailCreatePayload) => {
    const response = await customerApi.emailCreate(data);
    return response.data;
  },
  /** 입력한 이메일로 인증번호 전송 */
  sendEmail: async (email: SendEmailCreatePayload) => {
    const response = await customerApi.sendEmailCreate(email);
    return response.data;
  },
  /** 이메일 인증코드 비교 : 해싱된 인증코드와 비교함.
   *  id, email : "비밀번호 찾기" 화면에서만 필요한 파라미터
   */
  compareCode: async (data: CompareCodeCreatePayload) => {
    const response = await customerApi.compareCodeCreate(data);
    return response.data;
  },
};

import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  generateTempPassword,
  hashPassword,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '@/services/auth.service';
import { AppError } from '@/types';
import { ClientPayload } from '@/types/client-payload';
import { Request, Response } from 'express';
import * as customerService from '@/services/customer.service';
import { sendEmail, sendEmailTempPw } from '@/lib/send-email';

/** 고객 전체 목록 조회 */
export const getList = async (_: Request, res: Response) => {
  const customers = await customerService.getCustomerList();
  res.status(200).json(customers);
};

/** 고객 단건 조회 */
export const getOne = async (req: Request, res: Response) => {
  const { no } = req.params;
  if (!no) throw AppError.badRequest('고객 번호가 필요합니다.');

  const customer = await customerService.getOne(Number(no));
  if (!customer) throw AppError.notFound('해당 고객을 찾을 수 없습니다.');

  res.status(200).json(customer);
};

export const getListAll = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};

/** 회원가입 (고객) */
export const create = async (req: Request, res: Response) => {
  const {
    id,
    name,
    email,
    pw,
    mobileNumber,
    address,
    addressDetail,
    zipcode,
    isServiceTermsAgreed,
    isPrivacyTermsAgreed,
    isMarketingTermsAgreed,
  } = req.body;

  // 중복계정 확인
  const findCustomer = await customerService.getOneForCheck(id);
  if (findCustomer) throw AppError.conflict('이미 존재하는 아이디입니다.');

  const model = {
    id,
    name,
    email,
    pw,
    mobileNumber,
    address,
    addressDetail,
    zipcode,
    isServiceTermsAgreed,
    isPrivacyTermsAgreed,
    isMarketingTermsAgreed,
  };

  // 고객, 배송지, 고객-쿠폰 저장
  const customer = await customerService.createCustomerInfo(model);

  // JWT 토큰 발급
  const payload = { ...customer, type: 'customer' };
  const accessToken = generateAccessToken(payload as ClientPayload);
  const refreshToken = generateRefreshToken(payload as ClientPayload);

  // cookie 설정
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  // 고객 RefreshToken 정보 업데이트
  await customerService.updateRefreshToken(customer.id, refreshToken);

  // 결과값 전송
  const result = {
    data: customer,
    accessToken,
  };

  res.status(201).json(result);
};

export const update = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
// export const remove = async (_: Request, res: Response) => {
//   res.status(204).json('Hello World');
// };

/** 이메일로 인증코드 보내기 */
export const sendEmailCode = async (req: Request, res: Response) => {
  const code = await sendEmail(req.body.email);

  if (!code) throw AppError.internalServerError('이메일 인증번호가 존재하지 않습니다.');

  // 이메일 인증번호 해싱
  const hashedCode = await hashPassword(code);

  res.status(200).json({ code: hashedCode });
};

/** 이메일 조회 */
export const getEmail = async (req: Request, res: Response) => {
  if (!req.body.email)
    throw AppError.badRequest('이메일 조회 과정에서 오류가 발생했습니다. (이메일 누락)');

  const data = await customerService.getEmail(req.body.email);
  res.status(200).json(data);
};

/** 이메일로 아이디 조회 */
export const getId = async (req: Request, res: Response) => {
  const data = await customerService.getId(req.body.email);
  res.status(200).json(data);
};

/** 아이디와 이메일 조회 */
export const getIdEmail = async (req: Request, res: Response) => {
  const { id, email } = await customerService.getIdEmail(req.body.id, req.body.email);
  res.status(200).json({ id, email });
};

/** 아이디와 이메일에 매핑되는 임시 비밀번호 변경 */
export const modifyPw = async (req: Request) => {
  const { id, email } = req.body;
  if (!id || !email)
    throw AppError.internalServerError('비밀번호를 변경할 정보가 확인되지 않습니다.');

  // 임시 비밀번호 생성
  const tempPw = generateTempPassword();
  // 임시 비밀번호 안내 메일 전송
  const code = await sendEmailTempPw(req.body.email, tempPw);
  // 임시 비밀번호로 변경
  await customerService.modifyPw(id, email, tempPw);
  if (!code) throw AppError.internalServerError('임시 비밀번호가 존재하지 않습니다.');

  return { tempPw };
};

/** 고객이 입력한 코드와 해싱 코드 비교 */
export const compareCode = async (req: Request, res: Response) => {
  const { code, hashedCode, email } = req.body;
  if (!code || !hashedCode)
    throw AppError.internalServerError('검증하기 위한 인증번호 정보가 확인되지 않습니다.');

  // 인증번호 비교
  const result = await comparePassword(code, hashedCode);

  // 이메일이 존재할 때만 임시 비밀번호 변경처리.
  // 해당 로직은 비밀번호 찾기 기능에서만 실행되어야 함.
  email && (await modifyPw(req));

  const data = result ? { code: 200 } : { code: 500 };
  res.status(200).json(data);
};

/** 아이디 중복체크 */
export const getCheckId = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) throw AppError.internalServerError('아이디 중복체크를 위한 아이디가 확인되지 않습니다.');

  const response = await customerService.getCheckId(id);
  const data = response ? response.id : null;
  res.status(200).json({ id: data });
};

// 회원탈퇴

export const remove = async (req: Request, res: Response) => {
  const customer = req.user;
  const id = req.user.id;

  if (!customer) throw AppError.unauthorized('회원 정보가 확인되지 않습니다.');

  try {
    await customerService.deleteCustomerByNo(Number(customer.no), id);

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 0,
    });

    res.status(200).json({
      message: '회원 탈퇴가 완료되었습니다.',
      customerNo: customer.no,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw AppError.internalServerError('회원 탈퇴 중 알 수 없는 오류가 발생했습니다.');
  }
};

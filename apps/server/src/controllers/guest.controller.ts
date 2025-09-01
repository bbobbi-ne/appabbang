import { AppError } from '@/types';
import { Request, Response } from 'express';

/** 비회원 로그인 */
export const login = async (req: Request, res: Response) => {
  const { orderer, mobileNumber, orderPw } = req.body;

  if (!orderer || !mobileNumber || !orderPw)
    throw AppError.notFound('비회원 로그인 정보를 입력 바랍니다.');
};

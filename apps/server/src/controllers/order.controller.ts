import { Request, Response } from 'express';
import * as OrderService from '@/services/order.service';
import * as BreadService from '@/services/bread.service';
// import { commonCodeMap } from '@/services/common-code.service';

/** 코드 조회 */
// export function getCodeName(code: string): string {
//   return commonCodeMap.deliveryTypeMap.get(code) || '-';
// }

export const getList = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const getListAll = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const getOne = async (_: Request, res: Response) => {
  // 주문서 보기
  /*
  1. 비회원일경우 
      orderPw 와 mobileNumber 로 주문서 조회

  2. 회원일경우 
      orderNumber 로 주문서 조회  (본인 확인 후 조회)

  3. 관리자일 경우 
      no ?  로 주문서 조회  (권한 확인 후 조회 )
  */
  res.status(200).json('Hello World');
};
export const create = async (req: Request, res: Response) => {
  // 비회원 기준으로 작성됨. 회원 주문은 처리 예정.
  const {
    name,
    mobileNumber,
    address,
    addressDetail,
    zipcode,
    message,
    recipientName,
    recipientMobile,
    orderItems,
    deliveryMethodNo,
    orderPw,
    totalPrice,
  } = req.body;

  const payload = {
    name,
    mobileNumber,
    address,
    addressDetail,
    zipcode,
    message,
    recipientName,
    recipientMobile,
    orderItems,
    deliveryMethodNo,
    orderPw,
    totalPrice,
  };

  const newOrder = await OrderService.createNonMemberOrder(payload);

  res.status(201).json(newOrder);
};
export const update = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const remove = async (_: Request, res: Response) => {
  res.status(204).json('Hello World');
};

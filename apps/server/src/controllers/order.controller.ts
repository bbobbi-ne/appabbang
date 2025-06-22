import { Request, Response } from 'express';
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
  res.status(200).json('Hello World');
};
export const create = async (req: Request, res: Response) => {
  // 주문 생성하기 . 주문 생성 시 주문 상품 목록도 생성되어야함.
  res.status(201).json('Hello World');
};
export const update = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const remove = async (_: Request, res: Response) => {
  res.status(204).json('Hello World');
};

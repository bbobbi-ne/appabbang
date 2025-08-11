import { Request, Response } from 'express';
import { AppError } from '@/types';
import * as DeliveryMethodService from '@/services/delivery-method.service';

/** 배송 방법 목록 조회 */
export const getList = async (req: Request, res: Response) => {
  const data = !req.query ? await getListAll() : await getListByQuery(req.query);
  res.status(200).json(data);
};

/** 배송 방법 목록 조회 (모든 데이터) */
export const getListAll = async () => {
  const list = await DeliveryMethodService.getList();
  return list;
};

/** 배송 방법 목록 조회 (조건 조회) */
export const getListByQuery = async (query: any) => {
  const list = await DeliveryMethodService.getListByQuery(query);
  return list;
};

/** 활성화된 배송 방법 목록 조회 */
export const getListByActive = async (_: Request, res: Response) => {
  const deliveryMethods = await getListByQuery({ isActive: true });
  res.status(200).json(deliveryMethods);
};

/** 배송 방법 상세 조회 */
export const getOne = async (req: Request, res: Response) => {
  const no = req.params.no as unknown as number;
  const one = await DeliveryMethodService.getOne(no);

  if (!one) {
    throw AppError.notFound('배송 방법을 찾을 수 없습니다.', { deliveryMethodNo: no });
  }

  res.status(200).json(one);
};

/** 배송 방법 생성 */
export const create = async (req: Request, res: Response) => {
  const { name, memo = '', fee, isActive, deliveryTypeCode } = req.body;
  const created = await DeliveryMethodService.create({
    name,
    memo,
    fee,
    isActive,
    deliveryTypeCode,
  });

  res.status(201).json(created);
};

/** 배송 방법 수정 */
export const update = async (req: Request, res: Response) => {
  const no = req.params.no as unknown as number;
  const { name, memo = '', fee, isActive, deliveryTypeCode } = req.body;
  const updated = await DeliveryMethodService.update(no, {
    name,
    memo,
    fee,
    isActive,
    deliveryTypeCode,
  });

  res.status(200).json(updated);
};

/** 배송 방법 삭제 */
export const remove = async (req: Request, res: Response) => {
  const no = req.params.no as unknown as number;
  const removed = await DeliveryMethodService.remove(no);

  res.status(204).json(removed);
};

import { prisma } from '@/lib/prisma';
import { commonCodeMap } from '@/services/common-code.service';
import { Request, Response } from 'express';
import { AppError } from '@/types';

/** 코드 조회 */
export function getCodeName(code: string): string {
  return commonCodeMap.deliveryTypeMap.get(code) || '-';
}

/** 배송 방법 목록 조회 */
export const getList = async (req: Request, res: Response) => {
  const data = !req.query ? await getListAll() : await getListByQuery(req.query);
  res.status(200).json(data);
};

/** 배송 방법 목록 조회 (모든 데이터) */
export const getListAll = async () => {
  const deliveryMethods = await prisma.deliveryMethod.findMany();
  const data = deliveryMethods.map((deliveryMethod: any) => ({
    ...deliveryMethod,
  }));

  return data;
};

/** 배송 방법 목록 조회 (조건 조회) */
export const getListByQuery = async (query: any) => {
  const deliveryMethods = await prisma.deliveryMethod.findMany({
    where: { ...query },
  });

  const data = deliveryMethods.map((deliveryMethod: any) => ({
    ...deliveryMethod,
    deliveryTypeName: getCodeName(deliveryMethod.deliveryType),
  }));

  return data;
};

/** 활성화된 배송 방법 목록 조회 */
export const getListByActive = async (_: Request, res: Response) => {
  const deliveryMethods = await getListByQuery({ isActive: true });
  res.status(200).json(deliveryMethods);
};

/** 배송 방법 상세 조회 */
export const getOne = async (req: Request, res: Response) => {
  const { no } = req.params;
  const deliveryMethod = await prisma.deliveryMethod.findUnique({ where: { no: Number(no) } });

  if (!deliveryMethod) {
    throw AppError.notFound('배송 방법을 찾을 수 없습니다.', { deliveryMethodNo: no });
  }

  res
    .status(200)
    .json({ ...deliveryMethod, deliveryTypeName: getCodeName(deliveryMethod.deliveryType) });
};

/** 배송 방법 생성 */
export const create = async (req: Request, res: Response) => {
  const { name, memo = '', fee, isActive, deliveryType } = req.body;

  // 배송 방법 생성.
  const deliveryMethod = await prisma.deliveryMethod.create({
    data: { name, memo, fee, isActive, deliveryType },
  });

  res.status(201).json(deliveryMethod);
};

/** 배송 방법 수정 */
export const update = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { name, memo = '', fee, isActive, deliveryType } = req.body;

  const deliveryMethod = await prisma.deliveryMethod.findUnique({ where: { no: Number(no) } });

  if (!deliveryMethod) {
    throw AppError.notFound('배송 방법을 찾을 수 없습니다.', { deliveryMethodNo: no });
  }

  // 배송 방법 수정.
  const updatedDeliveryMethod = await prisma.deliveryMethod.update({
    where: { no: Number(no) },
    data: { name, memo, fee, isActive, deliveryType },
  });

  res.status(200).json({
    ...updatedDeliveryMethod,
    deliveryTypeName: getCodeName(updatedDeliveryMethod.deliveryType),
  });
};

/** 배송 방법 삭제 */
export const remove = async (req: Request, res: Response) => {
  const { no } = req.params;
  const deliveryMethod = await prisma.deliveryMethod.findUnique({ where: { no: Number(no) } });

  if (!deliveryMethod) {
    throw AppError.notFound('배송 방법을 찾을 수 없습니다.', { deliveryMethodNo: no });
  }

  await prisma.deliveryMethod.delete({ where: { no: Number(no) } });

  res.status(204).json({ message: '배송 방법이 삭제되었습니다.' });
};

import { prisma } from '@/lib/prisma';
import { commonCodeMap } from '@/services/common-code.service';
import { Request, Response } from 'express';

/** 코드 조회 */
export function getCodeName(code: string): string {
  return commonCodeMap.deliveryTypeMap.get(code) || '-';
}

/** 배송 방법 목록 조회 */
export const getList = async (req: Request, res: Response) => {
  try {
    const data = !req.query ? await getListAll() : await getListByQuery(req.query);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
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
  try {
    const deliveryMethods = await getListByQuery({ isActive: true });
    res.status(200).json(deliveryMethods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

/** 배송 방법 상세 조회 */
export const getOne = async (req: Request, res: Response) => {
  try {
    const { no } = req.params;
    const deliveryMethod = await prisma.deliveryMethod.findUnique({ where: { no: Number(no) } });

    if (!deliveryMethod) {
      res.status(404).json({ message: '배송 방법을 찾을 수 없습니다.' });
      return;
    }

    res
      .status(200)
      .json({ ...deliveryMethod, deliveryTypeName: getCodeName(deliveryMethod.deliveryType) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

/** 배송 방법 생성 */
export const create = async (req: Request, res: Response) => {
  try {
    const { name, memo = '', fee, isActive, deliveryType } = req.body;

    // 배송 방법 생성.
    const deliveryMethod = await prisma.deliveryMethod.create({
      data: { name, memo, fee, isActive, deliveryType },
    });

    res.status(201).json(deliveryMethod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

/** 배송 방법 수정 */
export const update = async (req: Request, res: Response) => {
  try {
    const { no } = req.params;
    const { name, memo = '', fee, isActive, deliveryType } = req.body;

    const deliveryMethod = await prisma.deliveryMethod.findUnique({ where: { no: Number(no) } });

    if (!deliveryMethod) {
      res.status(404).json({ message: '배송 방법을 찾을 수 없습니다.' });
      return;
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

/** 배송 방법 삭제 */
export const remove = async (req: Request, res: Response) => {
  try {
    const { no } = req.params;
    const deliveryMethod = await prisma.deliveryMethod.findUnique({ where: { no: Number(no) } });

    if (!deliveryMethod) {
      res.status(400).json({ message: '배송 방법을 찾을 수 없습니다.' });
      return;
    }

    await prisma.deliveryMethod.delete({ where: { no: Number(no) } });

    res.status(204).json({ message: '배송 방법이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

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
    deliveryTypeName: getCodeName(deliveryMethod.deliveryType),
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
    const { deliveryType, name, memo = '', fee, isActive } = req.body;

    // 공통코드 중복 여부 확인
    const commonCode = await prisma.commonCode.findFirst({
      where: { code: deliveryType, groupName: 'delivery_type' },
    });

    if (commonCode) {
      res.status(400).json({ message: '이미 존재하는 배송 방법(code)입니다.' });
      return;
    }

    // 공통코드 생성.
    await prisma.commonCode.create({
      data: { code: deliveryType, name, groupName: 'delivery_type' },
    });

    // 배송 방법 생성.
    const deliveryMethod = await prisma.deliveryMethod.create({
      data: { deliveryType, memo, fee, isActive },
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
    const { name, memo = '', fee, isActive } = req.body;

    const deliveryMethod = await prisma.deliveryMethod.findUnique({ where: { no: Number(no) } });

    if (!deliveryMethod) {
      res.status(404).json({ message: '배송 방법을 찾을 수 없습니다.' });
      return;
    }

    if (name) {
      await updateCommonCodeByDeliveryType(deliveryMethod.deliveryType, name);
    }

    // 배송 방법 수정.
    const updatedDeliveryMethod = await prisma.deliveryMethod.update({
      where: { no: Number(no) },
      data: { memo, fee, isActive },
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

/** deliveryType 에 해당하는 공통코드 찾아서 수정. */
const updateCommonCodeByDeliveryType = async (deliveryType: string, name: string) => {
  const commonCode = await prisma.commonCode.findFirst({
    where: { code: deliveryType, groupName: 'delivery_type' },
  });

  if (!commonCode) {
    throw new Error('공통코드를 찾을 수 없습니다.');
  }

  await prisma.commonCode.update({
    where: { no: commonCode?.no },
    data: { name },
  });
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

    await deleteCommonCodeByDeliveryType(deliveryMethod.deliveryType);
    await prisma.deliveryMethod.delete({ where: { no: Number(no) } });

    res.status(204).json({ message: '배송 방법이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

const deleteCommonCodeByDeliveryType = async (deliveryType: string) => {
  const commonCode = await prisma.commonCode.findFirst({
    where: { code: deliveryType, groupName: 'delivery_type' },
  });

  if (!commonCode) {
    throw new Error('공통코드를 찾을 수 없습니다.');
  }

  await prisma.commonCode.delete({
    where: { no: commonCode.no },
  });
};

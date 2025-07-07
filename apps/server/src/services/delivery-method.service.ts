import { prisma } from '@/lib/prisma';
import { commonCodeMap } from './common-code.service';
import { DeliveryMethod } from '@prisma/client';

/** 코드 조회 */
export const getCodeName = (code: string): string => {
  return commonCodeMap.deliveryTypeMap.get(code) || '-';
};

/** 배송 방법 목록 조회 */
export const getList = async () => {
  const deliveryMethods = await prisma.deliveryMethod.findMany();
  const data = deliveryMethods.map((deliveryMethod) => ({
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

  const data = deliveryMethods.map((deliveryMethod) => ({
    ...deliveryMethod,
    deliveryTypeName: getCodeName(deliveryMethod.deliveryType),
  }));

  return data;
};

/** 배송 방법 상세 조회 */
export const getOne = async (no: number) => {
  const one = await prisma.deliveryMethod.findUnique({ where: { no } });
  const data = {
    ...one,
    deliveryTypeName: getCodeName(one?.deliveryType || ''),
  };
  return data;
};

/** 배송 방법 생성 */
export const create = async (
  data: Pick<DeliveryMethod, 'name' | 'memo' | 'fee' | 'isActive' | 'deliveryType'>,
) => {
  const created = await prisma.deliveryMethod.create({ data });
  return created;
};

/** 배송 방법 수정 */
export const update = async (
  no: number,
  data: Pick<DeliveryMethod, 'name' | 'memo' | 'fee' | 'isActive' | 'deliveryType'>,
) => {
  const updated = await prisma.deliveryMethod.update({ where: { no }, data });
  const result = {
    ...updated,
    deliveryTypeName: getCodeName(updated.deliveryType),
  };
  return result;
};

/** 배송 방법 삭제 */
export const remove = async (no: number) => {
  const removed = await prisma.deliveryMethod.delete({ where: { no } });
  const result = {
    ...removed,
    deliveryTypeName: getCodeName(removed.deliveryType),
  };
  return result;
};

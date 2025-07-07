import { prisma } from '@/lib/prisma';
import { Address } from '@prisma/client';

/** 목록 조회 */
export const getListByCustomerNo = async (no: number) => {
  const list = await prisma.address.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
    where: {
      customerNo: no,
    },
  });
  return list;
};

/** 조회 */
export const getOne = async (no: number) => {
  const one = await prisma.address.findUnique({
    where: {
      no,
    },
  });

  return one;
};

export const getOneByCustomerNo = async (customerNo: number, no: number) => {
  const one = await prisma.address.findUnique({
    where: {
      no,
      customerNo,
    },
  });

  return one;
};

/** 생성 */
export const create = async (data: Omit<Address, 'no' | 'createdAt' | 'updatedAt'>) => {
  const created = await prisma.address.create({
    data,
  });
  return created;
};

/** 수정 */
export const update = async (
  no: number,
  customerNo: number,
  data: Omit<Address, 'no' | 'customerNo' | 'createdAt' | 'updatedAt'>,
) => {
  const updated = await prisma.address.update({
    where: { no, customerNo },
    data,
  });
  return updated;
};

/** 삭제 */
export const remove = async (no: number, customerNo: number) => {
  const removed = await prisma.address.delete({
    where: { no, customerNo },
  });
  return removed;
};

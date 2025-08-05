import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';
import { Address } from '@prisma/client';

/** 배송지 목록 조회 */
export const getAddressList = async (customerNo: number) => {
  const list = await prisma.address.findMany({
    where: { customerNo },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const customer = await prisma.customer.findUnique({
    where: { no: customerNo },
    select: {
      defaultAddressNo: true,
    },
  });

  // 배송지 정렬: 기본배송지 먼저
  const sorted = list.sort((a, b) => {
    if (a.no === customer?.defaultAddressNo) return -1;
    if (b.no === customer?.defaultAddressNo) return 1;
    return a.no - b.no;
  });

  const result = sorted.map((item) => ({
    ...item,
    isDefault: item.no === customer?.defaultAddressNo,
  }));

  return result;
};

/** 배송지 상세 조회 */
export const getAddressOne = async (no: number, customerNo: number) => {
  const one = await prisma.address.findUnique({ where: { no, customerNo } });

  const customer = await prisma.customer.findUnique({
    where: { no: customerNo },
    select: {
      defaultAddressNo: true,
    },
  });

  const result = {
    ...one,
    isDefault: one?.no === customer?.defaultAddressNo,
  };

  return result;
};

/** 배송지 등록 */
export const createAddress = async (
  customerNo: number,
  data: Omit<Address, 'no' | 'customerNo' | 'createdAt' | 'updatedAt'>,
  isDefault: boolean,
) => {
  await prisma.$transaction(async (tx) => {
    const newAddress = await tx.address.create({
      data: { ...data, customerNo },
    });

    const customer = await tx.customer.findFirst({ where: { no: customerNo } });
    const oldDefaultAddressNo = customer?.defaultAddressNo;
    // isDefault 가 true 이거나 기존에 기본 배송지가 없으면 기본 배송지로 설정
    if (isDefault || !oldDefaultAddressNo) {
      await tx.customer.update({
        where: { no: customerNo },
        data: { defaultAddressNo: newAddress.no },
      });
    }
  });
};

/** 배송지 수정 */
export const updateAddress = async (
  no: number,
  customerNo: number,
  data: Omit<Address, 'no' | 'customerNo' | 'createdAt' | 'updatedAt'>,
  isDefault: boolean,
) => {
  await prisma.$transaction(async (tx) => {
    const newAddress = await tx.address.update({ where: { no, customerNo }, data });

    if (isDefault) {
      await tx.customer.update({
        where: { no: customerNo },
        data: { defaultAddressNo: newAddress.no },
      });
    }
  });
};

/** 배송지 삭제 */
export const deleteAddress = async (no: number, customerNo: number) => {
  const customer = await prisma.customer.findFirst({ where: { no: customerNo } });
  const defaultAddressNo = customer?.defaultAddressNo;

  if (defaultAddressNo === no) {
    throw AppError.unprocessableEntity('기본 배송지는 삭제 불가능합니다.');
  }

  await prisma.address.delete({ where: { no, customerNo } });
};

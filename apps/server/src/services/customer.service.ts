import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';

/** 기본 주소 변경 */
export const updateDefaultAddressNo = async (customerNo: number, addressNo: number) => {
  const updatedCustomer = await prisma.customer.update({
    where: { no: customerNo },
    data: {
      defaultAddressNo: addressNo,
    },
  });
  return updatedCustomer;
};

/** 고객 조회 */
export const getOne = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    throw AppError.notFound('Customer not found');
  }

  return customer;
};

/**
 * refreshToken 초기화 (고객)
 */
export const invalidateRefreshToken = async (no: number, id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const update = await tx.customer.update({
      where: { no, id },
      data: { refreshToken: null },
    });

    return update;
  });

  return result;
};

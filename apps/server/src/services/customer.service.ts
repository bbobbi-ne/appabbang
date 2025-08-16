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

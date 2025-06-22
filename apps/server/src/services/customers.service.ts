import { prisma } from '@/lib/prisma';
import { Customers } from '@prisma/client';

/** 고객 생성 (비회원) */
export const createCustomer = async (customer: Customers) => {
  const { name, mobileNumber } = customer;

  const newCustomer = await prisma.customers.create({
    data: {
      name,
      mobileNumber,
    },
  });
  return newCustomer;
};

/** 기본 주소 변경 */
export const updateDefaultAddressNo = async (customerNo: number, addressNo: number) => {
  const updatedCustomer = await prisma.customers.update({
    where: { no: customerNo },
    data: {
      defaultAddressNo: addressNo,
    },
  });
  return updatedCustomer;
};

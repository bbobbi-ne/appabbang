import { prisma } from '@/lib/prisma';
import { Customer } from '@prisma/client';

export const getByIdForLogin = async (id: string) => {
  const customer = await prisma.customer.findFirst({
    where: { id },
    select: {
      no: true,
      id: true,
      pw: true,
      name: true,
    },
  });

  return customer;
};

/** 고객 생성 (비회원) */
export const createCustomer = async (customer: Customer) => {
  const { name, mobileNumber } = customer;

  const newCustomer = await prisma.customer.create({
    data: {
      name,
      mobileNumber,
    },
  });
  return newCustomer;
};

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

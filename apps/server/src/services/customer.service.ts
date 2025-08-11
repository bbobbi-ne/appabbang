import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';
import { Address, Customer } from '@prisma/client';

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

/** 고객 생성  */
export const createCustomer = async (customer: Customer, address: Address) => {
  // const newCustomer = await prisma.customer.create({
  //   data: {
  //     name: '1',
  //     mobileNumber: '23',
  //   },
  // });
  // return newCustomer;

  return null;
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

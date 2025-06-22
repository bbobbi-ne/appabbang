import { prisma } from '@/lib/prisma';
import { Address } from '@prisma/client';

/** 주소 목록 조회 */
export const getAddressList = async () => {
  const addressList = await prisma.address.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  });
  return addressList;
};

/** 주소 조회 */
export const getAddress = async (no: number) => {
  const address = await prisma.address.findUnique({
    where: { no },
  });
  return address;
};

/** 주소 생성 */
export const createAddress = async (address: Omit<Address, 'no' | 'createdAt' | 'updatedAt'>) => {
  const newAddress = await prisma.address.create({
    data: address,
  });
  return newAddress;
};

/** 주소 수정 */
export const updateAddress = async (
  no: number,
  address: Omit<Address, 'no' | 'customerNo' | 'createdAt' | 'updatedAt'>,
) => {
  const updatedAddress = await prisma.address.update({
    where: { no },
    data: address,
  });
  return updatedAddress;
};

/** 주소 삭제 */
export const deleteAddress = async (no: number) => {
  const deletedAddress = await prisma.address.delete({
    where: { no },
  });
  return deletedAddress;
};

import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';
import { Address } from '@prisma/client';
import { commonCodeMap } from './common-code.service';

/** 코드 조회 */
export const getCodeName = (code: string): string => {
  return commonCodeMap.orderStatusMap.get(code) || '-';
};

/** 내 정보 상세정보 조회 */
export const getMyInfo = async (no: number) => {
  const result = await prisma.$transaction(async (tx) => {
    // 고객정보
    const customer = await tx.customer.findUnique({
      where: { no },
      select: {
        no: true,
        id: true,
        name: true,
        mobileNumber: true,
        defaultAddressNo: true,
        createdAt: true,

        // relationship
        address: true,
        customerCoupon: true,
      },
    });

    // 할인정보
    const coupon = await tx.customerCoupon.findMany({
      where: { customerNo: no },
      include: {
        coupon: true,
      },
    });

    return { customer, coupon };
  });

  return result;
};

/**
 * 내 정보 상세 조회(민감정보 조회 전용)
 * email, pw, refreshToken 등
 */
export const getMyInfoDetail = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({ where: { id } });

    return customer;
  });

  return result;
};

/**
 * 주문 누적금액 조회
 */
export const getOrderAccumulatedAmount = async (no: number) => {
  const result = await prisma.$transaction(async (tx) => {
    let totalPrice = 0;

    const getTotalPrice = await tx.order.aggregate({
      where: { customerNo: no },
      _sum: { totalPrice: true },
    });

    if (getTotalPrice._sum) {
      totalPrice = getTotalPrice._sum.totalPrice || 0;
    }

    return totalPrice;
  });

  return result;
};

/**
 * 내 정보 수정
 */
export const update = async (
  no: number,
  data: {
    mobileNumber: string;
  },
) => {
  const result = await prisma.$transaction(async (tx) => {
    const updateCustomer = await tx.customer.update({
      where: { no },
      data: { mobileNumber: data.mobileNumber },
    });

    return updateCustomer;
  });

  return result;
};

/**
 * 내 정보 수정 : 비밀번호 변경
 */
export const updatePw = async (no: number, hashedPw: string): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    await tx.customer.update({
      where: { no },
      data: {
        pw: hashedPw,
      },
    });
  });
};

/** 내 배송지 목록 조회 */
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

/** 내 배송지 상세 조회 */
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

/** 내 배송지 등록 */
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

/** 내 배송지 수정 */
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

/** 내 배송지 삭제 */
export const deleteAddress = async (no: number, customerNo: number) => {
  const customer = await prisma.customer.findFirst({ where: { no: customerNo } });
  const defaultAddressNo = customer?.defaultAddressNo;

  if (defaultAddressNo === no) {
    throw AppError.unprocessableEntity('기본 배송지는 삭제 불가능합니다.');
  }

  await prisma.address.delete({ where: { no, customerNo } });
};

/** 내 주문내역 목록 */
export const getOrders = async (customerNo: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const list = await tx.order.findMany({
      where: {
        customerNo,
        createdAt: {
          gte: oneYearAgo, // 1년 전 이후부터
          lte: now, // 현재일자까지
        },
      },
      include: { orderItems: true },
      orderBy: { no: 'desc' },
    });

    return list.map((item) => ({
      ...item,
      orderStatusName: getCodeName(item.orderStatus),
    }));
  });

  return result;
};

/** 내 주문 조회 */
export const getOrder = async (no: number) => {
  const order = await prisma.order.findUnique({ where: { no }, include: { orderItems: true } });

  if (!order) throw AppError.notFound('주문을 찾을 수 없습니다.');

  return { ...order, orderStatusName: getCodeName(order.orderStatus) };
};

/** 내 주문 배송지 조회 */
export const getOrderAddress = async (no: number) => {
  const order = await prisma.order.findUnique({ where: { no } });

  if (!order) throw AppError.notFound('주문을 찾을 수 없습니다.');

  const result = {
    address: order.address,
    addressDetail: order.addressDetail,
    zipcode: order.zipcode,
    message: order.message,
    recipientName: order.recipientName,
    recipientMobile: order.recipientMobile,
  };

  return result;
};

/** 내 주문 배송지 수정 */
export const updateOrderAddress = async (
  no: number,
  data: {
    address: string;
    addressDetail: string;
    zipcode: string;
    message: string;
    recipientName: string;
    recipientMobile: string;
  },
) => {
  await prisma.order.update({ where: { no }, data });
};

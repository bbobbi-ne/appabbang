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
  // 고객정보
  const result = await prisma.customer.findUnique({
    where: { no },
    select: {
      no: true,
      id: true,
      email: true,
      name: true,
      mobileNumber: true,
      createdAt: true,
    },
  });

  return result;
};

/** 고객의 할인쿠폰 개수 조회 */
export const getCustomerCouponCount = async (no: number) => {
  // 고객의 할인정보
  const data = await prisma.customerCoupon.count({ where: { customerNo: no } });
  return data;
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

/** 내 연락처 조회 */
export const getMyContact = async (no: number) => {
  const result = await prisma.customer.findUnique({
    where: { no },
    select: {
      name: true,
      mobileNumber: true,
    },
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
    email: string;
    mobileNumber: string;
  },
) => {
  const result = await prisma.$transaction(async (tx) => {
    const updateCustomer = await tx.customer.update({
      where: { no },
      data: { email: data.email, mobileNumber: data.mobileNumber },
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

/** 내 주문 목록 */
export const getOrders = async (customerNo: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const list = await tx.order.findMany({
      select: {
        no: true,
        orderNumber: true,
        orderStatus: true,
        orderRoundNo: true,
        createdAt: true,
        orderItems: {
          select: {
            no: true,
            breadImageUrl: true,
            breadName: true,
            unitPrice: true,
            quantity: true,
          },
        },
      },
      where: {
        customerNo,
        createdAt: {
          gte: oneYearAgo, // 1년 전 이후부터
          lte: now, // 현재일자까지
        },
      },
      // include: { orderItems: true },
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
  const order = await prisma.order.findUnique({
    where: { no },
    select: {
      no: true,
      orderNumber: true,
      orderStatus: true,
      createdAt: true,
      totalPrice: true,
      deliveryMethodFee: true,
      discountAmount: true,
      orderItems: {
        select: {
          no: true,
          breadName: true,
          breadImageUrl: true,
          unitPrice: true,
          totalPrice: true,
          quantity: true,
        },
      },
      address: true,
      addressDetail: true,
      zipcode: true,
      message: true,
      recipientName: true,
      recipientMobile: true,
      ordererName: true,
      ordererMobile: true,
      deliveryTypeCode: true,
    },
  });

  if (!order) throw AppError.notFound('주문을 찾을 수 없습니다.');

  return { ...order, orderStatusName: getCodeName(order.orderStatus) };
};

/** 내 주문 취소 */
export const cancelOrder = async (no: number, canceledReason: string) => {
  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { no }, data: { orderStatus: '50' } });
    await tx.payment.update({ where: { orderNo: no }, data: { canceledReason } });
  });
};

/** 내 주문 배송(수령) 조회 */
export const getOrderDelivery = async (no: number) => {
  const order = await prisma.order.findUnique({
    where: { no },
    select: {
      no: true,
      orderNumber: true,
      orderStatus: true,
      createdAt: true,
      orderItems: {
        select: {
          no: true,
          breadName: true,
          breadImageUrl: true,
          unitPrice: true,
          quantity: true,
        },
      },
      address: true,
      addressDetail: true,
      zipcode: true,
      message: true,
      recipientName: true,
      recipientMobile: true,
      deliveryMethodName: true,
      deliveryTypeCode: true,
      trackingNumber: true,
    },
  });

  if (!order) throw AppError.notFound('주문을 찾을 수 없습니다.');

  return { ...order, orderStatusName: getCodeName(order.orderStatus) };
};

/** 내 주문 배송지 조회 */
export const getOrderAddress = async (no: number) => {
  const order = await prisma.order.findUnique({
    where: { no },
    select: {
      address: true,
      addressDetail: true,
      zipcode: true,
      message: true,
      recipientName: true,
      recipientMobile: true,
    },
  });

  if (!order) throw AppError.notFound('주문을 찾을 수 없습니다.');

  return order;
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

/** 내가 주문했던 주문인지 확인하는 메서드 (완료, 취소, 환불 제외) */
export const checkHasOrder = async (customerNo: number, orderRoundNo: number): Promise<boolean> => {
  const order = await prisma.order.findFirst({
    where: {
      orderRoundNo,
      customerNo,
      orderStatus: { notIn: ['40', '50', '51', '52'] },
      // 완료, 취소요청, 취소완료, 취소완료(환불)
    },
    select: {
      no: true,
    },
  });

  const hasOrder = !!order;
  return hasOrder;
};

/** 내 쿠폰내역 조회 */
export const getCouponList = async (customerNo: number) => {
  const customerCoupon = await prisma.customerCoupon.findMany({
    where: { customerNo },
    select: {
      no: true,
      issuedAt: true,
      expiredAt: true,
      isUsed: true,
      isExpired: true,

      coupon: {
        select: {
          no: true,
          name: true,
          amount: true,
        },
      },
    },
  });

  if (!customerCoupon) throw AppError.notFound('고객님의 쿠폰을 찾을 수 없습니다.');
  return customerCoupon;
};

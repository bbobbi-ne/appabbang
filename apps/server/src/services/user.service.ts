import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';

/**
 * 로그인하기 위한 사용자 정보 조회 (민감정보)
 * @param id
 * @returns user: User 테이블 정보
 */
export const getByIdForLogin = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      no: true,
      id: true,
      pw: true,
      name: true,
      userRole: true,
    },
  });

  return user;
};

/** refreshToken 업데이트 (어드민) */
export const updateRefreshToken = async (id: string, refreshToken: string | null) => {
  const user = await prisma.user.update({
    where: { id },
    data: { refreshToken },
  });

  return user;
};

/** 존재하는지만 확인하는 조회 함수 */
export const getOneForCheck = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      no: true,
      id: true,
    },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  return user;
};

////////////////////////////////////////////////////////////////

/**
 * 고객 상세정보 조회
 */
export const getCustomerInfo = async (no: number) => {
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
 * 고객정보 수정
 */
export const update = async (data: {
  id: string;
  name: string;
  mobileNumber: string;
  createdAt: string;
}) => {
  const result = await prisma.$transaction(async (tx) => {
    const updateCustomer = await tx.customer.update({
      where: { id: data.id },
      data: { mobileNumber: data.mobileNumber },
    });

    return updateCustomer;
  });

  return result;
};

/**
 * 고객정보 상세 조회(민감정보 조회 전용)
 * email, pw, refreshToken 등
 */
export const findCustomerDetail = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({ where: { id } });

    return customer;
  });

  return result;
};

/**
 * 고객정보 수정 : 비밀번호 변경
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

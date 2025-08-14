import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';

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

// 리프레시토큰 업데이트
export const updateRefreshToken = async (id: string, refreshToken: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: { refreshToken },
  });

  return user;
};

/** 유저 조회 */
export const getOne = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  return user;
};

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

    console.log('<customer>');
    console.log(customer);

    // 할인정보
    const coupon = await tx.customerCoupon.findMany({
      where: { customerNo: no },
      include: {
        coupon: true,
      },
    });

    console.log('<coupon>');
    console.log(coupon);

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

    console.log('totalPrice');
    console.log(getTotalPrice);

    if (getTotalPrice._sum) {
      totalPrice = getTotalPrice._sum.totalPrice || 0;
    }

    return totalPrice;
  });

  return result;
};

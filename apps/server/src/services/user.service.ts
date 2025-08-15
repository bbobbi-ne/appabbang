import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';
import { ClientPayload, ClientType } from '@/types/client-payload';

/** 클라이언트 조회 */
export async function getClientForLogin(id: string, type: ClientType) {
  // 사용자가 관리자인 경우
  if (type === ClientType.USER) {
    const user = await getByIdForLogin(id);
    if (!user) throw AppError.unauthorized('아이디 또는 비밀번호를 확인해주세요.');
    return {
      ...user,
      type,
      pw: user.pw,
      userRole: user.userRole as 'admin' | 'subadmin',
    };
  }

  // 사용자가 고객인 경우
  if (type === ClientType.CUSTOMER) {
    const customer = await getByIdForLogin(id);
    if (!customer?.pw || !customer.id) {
      throw AppError.unauthorized('아이디 또는 비밀번호를 확인해주세요.');
    }
    return {
      no: customer.no,
      name: customer.name,
      id: customer.id,
      pw: customer.pw,
      type,
    };
  }

  throw AppError.badRequest('잘못된 로그인 유형입니다.');
}

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
 * 고객정보 상세 조회(비밀번호 포함)
 */
export const findCustomerPw = async (no: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: { no },
      select: { no: true, pw: true },
    });

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

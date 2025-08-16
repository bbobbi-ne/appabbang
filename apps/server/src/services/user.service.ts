import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';
import { ClientType } from '@/types/client-payload';
import { Customer } from '@prisma/client';

/**  Customer 등록 타입 */
export type CreateCustomerInput = Pick<
  Customer,
  | 'id'
  | 'name'
  | 'pw'
  | 'mobileNumber'
  | 'isServiceTermsAgreed'
  | 'isPrivacyTermsAgreed'
  | 'isMarketingTermsAgreed'
> & {
  address: string;
  addressDetail: string;
  zipcode: string;
};

/**
 * 회원가입 : 고객, 배송지, 고객-쿠폰 저장
 */
export const createCustomerInfo = async (data: CreateCustomerInput) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const {
        id,
        name,
        pw,
        mobileNumber,
        address,
        addressDetail,
        zipcode,
        isServiceTermsAgreed,
        isPrivacyTermsAgreed,
        isMarketingTermsAgreed,
      } = data;

      // 고객 생성
      const createCustomer = await tx.customer.create({
        data: {
          id,
          name,
          pw,
          mobileNumber,
          isServiceTermsAgreed,
          isPrivacyTermsAgreed,
          isMarketingTermsAgreed,
        },
      });

      if (createCustomer) {
        // 배송지 저장
        const addressInfo = await tx.address.create({
          data: {
            address,
            addressDetail,
            zipcode,
            message: '문 앞에 놓아주세요.',
            recipientName: name,
            recipientMobile: mobileNumber,
            customerNo: createCustomer.no,
          },
        });

        // 고객-기본배송지 연결
        await tx.customer.update({
          where: { no: createCustomer.no },
          data: {
            defaultAddressNo: addressInfo.no,
          },
        });

        // 쿠폰 조회
        const coupon = await tx.coupon.findFirst({
          where: { no: 1 },
          select: {
            no: true,
            expireAfterDays: true,
          },
        });

        if (coupon) {
          const date = new Date();
          // 쿠폰 만료일 = 현재(발생)일자 + 발급일 기준 만료일
          date.setDate(date.getDate() + coupon.expireAfterDays);
          const expiredAt = date;

          // 고객-쿠폰 발급정보 저장
          await tx.customerCoupon.create({
            data: {
              issuedAt: new Date(),
              expiredAt,
              isUsed: false,
              isExpired: false,
              couponNo: coupon.no,
              customerNo: createCustomer.no,
            },
          });
        }
      }

      return createCustomer;
    });

    return result;
  } catch (e) {
    throw AppError.internalServerError(
      '고객 정보를 등록하는 과정에서 문제가 발생했습니다. 관리자 확인이 필요합니다. (info)',
    );
  }
};

/**
 * 로그인
 * @params id: 아이디, refreshToken: 리프레시 토큰
 */
export const updateCustomerRefreshToken = async (id: string, refreshToken: string) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.update({
        where: { id },
        data: { refreshToken },
      });

      return customer;
    });

    return result;
  } catch (e) {
    throw AppError.internalServerError(
      '고객 정보를 등록하는 과정에서 오류가 발생했습니다. 관리자 확인이 필요합니다. (refresh)',
    );
  }
};

/**
 * 로그아웃 - refreshToken 초기화
 */
export const invalidateRefreshToken = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const update = await tx.customer.update({
      where: { id },
      data: { refreshToken: null },
    });

    return update;
  });

  return result;
};

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
    const customer = await findCustomerDetail(id);
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

/**
 * 로그인하기 위한 사용자 정보 조회
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

/**
 * 로그아웃 - 토큰에 담겨져 있는 고객 정보 조회
 */
export const getTokenCustomer = async (data: CreateCustomerInput) => {
  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findFirst({
      where: { id: data.id },
    });

    return customer;
  });

  return result;
};

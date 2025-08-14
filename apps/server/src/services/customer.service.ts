import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Customer } from '@prisma/client';

const SALT_ROUNDS = 10;

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const JWT_ACCESS_EXPIRES_IN = '1h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
const JWT_REFRESH_EXPIRES_IN = '7d';

// OrderRound 등록 타입
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

type PayloadType = {
  refreshToken: string | null;
  id: string;
  name: string;
  pw: string;
  mobileNumber: string;
  isServiceTermsAgreed: boolean;
  isPrivacyTermsAgreed: boolean;
  isMarketingTermsAgreed: boolean;
  no: number;
  providerType: string | null;
  providerId: string | null;
  defaultAddressNo: number | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * id로 고객 로그인 계정 찾기
 * @param id
 * @returns
 */
export const getByIdForLogin = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findFirst({
      where: { id },
    });

    return customer;
  });

  return result;
};

/**
 * 고객 생성
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

/**
 * AccessToken 발급
 */
export const generateAccessToken = (model: PayloadType) => {
  return jwt.sign(model, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });
};

/**
 * RefreshToken 발급
 */
export const generateRefreshToken = (model: PayloadType) => {
  return jwt.sign(model, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

/**
 * 고객 RefreshToken 업데이트
 */
export const updateRefreshToken = async (id: string, refreshToken: string) => {
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

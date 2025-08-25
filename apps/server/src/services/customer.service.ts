import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';
import { Customer } from '@prisma/client';
import { hashPassword } from './auth.service';

/**
 * 로그인하기 위한 사용자 정보 조회 (민감정보)
 * @param id
 * @returns customer: Customer 테이블 정보
 */
export const getByIdForLogin = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: {
      no: true,
      id: true,
      name: true,
      pw: true,
    },
  });

  return customer;
};

/** refreshToken 업데이트 (고객) */
export const updateRefreshToken = async (id: string, refreshToken: string | null) => {
  const customer = await prisma.customer.update({
    where: { id },
    data: { refreshToken },
  });

  return customer;
};

/**  Customer 등록 타입 */
export type CreateCustomerInput = Pick<
  Customer,
  | 'id'
  | 'name'
  | 'email'
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
        email,
        pw,
        mobileNumber,
        address,
        addressDetail,
        zipcode,
        isServiceTermsAgreed,
        isPrivacyTermsAgreed,
        isMarketingTermsAgreed,
      } = data;

      const hashedPw = await hashPassword(pw);

      // 고객 생성
      const createCustomer = await tx.customer.create({
        data: {
          id,
          name,
          email,
          pw: hashedPw,
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

/** 존재하는지만 확인하는 조회 함수 */
export const getOneForCheck = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: {
      no: true,
      id: true,
    },
  });

  return customer;
};

/** 이메일 조회 */
export const getEmail = async (email: string) => {
  return await prisma.customer.findFirst({
    where: { email },
    select: { email: true },
  });
};

/** 이메일로 아이디 조회 */
export const getId = async (email: string) => {
  const id = await prisma.customer.findFirst({
    where: { email },
    select: { id: true },
  });

  if (!id) throw AppError.notFound('해당 이메일은 존재하지 않습니다.');

  return id;
};

/** 아이디와 이메일 조회 */
export const getIdEmail = async (id: string, email: string) => {
  const customer = await prisma.customer.findFirst({
    where: { id, email },
    select: { id: true, email: true },
  });

  if (!customer) throw AppError.notFound('해당 정보는 존재하지 않습니다.');

  return customer;
};

/** 비밀번호 변경 */
export const modifyPw = async (id: string, email: string, pw: string) => {
  //해시 비밀번호 생성
  const hashedPw = await hashPassword(pw);

  await prisma.$transaction(async (tx) => {
    await tx.customer.update({
      where: { id, email },
      data: {
        pw: hashedPw,
      },
    });
  });
};

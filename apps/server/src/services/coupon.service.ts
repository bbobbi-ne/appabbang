import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';

export type CreateCouponRequestBody = {
  name: string;
  amount: number;
  expireAfterDays: number;
};
export type UpdateCouponRequestBody = Partial<CreateCouponRequestBody>;

/** 쿠폰 목록 조회 */
export const getList = async () => {
  const coupons = await prisma.coupon.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return coupons;
};

/** 쿠폰 상세 조회 */
export const getOne = async (no: number) => {
  const coupon = await prisma.coupon.findUnique({
    where: {
      no,
    },
    select: {
      no: true,
      name: true,
      amount: true,
      expireAfterDays: true,
    },
  });
  return coupon;
};

/** 쿠폰 생성 */
export const create = async (data: CreateCouponRequestBody) => {
  const coupon = await prisma.coupon.create({
    data,
  });
  return coupon;
};

/** 쿠폰 수정 */
export const update = async (no: number, data: UpdateCouponRequestBody) => {
  // 첫 로그인 쿠폰이거나, 이미 발급된 쿠폰이 있을 경우 "이름"만 수정 가능
  const isFirstLoginCoupon = no === 1;
  const customerCoupon = await prisma.customerCoupon.findFirst({
    where: { couponNo: no },
    select: { couponNo: true },
  });

  const updateData =
    isFirstLoginCoupon || customerCoupon ? { ...(data.name && { name: data.name }) } : data;

  const coupon = await prisma.coupon.update({
    where: { no },
    data: updateData,
  });
  return coupon;
};

/** 쿠폰 삭제 */
export const remove = async (no: number) => {
  // 존재하지 않는 쿠폰일 경우 잘못된 요청
  const coupon = await prisma.coupon.findUnique({
    where: { no },
  });
  if (!coupon) {
    throw AppError.badRequest('존재하지 않는 쿠폰입니다.');
  }

  // 조건 1. 첫 로그인 쿠폰은 삭제 불가
  if (no === 1) {
    throw AppError.badRequest('첫 로그인 쿠폰은 삭제할 수 없습니다.');
  }

  // 조건 2. 고객에게 발급한 쿠폰이 존재할 경우 삭제 불가
  const customerCoupon = await prisma.customerCoupon.findFirst({
    where: { couponNo: no },
    select: { couponNo: true },
  });
  if (customerCoupon) {
    throw AppError.badRequest('고객에게 발급한 쿠폰이 존재합니다.');
  }

  // 쿠폰 삭제
  await prisma.coupon.delete({
    where: {
      no,
    },
  });

  return true;
};

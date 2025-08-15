import { CustomHttpClient } from './instance';
import { toast } from 'sonner';
import { Coupons } from '@/api/Coupons';
import type { CouponsCreatePayload, CouponsUpdatePayload } from '@/api/data-contracts';

const couponApi = new Coupons(new CustomHttpClient());

/** 서비스: 쿠폰 목록 조회 */
export const getCouponsList = async () => {
  try {
    const response = await couponApi.couponsList();
    return response.data;
  } catch (error: any) {
    const message = error.data.message || '쿠폰목록을 불러오는데 실패했습니다.';
    toast.error('쿠폰목록을 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

/** 서비스: 쿠폰 상세 조회 */
export const getCouponDetail = async (no: number) => {
  try {
    const response = await couponApi.couponsDetail(no);
    return response.data;
  } catch (error: any) {
    const message = error.data.message || '쿠폰을 불러오는데 실패했습니다.';
    toast.error('쿠폰을 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

/** 서비스: 쿠폰 생성 */
export const createCoupon = async (data: CouponsCreatePayload) => {
  try {
    await couponApi.couponsCreate(data);
  } catch (error: any) {
    const message = error.data.message || '쿠폰을 생성하는데 실패했습니다.';
    toast.error('쿠폰을 생성하는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

/** 서비스: 쿠폰 수정 */
export const updateCoupon = async (no: number, data: CouponsUpdatePayload) => {
  try {
    await couponApi.couponsUpdate(no, data);
  } catch (error: any) {
    const message = error.data.message || '쿠폰을 수정하는데 실패했습니다.';
    toast.error('쿠폰을 수정하는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

/** 서비스: 쿠폰 삭제 */
export const deleteCoupon = async (no: number) => {
  try {
    await couponApi.couponsDelete(no);
  } catch (error: any) {
    const message = error.data.message || '쿠폰을 삭제하는데 실패했습니다.';
    toast.error('쿠폰을 삭제하는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

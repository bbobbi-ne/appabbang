import { CustomHttpClient } from './instance';
import { toast } from 'sonner';
import { Coupons } from '@/api/Coupons';

const couponApi = new Coupons(new CustomHttpClient());

export const getCouponsList = async () => {
  try {
    const response = await couponApi.couponsList();
    // toast.success('쿠폰목록 조회에 성공했습니다.');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '쿠폰목록을 불러오는데 실패했습니다.';
    toast.error('쿠폰목록을 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

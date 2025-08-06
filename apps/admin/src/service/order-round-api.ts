import { OrderRound } from '@/api/OrderRound';
import { CustomHttpClient } from './instance';
import { toast } from 'sonner';

const orderRoundsApi = new OrderRound(new CustomHttpClient());

export const getOrderRoundsList = async () => {
  try {
    const response = await orderRoundsApi.orderRoundList();
    // toast.success('주문차수 조회에 성공했습니다.');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '주문차수를 불러오는데 실패했습니다.';
    toast.error('주문차수를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

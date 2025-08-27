import { OrderRound } from '@/api/OrderRound';
import { CustomHttpClient } from '../httpclient-instance';

const orderRoundApi = new OrderRound(new CustomHttpClient());

export const OrderRoundService = {
  /** 최신 주문차수 조회 */
  getLatest: async () => {
    const response = await orderRoundApi.latestList();
    return response.data;
  },
  /** 특정 주문차수 조회 */
  getOrderRound: async (no: number) => {
    const response = await orderRoundApi.orderRoundDetail(no);
    return response.data;
  },
  /** 현재일시가 포함하는 특정 주문차수 조회 */
  getOrderRoundNow: async () => {
    const response = await orderRoundApi.getOrderRound();
    return response.data;
  },
};

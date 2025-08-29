import { OrderRound } from '@/api/OrderRound';
import { CustomHttpClient } from '../httpclient-instance';

const orderRoundApi = new OrderRound(new CustomHttpClient());

export const OrderRoundService = {
  /** 현재 주문차수 조회 (메인페이지 표기용) */
  getOrderRoundCurrent: async () => {
    const response = await orderRoundApi.someThing(`/order-round/current`);
    return response.data;
  },
  /** 특정 주문차수가 진행중인지 확인 */
  checkOpenByNo: async (no: number) => {
    const response = await orderRoundApi.someThing(`/order-round/${no}/is-open`);
    return response.data;
  },
  /** 오픈된 특정 주문차수 조회 */
  getOpenOrderRound: async (no: number) => {
    const response = await orderRoundApi.someThing(`/order-round/open/${no}`);
    return response.data;
  },
  /** 현재일시가 포함하는 특정 주문차수 조회 */
  getOrderRoundNow: async () => {
    const response = await orderRoundApi.getOrderRound();
    return response.data;
  },
};

import client from '@/services/axios';

export const OrderRoundService = {
  /** 최신 주문차수 조회 */
  getLatest: async () => {
    const response = await client.get(`/order-round/latest`);
    return response.data;
  },
  /** 특정 주문차수 조회 */
  getOrderRound: async (no: number) => {
    const response = await client.get(`/order-round/${no}`);
    return response.data;
  },
  /** 현재일시가 포함하는 특정 주문차수 조회 */
  getOrderRoundNow: async () => {
    const response = await client.get(`/order-round/now`);
    return response.data;
  },
};

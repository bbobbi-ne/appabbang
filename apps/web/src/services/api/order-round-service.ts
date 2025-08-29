import client from '@/services/axios';

export const OrderRoundService = {
  /** 현재 주문차수 조회 (메인페이지 표기용) */
  getOrderRoundCurrent: async () => {
    const response = await client.get(`/order-round/current`);
    return response.data;
  },
  /** 특정 주문차수가 진행중인지 확인 */
  checkOpenByNo: async (no: number) => {
    const response = await client.get(`/order-round/${no}/is-open`);
    return response.data;
  },
  /** 오픈된 특정 주문차수 조회 */
  getOpenOrderRound: async (no: number) => {
    const response = await client.get(`/order-round/open/${no}`);
    return response.data;
  },
};

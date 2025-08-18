import client from './axios';

/** 최신 주문차수 조회 */
export async function getLatest() {
  return client.get(`/order-round/latest`);
}

/** 특정 주문차수 조회 */
export async function getOrderRound(no: number) {
  return client.get(`/order-round/${no}`);
}

/** 현재일시가 포함하는 특정 주문차수 조회 */
export async function getOrderRoundNow() {
  return client.get(`/order-round/now`);
}

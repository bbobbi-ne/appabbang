import client from './axios';

/** 배송방법 목록 조회 */
export async function searchDeliveryList() {
  return await client.get(`/delivery-methods/active`);
}

/** 은행코드 목록 */
export async function searchBankList() {
  return await client.get(`/common-code/bank_code`);
}

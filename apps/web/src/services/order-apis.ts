import type { CustomerOrderFormSchema, FormSchema } from '@/validate/order-form-schema';
import client from './axios';

/** 전체 빵 목록 조회 */
export async function searchBreadList() {
  const breadStatus = 10; // 판매중
  return await client.get(`/breads?breadStatus=${breadStatus}`);
}

/** 배송방법 목록 조회 */
export async function searchDeliveryList() {
  return await client.get(`/delivery-methods/active`);
}

/** 은행코드 목록 */
export async function searchBankList() {
  return await client.get(`/common-code/bank_code`);
}

/** 주문서 등록 */
export async function insertOrders(data: FormSchema | CustomerOrderFormSchema) {
  await client.post('/orders', data).catch((error) => {
    console.log(error);
  });
}

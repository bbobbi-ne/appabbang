import type { addresssDailogForm } from '@/validate/address-form.schema';
import client from '@/services/axios';

export const MyService = {
  /** 내 배송지 목록 조회 */
  getAddressList: async () => {
    const response = await client.get('/my/addresses');
    return response.data;
  },
  /** 내 배송지 조회 */
  getAddressOne: async (no: number) => {
    const response = await client.get(`/my/addresses/${no}`);
    return response.data;
  },
  /** 내 배송지 저장 */
  createAddress: async (data: addresssDailogForm) => {
    await client.post('/my/addresses', data);
  },
  /** 내 배송지 수정 */
  updateAddress: async (no: number, data: addresssDailogForm) => {
    await client.put(`/my/addresses/${no}`, data);
  },
  /** 내 배송지 삭제 */
  deleteAddress: async (no: number) => {
    await client.delete(`/my/addresses/${no}`);
  },
  /** 내 주문서 목록 조회 */
  getOrders: async () => {
    const response = await client.get('/my/orders');
    return response.data;
  },
  /** 배송코드 조회 */
  getOrderStatus: async () => {
    const response = await client.get('/common-code/order_status');
    return response.data;
  },
  /** 내 주문서 조회 */
  getOrder: async (no: number) => {
    const response = await client.get(`/my/order/${no}`);
    return response.data;
  },
  /** 주문내역의 배송지 수정 */
  updateOrderAddr: async (no: number, data: addresssDailogForm) => {
    await client.put(`/my/order/address/${no}`, data);
  },
};

import type { GuestAddressUpdatePayload, GuestCreatePayload } from '@/api/data-contracts';
import { Orders } from '@/api/Orders';
import { CustomHttpClient } from '../httpclient-instance';
import { refreshCreate } from './auth-service';

const orderApi = new Orders(new CustomHttpClient({}, refreshCreate));

export const GuestService = {
  /** 비회원 주문목록 조회 */
  getGuestOrders: async (data: GuestCreatePayload) => {
    const response = await orderApi.guestCreate(data);
    return response.data;
  },
  /** 비회원 주문 조회 */
  getGuestOrder: async (no: number) => {
    const response = await orderApi.guestDetail(no);
    return response.data;
  },
  /** 비회원 배송지 주소 조회 */
  getOrderAddress: async (no: number) => {
    const response = await orderApi.guestAddressList(no);
    return response.data;
  },
  /** 비회원 배송지 주소 수정 */
  updateOrderAddress: async (no: number, data: GuestAddressUpdatePayload) => {
    const response = await orderApi.guestAddressUpdate(no, data);
    return response.data;
  },
  /** 비회원 배송현황 조회 */
  getOrderDelivery: async (no: number) => {
    const response = await orderApi.guestDeliveryList(no);
    return response.data;
  },
  /** 비회원 주문취소 */
  cancelOrder: async (no: number, data: { canceledReason: string }) => {
    const response = await orderApi.guestCancelCreate(no, data);
    return response;
  },
};

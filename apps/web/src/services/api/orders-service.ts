import type { GuestCreatePayload, OrdersCreatePayload } from '@/api/data-contracts';
import { Orders } from '@/api/Orders';
import { CustomHttpClient } from '../httpclient-instance';
import { refreshCreate } from './auth-service';

const orderApi = new Orders(new CustomHttpClient({}, refreshCreate));

export const OrdersService = {
  create: async (data: OrdersCreatePayload) => {
    const response = await orderApi.ordersCreate(data);
    return response.data;
  },
  /** 비회원 주문목록 조회 */
  getGuestOrders: async (data: GuestCreatePayload) => {
    const response = await orderApi.guestCreate(data);
    return response.data;
  },
};

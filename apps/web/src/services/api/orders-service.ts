import type { OrdersCreatePayload } from '@/api/data-contracts';
import { Orders } from '@/api/Orders';
import { CustomHttpClient } from '../httpclient-instance';
import { refreshCreate } from './auth-service';

const orderApi = new Orders(new CustomHttpClient({}, refreshCreate));

export const OrdersService = {
  create: async (data: OrdersCreatePayload) => {
    await orderApi.ordersCreate(data);
  },
};

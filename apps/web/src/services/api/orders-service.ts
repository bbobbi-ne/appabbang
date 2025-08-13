import type { OrdersCreatePayload } from '@/api/data-contracts';
import client from '@/services/axios';

export const OrdersService = {
  create: async (data: OrdersCreatePayload): Promise<void> => {
    await client.post('/orders', data);
  },
};

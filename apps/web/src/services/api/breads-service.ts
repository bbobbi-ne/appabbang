import client from '@/services/axios';
import type { BreadsListData } from '@/api/data-contracts';

export const BreadsService = {
  getList: async (): Promise<BreadsListData> => {
    const response = await client.get('/breads');
    return response.data;
  },
  getOne: async (no: number) => {
    const response = await client.get(`/breads/${no}`);
    return response.data;
  },
};

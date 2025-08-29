import { Breads } from '@/api/Breads';
import { CustomHttpClient } from '../httpclient-instance';
import type { BreadsListData } from '@/api/data-contracts';

export type BreadsListItem = BreadsListData[number];

const breadsApi = new Breads(new CustomHttpClient());

export const BreadsService = {
  getList: async () => {
    const response = await breadsApi.breadsList();
    return response.data;
  },
  getOne: async (no: number) => {
    const response = await breadsApi.breadsDetail(no);
    return response.data;
  },
  getListWithOrderRound: async (): Promise<any> => {
    const response = await breadsApi.withOrderRoundList();
    return response.data;
  },
};

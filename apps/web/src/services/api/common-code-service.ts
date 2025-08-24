import client from '@/services/axios';

export const CommonCodeService = {
  // TODO: 타입 정의 (any 대신 타입 정의)
  getCodes: async (groupName: 'order_status' | any) => {
    const response = await client.get(`/common-code/${groupName}`);
    return response.data;
  },
};

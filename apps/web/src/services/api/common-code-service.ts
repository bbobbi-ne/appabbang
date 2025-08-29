import client from '@/services/axios';

export const CommonCodeService = {
  // TODO: 타입 정의 (any 대신 타입 정의)
  getCodes: async (groupName: 'order_status' | 'bank_code') => {
    const response = await client.get(`/common-code/${groupName}`);
    return response.data;
  },

  // common-code 가 아니지만 일단 여기에 배치
  deliveryMethods: async () => {
    const response = await client.get('/delivery-methods/active');
    return response.data;
  },
};

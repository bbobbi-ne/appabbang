import client from '@/services/axios';

export const MyService = {
  getAddressList: async () => {
    const response = await client.get('/my/addresses');
    return response.data;
  },
  getAddressOne: async (no: number) => {
    const response = await client.get(`/my/addresses/${no}`);
    return response.data;
  },
  createAddress: async (data: any) => {
    await client.post('/my/addresses', data);
  },
  updateAddress: async (no: number, data: any) => {
    await client.put(`/my/addresses/${no}`, data);
  },
  deleteAddress: async (no: number) => {
    await client.delete(`/my/addresses/${no}`);
  },
};

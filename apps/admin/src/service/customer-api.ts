import { CustomHttpClient } from '@/service/instance';
import { Customers } from '@/api/Customers';
import { toast } from 'sonner';

const customerApi = new Customers(new CustomHttpClient());

export async function getCustomerList() {
  try {
    const response = await customerApi.customersList();
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '유저 리스트를 불러오는데 실패했습니다.';
    toast.error('유저 리스트를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

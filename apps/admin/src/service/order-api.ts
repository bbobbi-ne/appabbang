import { Orders } from '@/api/Orders';
import { CustomHttpClient } from './instance';
import { toast } from 'sonner';
import type { QueryFunctionContext } from '@tanstack/react-query';

const ordersApi = new Orders(new CustomHttpClient());

export const getOrdersList = async () => {
  try {
    const response = await ordersApi.ordersList();
    // toast.success('주문정보 조회에 성공했습니다.');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '주문정보를 불러오는데 실패했습니다.';
    toast.error('주문정보를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

export const getOrdersDetail = async ({
  queryKey,
}: QueryFunctionContext<[string, { no: number }]>) => {
  const [, params] = queryKey;

  try {
    const response = await ordersApi.ordersDetail(params.no);
    // toast.success('주문상세정보 조회에 성공했습니다.');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '주문상세정보를 불러오는데 실패했습니다.';
    toast.error('주문상세정보를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

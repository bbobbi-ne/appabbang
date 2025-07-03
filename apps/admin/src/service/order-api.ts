import { toast } from 'sonner';
import type { ApiResponse } from './common';
import { baseInstance } from './instance';

export interface OrderStatusItem {
  name: string;
  code: string;
}

export interface OrderDliveryTypeItem {
  name: string;
  code: string;
}

export type OrderStatusResponse = OrderStatusItem[];
export type OrderDliveryTypeResponse = OrderStatusItem[];

export async function getOrderStatus(): Promise<ApiResponse<OrderStatusResponse>> {
  try {
    const response = await baseInstance.get('/common-code/order_status');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '주문상태를 불러오는데 실패했습니다.';
    toast.error('주문상태를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}
export async function getOrderdDliveryType(): Promise<ApiResponse<OrderDliveryTypeResponse>> {
  try {
    const response = await baseInstance.get('/common-code/delivery_type');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '배송방법을 불러오는데 실패했습니다.';
    toast.error('배송방법을 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

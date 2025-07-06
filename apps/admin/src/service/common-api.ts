import { toast } from 'sonner';
import { baseInstance } from '@/service/instance';

export interface ApiResponse<T> {
  data: T;
}

export interface BreadStatusItem {
  name: string;
  code: string;
}

export type BreadStatusResponse = BreadStatusItem[];

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

// export async function getUserRole(): Promise<ApiResponse<string>> {
//   try {
//     const response = await baseInstance.get('/common-code/user_role');
//     return {
//       data: response.data,
//     };
//   } catch (error: any) {
//     const message = error.response?.data?.message || '유저 규칙을 불러오는데 실패했습니다.';
//     toast.error('유저 규칙을 불러오는데 실패했습니다.', {
//       description: message,
//     });
//     throw new Error(message);
//   }
// }

export async function getBreadStatus(): Promise<ApiResponse<BreadStatusResponse>> {
  try {
    const response = await baseInstance.get('/common-code/bread_status');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '빵 상태를 불러오는데 실패했습니다.';
    toast.error('빵 상태를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

export interface MaterialTypeItem {
  name: string;
  code: string;
}

export type MaterialTypeResponse = MaterialTypeItem[];

export async function getMaterialType(): Promise<ApiResponse<MaterialTypeResponse>> {
  try {
    const response = await baseInstance.get('/common-code/material_type');

    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '재료 타입을 가져오는데 실패했습니다.';
    toast.error('재료 타입을 가져오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

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

export async function getPurchaseStatus(): Promise<ApiResponse<string>> {
  try {
    const response = await baseInstance.get('/common-code/purchase_status');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '발주상태를 불러오는데 실패했습니다.';
    toast.error('발주상태를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

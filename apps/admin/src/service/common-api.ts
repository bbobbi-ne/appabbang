import { toast } from 'sonner';
import { CustomHttpClient } from '@/service/instance';
import { CommonCode } from '@/api/CommonCode';

const commonCodeApi = new CommonCode(new CustomHttpClient());

// export async function getUserRole(): Promise<ApiResponse<string>> {
//   try {
//     const response = await commonCodeApi.commonCodeDetail('user_role');
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

export async function getBreadStatus() {
  try {
    const response = await commonCodeApi.commonCodeDetail('bread_status');
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

export async function getMaterialType() {
  try {
    const response = await commonCodeApi.commonCodeDetail('material_type');

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

export async function getOrderStatus() {
  try {
    const response = await commonCodeApi.commonCodeDetail('order_status');
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
export async function getOrderdDliveryType() {
  try {
    const response = await commonCodeApi.commonCodeDetail('delivery_type');
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

export async function getPurchaseStatus() {
  try {
    const response = await commonCodeApi.commonCodeDetail('purchase_status');
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

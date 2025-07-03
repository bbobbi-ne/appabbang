import { toast } from 'sonner';
import type { ApiResponse } from './common';
import { baseInstance } from './instance';

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

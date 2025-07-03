import { toast } from 'sonner';
import type { ApiResponse } from './common';
import { baseInstance } from './instance';

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

import { baseInstance } from './instance';

export interface BreadStatusItem {
  name: string;
  code: string;
}

export async function getBreadStatus() {
  try {
    const response = await baseInstance.get<BreadStatusItem[]>('/common-code/bread_status');
    return {
      success: true,
      breadStatus: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '빵 상태를 불러오는데 실패했습니다.',
    };
  }
}

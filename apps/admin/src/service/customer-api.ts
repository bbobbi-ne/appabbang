import { CustomHttpClient } from '@/service/instance';
import { Customers } from '@/api/Customers';
import { toast } from 'sonner';

// 고객 API 인스턴스 생성
const customerApi = new Customers(new CustomHttpClient());

/**
 * 고객(유저) 목록 조회
 *
 * - 서버에서 전체 고객 리스트를 가져옵니다.
 * - 요청 성공 시 `data` 속성에 고객 목록 데이터를 담아 반환합니다.
 * - 요청 실패 시 toast로 에러 메시지를 표시하고 예외를 던집니다.
 *
 * @returns {Promise<{ data: any }>} 고객 목록이 포함된 객체
 * @throws {Error} API 요청 실패 시
 */
export async function getCustomerList() {
  try {
    const response = await customerApi.customersList();
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error?.response?.data?.message || '유저 리스트를 불러오는데 실패했습니다.';
    toast.error('유저 리스트를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

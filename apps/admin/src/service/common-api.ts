import { toast } from '@appabbang/ui';
import { CustomHttpClient } from '@/service/instance';
import { CommonCode } from '@/api/CommonCode';

// 공통 코드 API 인스턴스 생성
const commonCodeApi = new CommonCode(new CustomHttpClient());

/**
 * 주문 상태 코드 조회
 * 예: 결제완료, 배송중, 배송완료 등
 */
export async function getOrderStatus() {
  try {
    const response = await commonCodeApi.commonCodeDetail('order_status');
    return { data: response.data };
  } catch (error: any) {
    const message = error?.response?.data?.message || '주문상태를 불러오는데 실패했습니다.';
    toast.error('주문상태를 불러오는데 실패했습니다.', { description: message });
    throw new Error(message);
  }
}

/**
 * 배송 방법 코드 조회
 * 예: 택배, 퀵서비스, 매장픽업 등
 */
export async function getOrderDeliveryType() {
  try {
    const response = await commonCodeApi.commonCodeDetail('delivery_type');
    return { data: response.data };
  } catch (error: any) {
    const message = error?.response?.data?.message || '배송방법을 불러오는데 실패했습니다.';
    toast.error('배송방법을 불러오는데 실패했습니다.', { description: message });
    throw new Error(message);
  }
}

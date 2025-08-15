import { CustomHttpClient } from './instance';
import { toast } from 'sonner';
import { Payments } from '@/api/Payments';
import type { PaidUpdatePayload, StatusUpdateBody } from '@/api/data-contracts';
import type { QueryFunctionContext } from '@tanstack/react-query';

// ✅ 결제 API 인스턴스 생성
const paymentApi = new Payments(new CustomHttpClient());

/**
 * 결제 정보 전체 목록 조회 API
 *
 * - 서버에서 모든 결제 내역 리스트를 가져옴
 * - 실패 시 toast 알림 후 에러 throw
 */
export async function getPaymentsList() {
  try {
    const response = await paymentApi.paymentsList();
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '결제 정보를 불러오는데 실패했습니다.';
    toast.error('결제 정보를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

/**
 * 결제 상세 정보 조회 API
 *
 * @param queryKey React Query에서 전달하는 쿼리 키
 * - queryKey[1]에 { no: number } 형태의 결제 번호가 포함됨
 */
export const getPaymentDetail = async ({
  queryKey,
}: QueryFunctionContext<[string, { no: number }]>) => {
  const [, params] = queryKey;

  try {
    const response = await paymentApi.paymentsDetail(params.no);
    return { data: response.data };
  } catch (error: any) {
    const message = error?.data?.message || '결제 상세정보를 불러오는데 실패했습니다.';
    toast.error('결제 상세정보를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

/**
 * 결제 상태(입금 확인) 업데이트 API
 *
 * @param no 결제/주문 번호
 * @param data PaidUpdatePayload (입금 여부 데이터)
 *
 * - 결제 상태 업데이트
 */
export async function updatePaid({ no, data }: { no: number; data: PaidUpdatePayload }) {
  try {
    // 1. 결제 상태 업데이트
    const response = await paymentApi.paidUpdate(no, data);

    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '입금 확인 업데이트에 실패했습니다.';
    toast.error('입금 확인 업데이트에 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

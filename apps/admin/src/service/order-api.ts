import { Orders } from '@/api/Orders';
import { CustomHttpClient } from './instance';
import { toast } from 'sonner';
import type { QueryFunctionContext } from '@tanstack/react-query';
import type { StatusUpdateBody } from '@/api/data-contracts';

// ✅ 주문 API 인스턴스 생성
const ordersApi = new Orders(new CustomHttpClient());

/**
 * 주문 목록 조회 API
 *
 * - 서버에서 전체 주문 리스트를 가져옴
 * - 요청 실패 시 toast 알림 및 에러 throw
 */
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

/**
 * 주문 상세 정보 조회 API
 *
 * - 특정 주문 번호(no)를 기준으로 주문 상세 데이터 조회
 * - react-query의 queryKey를 구조분해로 받아 사용
 */
export const getOrdersDetail = async ({
  queryKey,
}: QueryFunctionContext<[string, { no: number }]>) => {
  const [, params] = queryKey; // queryKey에서 파라미터 추출

  try {
    const response = await ordersApi.ordersDetail(params.no);
    return { data: response.data };
  } catch (error: any) {
    const message = error?.data?.message || '주문상세정보를 불러오는데 실패했습니다.';
    toast.error('주문상세정보를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

/**
 * 주문 상태 업데이트 API
 *
 * @param no 주문 번호
 * @param orderStatus 상태 변경 요청 바디(StatusUpdateBody)
 *
 * - 주문의 상태를 변경
 * - 성공 시 데이터 반환
 * - 실패 시 toast 알림 및 에러 throw
 */
export const updateOrderStatus = async ({
  no,
  orderStatus,
}: {
  no: number;
  orderStatus: StatusUpdateBody;
}) => {
  try {
    const response = await ordersApi.statusUpdate(no, orderStatus);
    // toast.success('주문 상태가 업데이트 되었습니다.');
    return {
      data: response.data,
    };
  } catch (error: any) {
    console.log(error, '에러발생');

    const message = error.data.message || '주문 상태 업데이트를 실패했습니다.';
    toast.error('주문 상태 업데이트를 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

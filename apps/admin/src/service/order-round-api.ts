import { OrderRound } from '@/api/OrderRound';
import { CustomHttpClient } from './instance';
import { toast } from 'sonner';
import type { OrderRoundCreatePayload, OrderRoundUpdatePayload } from '@/api/data-contracts';

// ✅ 주문차수 API 인스턴스 생성
const orderRoundsApi = new OrderRound(new CustomHttpClient());

/**
 * 주문차수 목록 조회 API
 *
 * - 모든 주문차수 리스트를 서버에서 조회
 * - 실패 시 toast 알림 후 에러 throw
 */
export const getOrderRoundsList = async () => {
  try {
    const response = await orderRoundsApi.orderRoundList();
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '주문차수를 불러오는데 실패했습니다.';
    toast.error('주문차수를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

/**
 * 주문차수 상세 조회 API
 *
 * @param no 주문차수 번호
 * - 해당 번호에 대한 상세 데이터를 조회
 */
export const getDetailOrderRoundsList = async (no: number) => {
  try {
    const response = await orderRoundsApi.orderRoundDetail(no);
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '주문차수를 조회하는데 실패했습니다.';
    toast.error('주문차수를 조회하는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

/**
 * 주문차수 생성 API
 *
 * @param formData 생성에 필요한 주문차수 데이터 (OrderRoundCreatePayload 또는 FormData)
 * - 새로운 주문차수를 생성
 */
export const createOrderRound = async ({
  formData,
}: {
  formData: OrderRoundCreatePayload | FormData;
}) => {
  console.log(formData, '주문차수생성 실행됨');
  try {
    const response = await orderRoundsApi.orderRoundCreate(formData as OrderRoundCreatePayload);
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '주문차수 생성을 실패했습니다.';
    toast.error('주문차수 생성을 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

/**
 * 주문차수 수정 API
 *
 * @param no 수정할 주문차수 번호
 * @param formData 수정할 주문차수 데이터 (OrderRoundUpdatePayload 또는 FormData)
 */
export const updateOrderRound = async ({
  formData,
  no,
}: {
  formData: OrderRoundUpdatePayload | FormData;
  no: number;
}) => {
  console.log(formData, no, '주문차수수정 실행됨');
  try {
    const response = await orderRoundsApi.orderRoundUpdate(no, formData as OrderRoundUpdatePayload);
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '주문차수 업데이트를 실패했습니다.';
    toast.error('주문차수 업데이트를 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

/**
 * 주문차수 이미지 삭제 API
 *
 * @param publicId 삭제할 이미지의 publicId
 * @param no 주문차수 번호
 */
export const deleteOrderRoundImg = async ({ publicId, no }: { publicId: string; no: number }) => {
  try {
    const response = await orderRoundsApi.imageDelete({ publicId });
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '주문차수 이미지 제거를 실패했습니다.';
    toast.error('주문차수 이미지 제거를 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};

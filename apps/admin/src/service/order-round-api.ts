import { OrderRound } from '@/api/OrderRound';
import { CustomHttpClient } from './instance';
import { toast } from 'sonner';
import type { OrderRoundCreatePayload, OrderRoundUpdatePayload } from '@/api/data-contracts';

const orderRoundsApi = new OrderRound(new CustomHttpClient());

export const getOrderRoundsList = async () => {
  try {
    const response = await orderRoundsApi.orderRoundList();
    // toast.success('주문차수 조회에 성공했습니다.');
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
export const getDetailOrderRoundsList = async (no: number) => {
  try {
    const response = await orderRoundsApi.orderRoundDetail(no);
    // toast.success('주문차수 상세 조회에 성공했습니다.');
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

export const createOrderRound = async ({
  formData,
}: {
  formData: OrderRoundCreatePayload | FormData;
}) => {
  console.log(formData, '주문차수생성 실행됨');

  try {
    const response = await orderRoundsApi.orderRoundCreate(formData as OrderRoundCreatePayload);
    // toast.success('주문차수 생성에 성공했습니다.');
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
    // toast.success('주문차수 업데이트에 성공했습니다.');
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

export const deleteOrderRound = async (no: number) => {
  try {
    const response = await orderRoundsApi.orderRoundDetail(no);
    // toast.success('주문차수 삭제에 성공했습니다.');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.data.message || '주문차수 삭제를 실패했습니다.';
    toast.error('주문차수 삭제를 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
};
export const deleteOrderRoundImg = async ({ publicId, no }: { publicId: string; no: number }) => {
  try {
    const response = await orderRoundsApi.imageDelete({ publicId });
    // toast.success('주문차수 이미지 제거에 성공했습니다.');
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

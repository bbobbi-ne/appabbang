import { CustomHttpClient } from './instance';
import { toast } from 'sonner';
import { Payments } from '@/api/Payments';
import type { PaidUpdatePayload, StatusUpdateBody } from '@/api/data-contracts';
import type { QueryFunctionContext } from '@tanstack/react-query';
import { updateOrderStatus } from './order-api';
import { getOrderStatus } from './common-api';

const paymentApi = new Payments(new CustomHttpClient());
type OrderStatusCode = StatusUpdateBody['orderStatus'];
export async function getPaymentsList() {
  try {
    const response = await paymentApi.paymentsList();
    // toast.success('결제 정보를 조회에 성공했습니다.');
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
export async function updatePaid({
  no,
  rowOrderStatus,
  data,
}: {
  no: number;
  rowOrderStatus: { code: string; name: string };
  data: PaidUpdatePayload;
}) {
  try {
    const response = await paymentApi.paidUpdate(no, data);

    if (rowOrderStatus.name === '접수요청') {
      const orderStatusres = await getOrderStatus();

      const foundStatus = orderStatusres.data.find((status) => status.name === '접수완료');

      if (!foundStatus) {
        throw new Error('접수완료 상태를 찾을 수 없습니다.');
      }

      await updateOrderStatus({
        no,
        orderStatus: {
          orderStatus: foundStatus.code as OrderStatusCode,
        },
      });
    }
    // toast.success('입금 확인 업데이트에 성공했습니다.');
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

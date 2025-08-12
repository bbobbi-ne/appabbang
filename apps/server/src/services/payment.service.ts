import { prisma } from '@/lib/prisma';
import { Payment } from '@prisma/client';
import { commonCodeMap } from './common-code.service';

/** 결제 목록 조회 */
export const getList = async () => {
  const list = await prisma.payment.findMany({
    orderBy: {
      no: 'desc',
    },
    include: {
      order: {
        select: {
          no: true,
          totalPrice: true,
          orderStatus: true,
          orderNumber: true,
        },
      },
    },
  });

  const result = list.map((item) => ({
    ...item,
    order: {
      ...item.order,
      orderStatusName: getOrderStatusName(item.order.orderStatus),
    },
    bankCodeName: getBankCodeName(item.bankCode),
  }));

  return result;
};

/** 결제 상세 조회 */
export const getOneByNo = async (no: number) => {
  const one = await prisma.payment.findUnique({
    where: { no },
    include: {
      order: {
        select: {
          no: true,
          totalPrice: true,
          orderStatus: true,
        },
      },
    },
  });

  const result = one
    ? {
        ...one,
        bankCodeName: getBankCodeName(one.bankCode),
      }
    : null;

  return result;
};

/** 결제 수정 */
export const update = async (no: number, body: Partial<Payment>) => {
  await prisma.payment.update({
    where: { no },
    data: body,
  });
};

/** 은행 코드 조회 */
export const getBankCodeName = (code: string): string => {
  return commonCodeMap.bankCodeMap.get(code) || '-';
};

/** 주문 상태 조회 */
export function getOrderStatusName(code: string): string {
  return commonCodeMap.orderStatusMap.get(code) || '-';
}

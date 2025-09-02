import { prisma } from '@/lib/prisma';
import { commonCodeMap } from './common-code.service';

/** 코드 조회 */
export const getCodeName = (code: string): string => {
  return commonCodeMap.orderStatusMap.get(code) || '-';
};

/** [비회원] 주문 목록 조회 */
export const getGuestOrders = async ({
  ordererName,
  ordererMobile,
  ordererEmail,
}: {
  ordererName: string;
  ordererMobile: string;
  ordererEmail: string;
}) => {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  // 조회
  const orders = await prisma.order.findMany({
    select: {
      no: true,
      orderNumber: true,
      orderStatus: true,
      orderRoundNo: true,
      createdAt: true,
      orderPw: true,
      orderItems: {
        select: {
          no: true,
          breadImageUrl: true,
          breadName: true,
          unitPrice: true,
          quantity: true,
        },
      },
    },
    where: {
      ordererName,
      ordererMobile,
      ordererEmail,
      createdAt: {
        gte: oneYearAgo, // 1년 전 이후부터
        lte: now, // 현재일자까지
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((item) => ({
    ...item,
    orderStatusName: getCodeName(item.orderStatus),
  }));
};

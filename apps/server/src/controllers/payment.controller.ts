import { Request, Response } from 'express';
import * as paymentService from '@/services/payment.service';
import * as orderService from '@/services/order.service';
import { AppError } from '@/types';

/** 결제 목록 조회 */
export const getList = async (req: Request, res: Response) => {
  const payments = await paymentService.getList();
  res.status(200).json(payments);
};

/** 결제 상세 조회 */
export const getOneByNo = async (req: Request, res: Response) => {
  const { no } = req.params;
  const payment = await paymentService.getOneByNo(Number(no));

  if (!payment) {
    throw AppError.notFound('해당하는 결제 내역이 없습니다.');
  }

  res.status(200).json(payment);
};

/** 결제 입금 확인 변경 */
export const updatePaid = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { isPaid, orderNo } = req.body;

  await paymentService.update(Number(no), {
    isPaid,
    paidConfirmedAt: isPaid ? new Date() : null,
  });

  const paymentData = await paymentService.getOneByNo(Number(no));

  // 11: 접수 완료
  if (paymentData?.order.orderStatus === '10' || isPaid) {
    await orderService.update(Number(orderNo), { orderStatus: '11' });
  }
  res.status(200).json({ message: '결제 입금 확인 완료' });
};

/** 결제 환불 확인 변경 */
export const updateRefund = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { isRefunded, orderNo } = req.body;

  await paymentService.update(Number(no), {
    isRefunded,
    ...(isRefunded && {
      refundConfirmedAt: new Date(),
    }),
  });

  // 51: 취소 완료
  // await orderService.update(Number(orderNo), { orderStatus: '51' });
  res.status(200).json({ message: '결제 환불 취소 완료' });
};

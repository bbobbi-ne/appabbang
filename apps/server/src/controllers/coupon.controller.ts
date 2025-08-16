import { Request, Response } from 'express';
import * as CouponService from '@/services/coupon.service';

/** 쿠폰 목록 조회 */
export const getList = async (_: Request, res: Response) => {
  const coupons = await CouponService.getList();
  res.status(200).json(coupons);
};

/** 쿠폰 상세 조회 */
export const getOne = async (req: Request, res: Response) => {
  const coupon = await CouponService.getOne(Number(req.params.no));
  res.status(200).json(coupon);
};

/** 쿠폰 생성 */
export const create = async (req: Request, res: Response) => {
  await CouponService.create(req.body);
  res.status(201).json({ message: '쿠폰이 생성되었습니다.' });
};

/** 쿠폰 수정 */
export const update = async (req: Request, res: Response) => {
  const no = Number(req.params.no);

  await CouponService.update(no, req.body);
  res.status(200).json({ message: '쿠폰이 수정되었습니다.' });
};

/** 쿠폰 삭제 */
export const remove = async (req: Request, res: Response) => {
  const no = Number(req.params.no);

  await CouponService.remove(no);
  res.status(204).json({ message: '쿠폰이 삭제되었습니다.' });
};

/** 쿠폰 발급 (쿠폰하나를 여러 고객에게 발급) */
export const issueCoupon = async (req: Request, res: Response) => {
  const couponNo = Number(req.params.no);
  const customerNos = req.body.noList;

  await CouponService.issueCoupon(couponNo, customerNos);
  res.status(200).json({ message: '쿠폰이 발급되었습니다.' });
};

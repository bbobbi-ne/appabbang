import { Request, Response } from 'express';
import * as myService from '@/services/my.service';
import { AppError } from '@/types';
import { comparePassword, hashPassword } from '@/services/auth.service';

/** 내 정보 상세조회 */
export const getInfo = async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized('고객정보를 조회할 수 없습니다.');

  // 고객 상세정보 조회 + 고객 보유 쿠폰 조회
  const customer = await myService.getMyInfo(req.user.no);
  res.status(200).json(customer);
};

/** 내 정보 + 주문 누적금액 + 총 보유 쿠폰 수 조회 */
export const getLayoutInfo = async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized('고객정보를 조회할 수 없습니다.');

  const customerNo = req.user.no;
  // 고객 상세정보 조회 + 고객 보유 쿠폰 조회
  const customer = await myService.getMyInfo(customerNo);
  const couponCount = await myService.getCustomerCouponCount(customerNo);
  const totalAmount = await myService.getOrderAccumulatedAmount(customerNo);
  res.status(200).json({ customer, couponCount, totalAmount });
};

/** 내 연락처 조회 */
export const getMyContact = async (req: Request, res: Response) => {
  const customerNo = req.user.no;
  const contact = await myService.getMyContact(customerNo);
  res.status(200).json(contact);
};

/** 내 정보 수정 */
export const update = async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized('토큰에 저장된 고객정보를 확인할 수 없습니다.');

  // 고객 정보 조회
  const findCustomer = await myService.getMyInfo(req.user.no);
  if (!findCustomer)
    throw AppError.internalServerError(
      '고객정보 조회 과정에서 오류가 발생했습니다. 관리자 확인이 필요합니다.',
    );

  const customer = await myService.update(req.user.no, req.body);
  res.status(200).json({ customer });
};

/** 내 정보 수정 : 비밀번호 변경 */
export const updatePw = async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized('토큰에 저장된 고객정보를 확인할 수 없습니다.');

  const { no, id } = req.user;
  const { pw, pwModify } = req.body;

  // 고객 정보 조회
  const customer = await myService.getMyInfoDetail(id);
  if (!customer)
    throw AppError.internalServerError(
      '고객정보 조회 과정에서 오류가 발생했습니다. 관리자 확인이 필요합니다.',
    );

  // 비밀번호 비교
  const isValid = await comparePassword(pw, customer.pw);
  if (!isValid) throw AppError.internalServerError('현재 비밀번호가 올바르지 않습니다.');

  // 비밀번호 해싱
  const hashedPw = await hashPassword(pwModify);

  // 비밀번호 변경
  await myService.updatePw(no, hashedPw);
  res.status(200).json();
};

// >>>>>> 배송지 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/** 내 배송지 목록 조회 */
export const getAddressList = async (req: Request, res: Response) => {
  const customerNo = req.user.no;
  const list = await myService.getAddressList(customerNo);
  res.status(200).json(list);
};

/** 내 배송지 상세 조회 */
export const getAddressOne = async (req: Request, res: Response) => {
  const no = req.params.no;
  const customerNo = req.user.no;
  const one = await myService.getAddressOne(Number(no), customerNo);
  res.status(200).json(one);
};

/** 내 배송지 등록 */
export const createAddress = async (req: Request, res: Response) => {
  const customerNo = req.user.no;
  const { address, addressDetail, zipcode, message, recipientName, recipientMobile, isDefault } =
    req.body;

  await myService.createAddress(
    customerNo,
    {
      address,
      addressDetail,
      zipcode,
      message,
      recipientName,
      recipientMobile,
    },
    isDefault,
  );

  res.sendStatus(201);
};

/** 내 배송지 수정 */
export const updateAddress = async (req: Request, res: Response) => {
  const no = req.params.no;
  const customerNo = req.user.no;
  const { address, addressDetail, zipcode, message, recipientName, recipientMobile, isDefault } =
    req.body;

  await myService.updateAddress(
    Number(no),
    customerNo,
    {
      address,
      addressDetail,
      zipcode,
      message,
      recipientName,
      recipientMobile,
    },
    isDefault,
  );

  res.sendStatus(200);
};

/** 내 배송지 삭제 */
export const removeAddress = async (req: Request, res: Response) => {
  const no = req.params.no;
  const customerNo = req.user.no;

  await myService.deleteAddress(Number(no), customerNo);

  res.sendStatus(204);
};

// >>>>>> 주문 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/** 내 주문내역 조회 */
export const getOrders = async (req: Request, res: Response) => {
  const customerNo = req.user.no;
  const list = await myService.getOrders(customerNo);
  res.status(200).json(list);
};

/** 내 주문 조회 */
export const getOrder = async (req: Request, res: Response) => {
  const orderNo = Number(req.params.no);
  const order = await myService.getOrder(orderNo);
  res.status(200).json(order);
};

/** 내 주문 취소 */
export const cancelOrder = async (req: Request, res: Response) => {
  const orderNo = Number(req.params.no);
  const { canceledReason } = req.body;

  const order = await myService.getOrder(orderNo);
  if (!order) throw AppError.notFound('주문을 찾을 수 없습니다.');

  if (Number(order.orderStatus) !== 10 && Number(order.orderStatus) !== 11) {
    throw AppError.badRequest('현재는 주문을 취소할 수 없습니다.');
  }

  await myService.cancelOrder(orderNo, canceledReason);

  res.status(200).json({ message: '주문이 취소되었습니다.' });
};

/** 내 주문 배송(수령) 조회 */
export const getOrderDelivery = async (req: Request, res: Response) => {
  const orderNo = Number(req.params.no);
  const orderDelivery = await myService.getOrderDelivery(orderNo);
  res.status(200).json(orderDelivery);
};

/** 내 주문 배송지 조회 */
export const getOrderAddress = async (req: Request, res: Response) => {
  const orderNo = Number(req.params.no);
  const address = await myService.getOrderAddress(orderNo);

  res.status(200).json(address);
};

/** 내 주문 배송지 수정 */
export const updateOrderAddress = async (req: Request, res: Response) => {
  const orderNo = Number(req.params.no);
  const { address, addressDetail, zipcode, message, recipientName, recipientMobile } = req.body;

  const order = await myService.getOrder(orderNo);
  if (!order) throw AppError.notFound('주문을 찾을 수 없습니다.');

  // 10 또는 11 일때만 수정 가능
  if (Number(order.orderStatus) !== 10 && Number(order.orderStatus) !== 11) {
    throw AppError.badRequest('현재는 주문 배송지를 수정할 수 없습니다.');
  }

  await myService.updateOrderAddress(orderNo, {
    address,
    addressDetail,
    zipcode,
    message,
    recipientName,
    recipientMobile,
  });

  res.status(200).json({ message: '주문 배송지가 변경되었습니다.' });
};

/** 내가 주문했던 주문인지 확인하는 메서드 (취소, 환불 제외) */
export async function checkHasOrder(req: Request, res: Response) {
  const customerNo = req.user?.no;

  if (!customerNo) return res.status(200).json(false);

  const orderRoundNo = Number(req.params.no);
  const hasOrder = await myService.checkHasOrder(customerNo, orderRoundNo);
  res.status(200).json(hasOrder);
}

/** 쿠폰목록 조회 */
export const getCouponList = async (req: Request, res: Response) => {
  const customerNo = req.user.no;
  const data = await myService.getCouponList(customerNo);
  res.status(200).json(data);
};

/** 내 사용 가능한 쿠폰 조회 */
export const getAvailableCouponList = async (req: Request, res: Response) => {
  const customerNo = req.user.no;
  const data = await myService.getAvailableCouponList(customerNo);
  res.status(200).json(data);
};

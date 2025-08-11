import { Request, Response } from 'express';
import * as OrderService from '@/services/order.service';
import { AppError } from '@/types';

/** 주문 목록 조회 */
export const getList = async (_: Request, res: Response) => {
  // const orders = await OrderService.getOrderList();

  res.status(200).json([]);
};

/** 주문 상세 조회 */
export const getOne = async (req: Request, res: Response) => {
  // const order = await OrderService.getOrderByNo(Number(req.params.no));
  res.status(200).json({});
};

/** 주문 생성 (비회원, 회원) */
export const create = async (req: Request, res: Response) => {
  const {
    name,
    mobileNumber,
    address,
    addressDetail,
    zipcode,
    message,
    recipientName,
    recipientMobile,
    orderItems,
    deliveryMethodNo,
    orderPw,
    totalPrice,
    discountNo,
    discountAmount,
    bankCode,
    accountNumber,
    accountHolderName,
  } = req.body;

  const user = req.user;

  if (!user && !orderPw) {
    throw AppError.badRequest('주문 비밀번호를 입력해주세요.');
  }

  if (!user) {
    // const newOrder = await OrderService.createNonMemberOrder({
    //   name,
    //   mobileNumber,
    //   address,
    //   addressDetail,
    //   zipcode,
    //   message,
    //   recipientName,
    //   recipientMobile,
    //   orderItems,
    //   deliveryMethodNo,
    //   orderPw,
    //   totalPrice,
    //   discountNo,
    //   discountAmount,
    //   bankCode,
    //   accountNumber,
    //   accountHolderName,
    // });
    res.status(201).json({});
  } else {
    // const newOrder = await OrderService.createMemberOrder({
    //   orderItems,
    //   customerNo: user.no,
    //   addressNo: user.addressNo,
    //   deliveryMethodNo,
    //   discountNo,
    //   totalPrice,
    //   discountAmount,
    //   bankCode,
    //   accountNumber,
    //   accountHolderName,
    // });
    res.status(201).json({});
  }
};

/** 주문 수정 */
export const update = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { orderStatus, trackingNumber, address, addressDetail, zipcode, message } = req.body;

  // const updated = await OrderService.updateOrder(Number(no), {
  //   orderStatus,
  //   trackingNumber,
  //   address,
  //   addressDetail,
  //   zipcode,
  //   message,
  // });

  res.status(200).json({});
};

/** 주문 상태 수정 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { orderStatus } = req.body;

  // const updated = await OrderService.updateOrderStatus(Number(no), orderStatus);

  res.status(200).json({});
};

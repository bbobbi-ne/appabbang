import { Request, Response } from 'express';
import * as myService from '@/services/my.service';

// >>>>>> 배송지 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/** 배송지 목록 조회 */
export const getAddressList = async (req: Request, res: Response) => {
  const customerNo = req.user.no;
  const list = await myService.getAddressList(customerNo);
  res.status(200).json(list);
};

/** 배송지 상세 조회 */
export const getAddressOne = async (req: Request, res: Response) => {
  const no = req.params.no;
  const customerNo = req.user.no;
  const one = await myService.getAddressOne(Number(no), customerNo);
  res.status(200).json(one);
};

/** 배송지 등록 */
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

/** 배송지 수정 */
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

/** 배송지 삭제 */
export const removeAddress = async (req: Request, res: Response) => {
  const no = req.params.no;
  const customerNo = req.user.no;

  await myService.deleteAddress(Number(no), customerNo);

  res.sendStatus(204);
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

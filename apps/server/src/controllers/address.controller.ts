import { Request, Response } from 'express';
import * as AddressService from '@/services/address.service';
import { AppError } from '@/types';

/** 고객 주소 목록 조회 */
export const getListByCustomerNo = async (req: Request, res: Response) => {
  const { no: customerNo } = req.params;

  if (!customerNo) {
    throw AppError.badRequest('Address no is required');
  }

  const addressList = await AddressService.getListByCustomerNo(parseInt(customerNo));
  res.status(200).json(addressList);
};

/** 주소 조회 */
export const getOne = async (req: Request, res: Response) => {
  const no = req.params.addressNo as unknown as number;
  const addressNo = req.params.addressNo as unknown as number;
  const address = await AddressService.getOneByCustomerNo(no, addressNo);

  if (!address) {
    throw AppError.notFound('주소를 찾을 수 없습니다.', { addressNo });
  }

  res.status(200).json(address);
};

/** 주소 생성 */
export const create = async (req: Request, res: Response) => {
  const no = req.params.no as unknown as number;
  const { address, addressDetail, zipcode, recipientName, recipientMobile, message } = req.body;

  const createdAddress = await AddressService.create({
    address,
    addressDetail,
    zipcode,
    recipientName,
    recipientMobile,
    customerNo: no,
    message: message || '',
  });
  res.status(201).json(createdAddress);
};

/** 주소 수정 */
export const update = async (req: Request, res: Response) => {
  const addressNo = req.params.addressNo as unknown as number;
  const customerNo = req.params.no as unknown as number;
  const { address, addressDetail, zipcode, recipientName, recipientMobile, message } = req.body;

  const updatedAddress = await AddressService.update(addressNo, customerNo, {
    address,
    addressDetail,
    zipcode,
    recipientName,
    recipientMobile,
    message: message || '',
  });

  res.status(200).json(updatedAddress);
};

/** 주소 삭제 */
export const remove = async (req: Request, res: Response) => {
  const addressNo = req.params.addressNo as unknown as number;
  const customerNo = req.params.no as unknown as number;
  const removed = await AddressService.remove(addressNo, customerNo);

  res.status(204).json(removed);
};

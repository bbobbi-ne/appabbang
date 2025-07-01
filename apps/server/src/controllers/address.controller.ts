import { Request, Response } from 'express';
import * as AddressService from '@/services/address.service';
import { AppError } from '@/types';

/** 주소 목록 조회 */
export const getList = async (_: Request, res: Response) => {
  const addressList = await AddressService.getAddressList();
  res.status(200).json(addressList);
};

/** 주소 조회 */
export const getOne = async (req: Request, res: Response) => {
  const { no } = req.params;

  if (!no) {
    throw AppError.badRequest('Address no is required');
  }

  const address = await AddressService.getAddress(parseInt(no));

  if (!address) {
    throw AppError.notFound('Address not found', { addressNo: no });
  }

  res.status(200).json(address);
};

/** 주소 생성
 * 고객이 있어야 주소를 생성할 수 있음.
 * 비회원이라도 고객테이블에 데이터가 생성되어있어야함.
 */
export const create = async (req: Request, res: Response) => {
  const { customerNo, address, addressDetail, zipcode, recipientName, recipientMobile, message } =
    req.body;

  const createdAddress = await AddressService.createAddress({
    address,
    addressDetail,
    zipcode,
    recipientName,
    recipientMobile,
    customerNo,
    message: message || '',
  });
  res.status(201).json(createdAddress);
};

/** 주소 수정
 * todo: 본인만 수정 가능
 */
export const update = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { address, addressDetail, zipcode, recipientName, recipientMobile, message } = req.body;

  if (!no) {
    throw AppError.badRequest('Address no is required');
  }

  const updatedAddress = await AddressService.updateAddress(Number(no), {
    address,
    addressDetail,
    zipcode,
    recipientName,
    recipientMobile,
    message: message || '',
  });

  res.status(200).json(updatedAddress);
};

/** 주소 삭제
 * todo: 본인만 삭제 가능
 */
export const remove = async (req: Request, res: Response) => {
  const { no } = req.params;

  if (!no) {
    throw AppError.badRequest('Address no is required');
  }

  await AddressService.deleteAddress(parseInt(no));
  res.status(204).json({ message: 'Address deleted successfully' });
};

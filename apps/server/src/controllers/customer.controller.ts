import { Request, Response } from 'express';
import * as CustomerService from '@/services/customer.service';
// import { commonCodeMap } from '@/services/common-code.service';

/** 코드 조회 */
// export function getCodeName(code: string): string {
//   return commonCodeMap.deliveryTypeMap.get(code) || '-';
// }

export const getList = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const getListAll = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const getOne = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const create = async (req: Request, res: Response) => {
  // const { id, pw, name, mobileNumber, address, addressDetail, zipcode, message } = req.body;
  // const customerInfo = { id, pw, name, mobileNumber } as any;
  // const addressInfo = { address, addressDetail, zipcode, message } as any;

  // const customer = await CustomerService.createCustomer(customerInfo, addressInfo);

  res.status(201).json('Hello World');
};
export const update = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const remove = async (_: Request, res: Response) => {
  res.status(204).json('Hello World');
};

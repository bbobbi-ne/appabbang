import { Request, Response } from 'express';
import * as CommonCodeService from '@/services/common-code.service';

/** 공통 코드 목록 조회 */
export const getList = async (_: Request, res: Response) => {
  const list = await CommonCodeService.getList();

  res.status(200).json(list);
};

/** 공통 코드 그룹별 조회 */
export const getListByGroupName = async (req: Request, res: Response) => {
  const { groupName } = req.params;
  const list = await CommonCodeService.getListByGroupName(groupName!);

  res.status(200).json(list);
};

/** 공통 코드 생성 */
export const create = async (req: Request, res: Response) => {
  const { code, groupName, name, remarkTxt } = req.body;
  await CommonCodeService.create(groupName, code, name, remarkTxt);

  res.sendStatus(201);
};

/** 공통 코드 수정 */
export const update = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { code, groupName, name, remarkTxt } = req.body;
  await CommonCodeService.update(Number(no), groupName, code, name, remarkTxt);

  res.sendStatus(200);
};

/** 공통 코드 삭제 */
export const remove = async (req: Request, res: Response) => {
  const { no } = req.params;
  await CommonCodeService.remove(parseInt(no!));

  res.sendStatus(204);
};

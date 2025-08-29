import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import * as BreadService from '@/services/bread.service';
import * as ImageService from '@/services/image.service';
import { AppError } from '@/types';

/** 빵 목록 전체 조회 */
export async function getList(_: Request, res: Response) {
  const breads = await BreadService.getAll();
  res.status(200).json(breads);
}

/** 빵 상세 조회 */
export async function getByNo(req: Request, res: Response) {
  const { no } = req.params;
  const bread = await BreadService.getByNo(parseInt(no!));
  res.status(200).json(bread);
}

/** 빵 등록 */
export async function create(req: Request, res: Response) {
  const images = req.files?.image as UploadedFile[] | UploadedFile | undefined;

  await BreadService.create(req.body, images);
  res.status(201).json({ message: '등록이 완료되었습니다.' });
}

/** 빵 수정 */
export async function update(req: Request, res: Response) {
  const { no } = req.params;

  const findBread = await BreadService.getByNo(parseInt(no!));
  if (!findBread) {
    throw AppError.notFound('빵을 찾을 수 없습니다.', { breadNo: no });
  }

  const images = req.files?.image as UploadedFile[] | UploadedFile | undefined;

  await BreadService.update(parseInt(no!), req.body, images);
  res.status(200).json({ message: '수정이 완료되었습니다.' });
}

/** 빵 삭제 (여러건) */
export async function remove(req: Request, res: Response) {
  const { noList } = req.body;

  await BreadService.remove(noList);
  res.sendStatus(204);
}

/** 빵 이미지 삭제 (한건 즉시 삭제) */
export async function removeImage(req: Request, res: Response) {
  const { publicId } = req.body;

  await ImageService.remove([publicId]);
  res.sendStatus(204);
}

/** 빵 목록 조회 (주문차수에 속했는지 포함) */
export async function getBreadListWithOrderRound(_: Request, res: Response) {
  const breads = await BreadService.getBreadListWithOrderRound();
  res.status(200).json(breads);
}

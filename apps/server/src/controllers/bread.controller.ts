import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
import { UploadedFile } from 'express-fileupload';
import * as BreadService from '@/services/bread.service';
import * as ImageService from '@/services/image.service';
import { AppError } from '@/types';

/** 빵 목록 조회 */
export async function getBreads(req: Request, res: Response) {
  const { breadStatus } = req.query;
  const breads = !breadStatus
    ? await getBreadsAll()
    : await getBreadsByStatus(breadStatus as '10' | '20' | '30' | '40' | '50');

  res.status(200).json(breads);
}

/** 빵 목록 전체 조회 */
export async function getBreadsAll() {
  const breads = await BreadService.getAll();
  return breads;
}

/** 빵 상태값에 의한 조회 */
export async function getBreadsByStatus(breadStatus: '10' | '20' | '30' | '40' | '50') {
  const breads = await BreadService.getByStatus(breadStatus);
  return breads;
}

/** 빵 상세 조회 */
export async function getBreadByNo(req: Request, res: Response) {
  const { no } = req.params;

  if (!no) {
    throw AppError.badRequest('no는 필수입니다.', { param: 'no' });
  }

  const bread = await BreadService.getByNo(parseInt(no));
  res.status(200).json(bread);
}

/** 빵 등록 */
export async function createBread(req: Request, res: Response) {
  const { name, description, unitPrice, breadStatus } = req.body;
  const payload = { name, description, unitPrice, breadStatus };

  const images = req.files?.image as UploadedFile[] | UploadedFile | undefined;

  if (!images) {
    const bread = await BreadService.createWithoutImages(payload);
    res.status(201).json(bread);
  } else {
    const bread = await BreadService.createWithImages(payload, images);
    res.status(201).json(bread);
  }
}

/** 빵 수정 */
export async function updateBread(req: Request, res: Response) {
  const { no } = req.params;

  if (!no) {
    throw AppError.badRequest('no는 필수입니다.', { param: 'no' });
  }

  const findBread = await prisma.bread.findUnique({
    where: { no: parseInt(no) },
  });

  if (!findBread) {
    throw AppError.notFound('빵을 찾을 수 없습니다.', { breadNo: parseInt(no) });
  }

  const { name, description, unitPrice, breadStatus } = req.body;
  const payload = { name, description, unitPrice, breadStatus };

  const images = req.files?.image as UploadedFile[] | UploadedFile | undefined;

  if (!images) {
    const bread = await BreadService.updateWithoutImages(parseInt(no), payload);
    res.status(200).json(bread);
  } else {
    const bread = await BreadService.updateWithImages(parseInt(no), payload, images);
    res.status(200).json(bread);
  }
}

export async function updateBreadStatus(req: Request, res: Response) {
  const { no } = req.params;
  const { breadStatus } = req.body;

  const bread = await BreadService.updateWithoutImages(parseInt(no!), { breadStatus });
  res.status(200).json(bread);
}

/** 빵 삭제 (여러건) */
export async function deleteBread(req: Request, res: Response) {
  const { noList } = req.body;

  await BreadService.remove(noList);
  res.sendStatus(204);
}

/** 빵 이미지 삭제 (한건 즉시 삭제) */
export async function deleteImage(req: Request, res: Response) {
  const { publicId } = req.body;

  await ImageService.remove([publicId]);
  res.sendStatus(204);
}

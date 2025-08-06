import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
import { UploadedFile } from 'express-fileupload';
import * as BreadService from '@/services/bread.service';
import * as ImageService from '@/services/image.service';
import { AppError } from '@/types';
import { ClientType } from '@/types/client-payload';

/** 빵 목록 전체 조회 */
export async function getList(req: Request, res: Response) {
  const { breadStatus } = req.query;
  const type = req.user?.type as ClientType | undefined;

  if (!breadStatus) {
    if (type === ClientType.USER) {
      const breads = await BreadService.getAll();
      res.status(200).json(breads);
    } else {
      const breads = await BreadService.getAllForCustomer();
      res.status(200).json(breads);
    }
  } else {
    const CUSTOMER_AVALIABLE_BREAD_STATUS = ['10', '40', '50']; // 고객은 판매, 재료소진, 출시예정 만 조회 가능

    if (
      type !== ClientType.USER &&
      !CUSTOMER_AVALIABLE_BREAD_STATUS.includes(breadStatus as string)
    ) {
      if (req.user) {
        throw AppError.forbidden('잘못된 요청입니다.', { type, breadStatus });
      } else {
        throw AppError.unauthorized('잘못된 요청입니다.', { type, breadStatus });
      }
    }

    const breads = await BreadService.getByStatus(breadStatus as string);
    res.status(200).json(breads);
  }
}

/** 빵 상세 조회 */
export async function getByNo(req: Request, res: Response) {
  const { no } = req.params;

  const type = req.user?.type as ClientType | undefined;

  // 에러처리를 서비스 단에서 하기 위해 (= 빵 조회후 이미지 조회를 하지 않기 위해)
  // type 을 서비스로 전달
  const bread = await BreadService.getByNo(type, parseInt(no!));
  res.status(200).json(bread);
}

/** 빵 등록 */
export async function create(req: Request, res: Response) {
  const { name, description, unitPrice, breadStatus, countryOfOrigin, allergyInfo } = req.body;
  const payload = { name, description, unitPrice, breadStatus, countryOfOrigin, allergyInfo };

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
export async function update(req: Request, res: Response) {
  const { no } = req.params;

  const findBread = await prisma.bread.findUnique({
    where: { no: parseInt(no!) },
  });

  if (!findBread) {
    throw AppError.notFound('빵을 찾을 수 없습니다.', { breadNo: no });
  }

  const { name, description, unitPrice, breadStatus, countryOfOrigin, allergyInfo } = req.body;
  const payload = { name, description, unitPrice, breadStatus, countryOfOrigin, allergyInfo };

  const images = req.files?.image as UploadedFile[] | UploadedFile | undefined;

  if (!images) {
    const bread = await BreadService.updateWithoutImages(parseInt(no!), payload);
    res.status(200).json(bread);
  } else {
    const bread = await BreadService.updateWithImages(parseInt(no!), payload, images);
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

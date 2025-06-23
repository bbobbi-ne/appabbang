import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
import { UploadedFile } from 'express-fileupload';
import * as BreadService from '@/services/bread.service';
import * as ImageService from '@/services/image.service';

/** 빵 목록 조회 */
export async function getBreads(req: Request, res: Response) {
  try {
    const { breadStatus } = req.query;
    const breads = !breadStatus
      ? await getBreadsAll()
      : await getBreadsByStatus(breadStatus as '10' | '20' | '30' | '40' | '50');

    res.status(200).json(breads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

/** 빵 목록 전체 조회 */
export async function getBreadsAll() {
  try {
    const breads = await BreadService.getAll();
    return breads;
  } catch (error) {
    console.error(error);
  }
}

/** 빵 상태값에 의한 조회 */
export async function getBreadsByStatus(breadStatus: '10' | '20' | '30' | '40' | '50') {
  try {
    const breads = await BreadService.getByStatus(breadStatus);
    return breads;
  } catch (error) {
    console.error(error);
  }
}

/** 빵 상세 조회 */
export async function getBreadByNo(req: Request, res: Response) {
  try {
    const { no } = req.params;

    if (!no) {
      res.status(400).json({ message: 'no는 필수입니다.' });
      return;
    }

    const bread = await BreadService.getByNo(parseInt(no));

    res.status(200).json(bread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

/** 빵 등록 */
export async function createBread(req: Request, res: Response) {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

/** 빵 수정 */
export async function updateBread(req: Request, res: Response) {
  try {
    const { no } = req.params;

    if (!no) {
      res.status(400).json({ message: 'no는 필수입니다.' });
      return;
    }

    const findBread = await prisma.bread.findUnique({
      where: { no: parseInt(no) },
    });

    if (!findBread) {
      res.status(404).json({ message: '빵을 찾을 수 없습니다.' });
      return;
    }

    const { name, description, unitPrice, breadStatus } = req.body;
    const payload = { name, description, unitPrice, breadStatus };

    const images = req.files?.image as UploadedFile[] | UploadedFile | undefined;

    if (!images) {
      const bread = await BreadService.updateWithoutImages(parseInt(no), payload);
      res.status(201).json(bread);
    } else {
      const bread = await BreadService.updateWithImages(parseInt(no), payload, images);
      res.status(201).json(bread);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

/** 빵 삭제 (여러건) */
export async function deleteBread(req: Request, res: Response) {
  try {
    const { noList } = req.body;

    await BreadService.remove(noList);

    // 일단 삭제할 대상이 없어도 삭제 처리.
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

/** 빵 이미지 삭제 (한건 즉시 삭제) */
export async function deleteImage(req: Request, res: Response) {
  try {
    const { publicId } = req.body;

    await ImageService.remove([publicId]);

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

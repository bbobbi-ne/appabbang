import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
import { UploadedFile } from 'express-fileupload';
import cloudinary from '@/lib/cloudinary';
import { commonCodeMap } from '@/services/common-code.service';

const MAX_UPLOAD_COUNT = 10;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

/** 빵 목록 조회 */
export async function getBreads(req: Request, res: Response) {
  try {
    const { breadStatus } = req.query;

    if (breadStatus) {
      const breads = await getBreadsByStatus(breadStatus as '10' | '20' | '30' | '40' | '50');
      res.status(200).json(breads);
    } else {
      const breads = await getBreadsAll();
      res.status(200).json(breads);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

/** 빵 목록 전체 조회 */
export async function getBreadsAll() {
  try {
    // 최대 10000 개 조회
    const breads = await prisma.bread.findMany({
      take: 10000,
      orderBy: {
        no: 'desc',
      },
    });

    const images = await prisma.image.findMany({
      where: {
        imageTargetType: '10',
        order: 1,
      },
    });

    const imageMap = new Map<number, string>();
    images.forEach((img: any) => {
      imageMap.set(img.imageTargetNo, img.url);
    });

    const data = breads.map((bread: any) => ({
      ...bread,
      breadStatus: getBreadStatusName(bread.breadStatus),
      image: imageMap.get(bread.no),
    }));

    return data;
  } catch (error) {
    console.error(error);
  }
}

/** 빵 상태값에 의한 조회 */
export async function getBreadsByStatus(breadStatus: '10' | '20' | '30' | '40' | '50') {
  try {
    const breads = await prisma.bread.findMany({
      where: { breadStatus },
    });

    const images = await prisma.image.findMany({
      where: {
        imageTargetType: '10',
        imageTargetNo: { in: breads.map((bread: any) => bread.no) },
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        publicId: true,
        url: true,
        name: true,
        order: true,
        imageTargetNo: true,
      },
    });

    const data = breads.map((bread: any) => ({
      ...bread,
      breadStatus: getBreadStatusName(bread.breadStatus),
      images: images.filter((img: any) => img.imageTargetNo === bread.no),
    }));

    return data;
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

    const bread = await prisma.bread.findUnique({
      where: { no: parseInt(no) },
    });

    if (!bread) {
      res.status(404).json({ message: '빵을 찾을 수 없습니다.' });
      return;
    }

    const images = await prisma.image.findMany({
      where: { imageTargetType: '10', imageTargetNo: parseInt(no) },
      orderBy: {
        order: 'asc',
      },
    });

    const data = {
      ...bread,
      images: images.map((img: any) => ({
        publicId: img.publicId,
        url: img.url,
        name: img.name,
        order: img.order,
      })),
    };

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

/** 빵 상태 이름 조회 */
export function getBreadStatusName(code: string): string {
  return commonCodeMap.breadStatusMap.get(code) || '-';
}

/** 빵 등록 */
export async function createBread(req: Request, res: Response) {
  try {
    const { name, description, unitPrice, breadStatus } = req.body;

    const images = req.files?.image as UploadedFile[] | UploadedFile | undefined;

    // 이미지가 있을때 이미지 업로드
    if (images) {
      const files = Array.isArray(images) ? images : [images];

      // 최대 개수 제한
      if (files.length > MAX_UPLOAD_COUNT) {
        res
          .status(400)
          .json({ message: `이미지는 최대 ${MAX_UPLOAD_COUNT}개까지 업로드할 수 있습니다.` });
        return;
      }

      // 확장자 검사
      for (const file of files) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          res.status(400).json({ message: 'jpg, jpeg, png 형식의 파일만 업로드할 수 있습니다.' });
          return;
        }
      }

      // 이미지 생성 (cloudinary)
      const uploadResults = await cloudinary.upload(files);
      uploadResults.map((result) => {
        return {
          publicId: result.public_id,
          url: result.url,
          name: result.original_filename,
        };
      });

      // 빵 생성 (db)
      const bread = await prisma.bread.create({
        data: {
          name,
          description,
          unitPrice,
          breadStatus,
        },
      });

      // 이미지 생성 (db)
      const uploadedImages = await Promise.all(
        uploadResults.map(async (result, index) => {
          await prisma.image.create({
            data: {
              publicId: result.public_id,
              url: result.secure_url,
              name: result.original_filename,
              imageTargetNo: bread.no,
              imageTargetType: '10', // 빵 이미지
              order: index + 1,
            },
          });
          return {
            publicId: result.public_id,
            url: result.secure_url,
            name: result.original_filename,
            order: index + 1,
          };
        }),
      );

      res.status(200).json({ ...bread, images: uploadedImages });
    } else {
      const bread = await prisma.bread.create({
        data: {
          name,
          description,
          unitPrice,
          breadStatus,
        },
      });

      res.status(200).json({ ...bread, images: [] });
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

    const images = req.files?.image as UploadedFile[] | UploadedFile | undefined;

    if (images) {
      // 기존 이미지 조회
      const findedImages = await prisma.image.findMany({
        where: { imageTargetNo: parseInt(no), imageTargetType: '10' },
        orderBy: { order: 'asc' },
        select: { order: true, publicId: true, url: true, name: true },
      });

      // 이미지의 마지막 순서 조회하기
      const lastOrder = findedImages[findedImages.length - 1]?.order || 0;

      const files = Array.isArray(images) ? images : [images];

      // 최대 개수 제한
      if (files.length + lastOrder > MAX_UPLOAD_COUNT) {
        res
          .status(400)
          .json({ message: `이미지는 최대 ${MAX_UPLOAD_COUNT}개까지 업로드할 수 있습니다.` });
        return;
      }

      // 확장자 검사
      for (const file of files) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          res.status(400).json({ message: 'jpg, jpeg, png 형식의 파일만 업로드할 수 있습니다.' });
          return;
        }
      }

      // cloudinary 이미지 업로드
      const uploadResults = await cloudinary.upload(files);

      // 빵 수정
      const bread = await prisma.bread.update({
        where: { no: parseInt(no) },
        data: { name, description, unitPrice, breadStatus },
      });

      // 이미지 생성 (db)
      const uploadedImages = await Promise.all(
        uploadResults.map(async (result, index) => {
          await prisma.image.create({
            data: {
              publicId: result.public_id,
              url: result.secure_url,
              name: result.original_filename,
              imageTargetNo: parseInt(no),
              imageTargetType: '10',
              order: lastOrder + index + 1,
            },
          });
          return {
            publicId: result.public_id,
            url: result.secure_url,
            name: result.original_filename,
            order: lastOrder + index + 1,
          };
        }),
      );

      res.status(200).json({ ...bread, images: [...findedImages, ...uploadedImages] });
    } else {
      const bread = await prisma.bread.update({
        where: { no: parseInt(no) },
        data: { name, description, unitPrice, breadStatus },
      });

      const images = await prisma.image.findMany({
        where: { imageTargetNo: parseInt(no), imageTargetType: '10' },
        orderBy: { order: 'asc' },
        select: {
          publicId: true,
          url: true,
          name: true,
          order: true,
        },
      });

      res.status(200).json({ ...bread, images });
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

    // 삭제 대상 publicId 조회
    const idList = await prisma.image.findMany({
      where: { imageTargetNo: { in: noList }, imageTargetType: '10' },
      select: {
        publicId: true,
      },
    });

    if (idList.length > 0) {
      // cloudinary 이미지 삭제
      await cloudinary.destroy(idList.map((item: { publicId: string }) => item.publicId));

      // 이미지 삭제
      await prisma.image.deleteMany({
        where: { imageTargetNo: { in: noList }, imageTargetType: '10' },
      });
    }

    // 빵 삭제
    await prisma.bread.deleteMany({
      where: { no: { in: noList } },
    });

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
    const { no, publicId } = req.body;

    // 1. 삭제 대상 이미지 정보 먼저 조회
    const deletedImage = await prisma.image.findFirst({
      where: { publicId, imageTargetNo: parseInt(no), imageTargetType: '10' },
    });

    if (!deletedImage) {
      res.status(404).json({ message: '이미지를 찾을 수 없습니다.' });
      return;
    }

    // 2. cloudinary 이미지 삭제
    await cloudinary.destroy([publicId]);

    // 3. DB 이미지 삭제
    await prisma.image.deleteMany({
      where: { publicId },
    });

    // 4. no 에 해당하는 빵 이미지 순서 조정
    await prisma.image.updateMany({
      where: {
        imageTargetType: '10',
        imageTargetNo: parseInt(no),
        order: { gt: deletedImage.order! }, // 삭제된 order 이후만 처리
      },
      data: {
        order: { decrement: 1 },
      },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

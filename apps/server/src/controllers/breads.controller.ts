import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
import { UploadedFile } from 'express-fileupload';
import cloudinary from '@/lib/cloudinary';
import { commonCodeMap } from '@/services/common-code.service';

const MAX_UPLOAD_COUNT = 10;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

/** 빵 목록 조회 */
export async function getBreads(_: Request, res: Response) {
  try {
    // 최대 10000 개 조회
    const breads = await prisma.breads.findMany({
      take: 10000,
      orderBy: {
        no: 'desc',
      },
    });

    const images = await prisma.images.findMany({
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

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
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

    const bread = await prisma.breads.findUnique({
      where: { no: parseInt(no) },
    });

    if (!bread) {
      res.status(404).json({ message: '빵을 찾을 수 없습니다.' });
      return;
    }

    const images = await prisma.images.findMany({
      where: { imageTargetType: '10', imageTargetNo: parseInt(no) },
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
      const bread = await prisma.breads.create({
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
          await prisma.images.create({
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
      const bread = await prisma.breads.create({
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

// 빵 수정

// 빵 삭제
// => 여러건 가능

// 빵 상태 변경
//=> 단건

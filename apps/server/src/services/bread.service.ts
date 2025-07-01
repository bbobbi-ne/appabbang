import { prisma } from '@/lib/prisma';
import { commonCodeMap } from './common-code.service';
import { Bread, Image } from '@prisma/client';
import * as ImageService from './image.service';
import { UploadedFile } from 'express-fileupload';
import { AppError } from '@/types';

const IMAGE_TARGET_TYPE = '10'; // 빵 이미지 코드

export const getAll = async () => {
  // 최대 10000 개 조회
  const result = await prisma.$transaction(async (tx) => {
    const breads = await tx.bread.findMany({
      take: 10000,
      orderBy: {
        no: 'desc',
      },
    });

    const images = await tx.image.findMany({
      take: 10000,
      orderBy: [{ no: 'desc' }, { order: 'asc' }],
      where: {
        imageTargetType: IMAGE_TARGET_TYPE,
        order: 1,
      },
    });

    const imageMap = new Map<number, string>();
    images.forEach((img: any) => {
      imageMap.set(img.imageTargetNo, img.url);
    });

    const data = breads.map((bread: any) => ({
      ...bread,
      breadStatusName: getBreadStatusName(bread.breadStatus),
      images: [...(imageMap.get(bread.no) ? [{ url: imageMap.get(bread.no) }] : [])],
    }));

    return data;
  });

  return result;
};

export const getByStatus = async (breadStatus: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const breads = await tx.bread.findMany({
      take: 10000,
      orderBy: {
        no: 'desc',
      },
      where: { breadStatus },
    });

    const images = await tx.image.findMany({
      take: 10000,
      orderBy: [{ no: 'desc' }, { order: 'asc' }],
      where: {
        imageTargetType: IMAGE_TARGET_TYPE,
        imageTargetNo: { in: breads.map((bread: Bread) => bread.no) },
      },
      select: {
        publicId: true,
        url: true,
        name: true,
        order: true,
        imageTargetNo: true,
      },
    });

    const imageMap = new Map<number, string>();
    images.forEach((img: Partial<Image>) => {
      if (img.imageTargetNo) {
        imageMap.set(img.imageTargetNo, img.url || '');
      }
    });

    const data = breads.map((bread: any) => ({
      ...bread,
      breadStatusName: getBreadStatusName(bread.breadStatus),
      images: [{ url: imageMap.get(bread.no) }],
    }));

    return data;
  });

  return result;
};

/** 빵 상태 이름 조회 */
export function getBreadStatusName(code: string): string {
  return commonCodeMap.breadStatusMap.get(code) || '-';
}

/** 빵 상세 조회 */
export const getByNo = async (no: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const bread = await tx.bread.findUnique({
      where: { no },
    });

    if (!bread) {
      throw AppError.notFound('빵을 찾을 수 없습니다.', { breadNo: no });
    }

    const images = await tx.image.findMany({
      where: { imageTargetType: IMAGE_TARGET_TYPE, imageTargetNo: no },
      orderBy: {
        order: 'asc',
      },
      select: {
        publicId: true,
        url: true,
        name: true,
        order: true,
      },
    });

    const data = {
      ...bread,
      images,
    };

    return data;
  });

  return result;
};

/** 빵 생성 (이미지 없음) */
export const createWithoutImages = async (
  body: Pick<Bread, 'name' | 'description' | 'unitPrice' | 'breadStatus'>,
) => {
  const result = await prisma.bread.create({
    data: body,
  });

  return { ...result, images: [] };
};

/** 빵 생성 (이미지 있음) */
export const createWithImages = async (
  body: Pick<Bread, 'name' | 'description' | 'unitPrice' | 'breadStatus'>,
  images: UploadedFile[] | UploadedFile,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const bread = await tx.bread.create({
      data: body,
    });

    const uploadResults = await ImageService.createCloudinary(images);

    const uploadedImages = await Promise.all(
      uploadResults.map(async (result, index) => {
        await tx.image.create({
          data: {
            publicId: result.public_id,
            url: result.secure_url,
            name: result.original_filename,
            imageTargetNo: bread.no,
            imageTargetType: IMAGE_TARGET_TYPE, // 빵 이미지
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

    return { ...bread, images: uploadedImages };
  });

  return result;
};

/** 빵 수정 (이미지 없음) */
export const updateWithoutImages = async (
  no: number,
  body: Partial<Pick<Bread, 'name' | 'description' | 'unitPrice' | 'breadStatus'>>,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const bread = await tx.bread.update({
      where: { no },
      data: body,
    });

    const images = await tx.image.findMany({
      where: { imageTargetNo: no, imageTargetType: IMAGE_TARGET_TYPE },
      orderBy: { order: 'asc' },
      select: {
        publicId: true,
        url: true,
        name: true,
        order: true,
      },
    });

    return { ...bread, images };
  });
  return result;
};

/** 빵 수정 (이미지 있음) */
export const updateWithImages = async (
  no: number,
  body: Partial<Pick<Bread, 'name' | 'description' | 'unitPrice' | 'breadStatus'>>,
  images: UploadedFile[] | UploadedFile,
) => {
  const result = await prisma.$transaction(async (tx) => {
    // 빵 수정
    const bread = await tx.bread.update({
      where: { no },
      data: body,
    });

    // 기존 이미지의 마지막 순서 조회하여 클라우디너리 이미지 업로드
    const findedImages = await prisma.image.findMany({
      where: { imageTargetNo: no, imageTargetType: IMAGE_TARGET_TYPE },
      orderBy: { order: 'asc' },
      select: { order: true, publicId: true, url: true, name: true },
    });
    const lastOrder = findedImages[findedImages.length - 1]?.order || 0;
    const uploadResults = await ImageService.updateCloudinary(lastOrder, images);

    // 이미지 생성 (db)
    const uploadedImages = await Promise.all(
      uploadResults.map(async (result, index) => {
        await tx.image.create({
          data: {
            publicId: result.public_id,
            url: result.secure_url,
            name: result.original_filename,
            imageTargetNo: no,
            imageTargetType: IMAGE_TARGET_TYPE,
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

    return { ...bread, images: uploadedImages };
  });

  return result;
};

/** 빵 삭제 (여러건) */
export const remove = async (noList: number[]) => {
  await prisma.$transaction(async (tx) => {
    // 빵 삭제
    await tx.bread.deleteMany({
      where: { no: { in: noList } },
    });

    // 대상 publicId 조회
    const idList = await tx.image.findMany({
      where: { imageTargetNo: { in: noList }, imageTargetType: IMAGE_TARGET_TYPE },
      select: {
        publicId: true,
      },
    });
    const publicIdList = idList.map((item: { publicId: string }) => item.publicId);

    await ImageService.removeCloudinary(publicIdList);

    await prisma.image.deleteMany({
      where: { publicId: { in: publicIdList } },
    });
  });
};

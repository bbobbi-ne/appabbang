import { prisma } from '@/lib/prisma';
import { commonCodeMap } from './common-code.service';
import { Bread, Image } from '@prisma/client';
import * as ImageService from './image.service';
import { UploadedFile } from 'express-fileupload';
import { AppError } from '@/types';

type CreateBreadRequestBody = Pick<
  Bread,
  'name' | 'description' | 'unitPrice' | 'breadStatus' | 'countryOfOrigin' | 'allergyInfo'
>;
type UpdateBreadRequestBody = CreateBreadRequestBody;
const IMAGE_TARGET_TYPE_CODE = '10'; // 빵 이미지 코드

/** 빵 목록 전체 조회 */
export const getAll = async () => {
  const result = await prisma.$transaction(async (tx) => {
    const breads = await tx.bread.findMany({
      take: 10000, // 최대 10000 개 조회
      orderBy: {
        createdAt: 'desc',
      },
    });

    const images = await tx.image.findMany({
      take: 10000,
      orderBy: [{ no: 'desc' }, { order: 'asc' }],
      where: {
        imageTargetType: IMAGE_TARGET_TYPE_CODE,
        order: 1,
      },
      select: {
        imageTargetNo: true,
        url: true,
      },
    });

    const imageMap = new Map<number, string>();
    images.forEach((img: Pick<Image, 'imageTargetNo' | 'url'>) => {
      // imageTargetNo 는 빵 no 와 동일함
      imageMap.set(img.imageTargetNo, img.url ?? '');
    });

    const data = breads.map((bread: Bread) => ({
      ...bread,
      breadStatusName: getBreadStatusName(bread.breadStatus),
      images: [...(imageMap.get(bread.no) ? [{ url: imageMap.get(bread.no) }] : [])],
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
      where: { imageTargetType: IMAGE_TARGET_TYPE_CODE, imageTargetNo: no },
      orderBy: {
        order: 'asc',
      },
      select: {
        publicId: true,
        url: true,
        order: true,
      },
    });

    return { ...bread, images };
  });

  return result;
};

/** 빵 생성 */
export const create = async (
  body: CreateBreadRequestBody,
  images?: UploadedFile[] | UploadedFile,
) => {
  await prisma.$transaction(async (tx) => {
    const bread = await tx.bread.create({
      data: body,
    });

    if (images) {
      const uploadResults = await ImageService.createCloudinary(images);
      await Promise.all(
        uploadResults.map(async (result, index) => {
          await tx.image.create({
            data: {
              publicId: result.public_id,
              url: result.secure_url,
              // name: result.original_filename,
              imageTargetNo: bread.no,
              imageTargetType: IMAGE_TARGET_TYPE_CODE, // 빵 이미지
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
    }
  });
};

/** 빵 수정 */
export const update = async (
  no: number,
  body: UpdateBreadRequestBody,
  images?: UploadedFile[] | UploadedFile,
) => {
  await prisma.$transaction(async (tx) => {
    const updateData: Partial<UpdateBreadRequestBody> = { ...body };
    delete (updateData as any).no;
    await tx.bread.update({
      where: { no },
      data: updateData,
    });

    if (images) {
      // 기존 이미지의 마지막 순서 조회하여 클라우디너리 이미지 업로드
      const findedImages = await prisma.image.findMany({
        where: { imageTargetNo: no, imageTargetType: IMAGE_TARGET_TYPE_CODE },
        orderBy: { order: 'asc' },
        select: { order: true, publicId: true, url: true },
      });
      const lastOrder = findedImages[findedImages.length - 1]?.order || 0;
      const uploadResults = await ImageService.updateCloudinary(lastOrder, images);

      // 이미지 생성 (db)
      await Promise.all(
        uploadResults.map(async (result, index) => {
          await tx.image.create({
            data: {
              publicId: result.public_id,
              url: result.secure_url,
              // name: result.original_filename,
              imageTargetNo: no,
              imageTargetType: IMAGE_TARGET_TYPE_CODE,
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
    }
  });
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
      where: { imageTargetNo: { in: noList }, imageTargetType: IMAGE_TARGET_TYPE_CODE },
      select: {
        publicId: true,
      },
    });
    const publicIdList = idList
      .map((item: { publicId: string | null }) => item.publicId)
      .filter((item: string | null) => item !== null);

    await ImageService.removeCloudinary(publicIdList);

    await prisma.image.deleteMany({
      where: { publicId: { in: publicIdList } },
    });
  });
};

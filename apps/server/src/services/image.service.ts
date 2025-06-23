import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { UploadedFile } from 'express-fileupload';

export const MAX_UPLOAD_COUNT = 10;
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

/** 이미지 생성 (cloudinary) */
export const createCloudinary = async (images: UploadedFile[] | UploadedFile) => {
  const files = Array.isArray(images) ? images : [images];

  // 최대 개수 제한
  if (files.length > MAX_UPLOAD_COUNT) {
    throw new Error(`이미지는 최대 ${MAX_UPLOAD_COUNT}개까지 업로드할 수 있습니다.`);
  }

  // 확장자 검사
  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error(`jpg, jpeg, png 형식의 파일만 업로드할 수 있습니다.`);
    }
  }

  // 이미지 생성 (cloudinary)
  const uploadResults = await cloudinary.upload(files);

  return uploadResults;
};

/** 이미지 수정 (cloudinary) */
export const updateCloudinary = async (
  lastOrder: number,
  images: UploadedFile[] | UploadedFile,
) => {
  const files = Array.isArray(images) ? images : [images];

  // 최대 개수 제한
  if (files.length + lastOrder > MAX_UPLOAD_COUNT) {
    throw new Error(`이미지는 최대 ${MAX_UPLOAD_COUNT}개까지 업로드할 수 있습니다.`);
  }

  const uploadResults = await createCloudinary(images);

  return uploadResults;
};

/** 이미지 삭제 (cloudinary) */
export const removeCloudinary = async (publicIdList: string[]) => {
  await cloudinary.destroy(publicIdList);
};

/** 이미지 삭제 (db + cloudinary) */
export const remove = async (publicIdList: string[]) => {
  await removeCloudinary(publicIdList);

  await prisma.image.deleteMany({
    where: { publicId: { in: publicIdList } },
  });
};

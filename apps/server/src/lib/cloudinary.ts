import {
  v2 as cloudinary,
  DeliveryType,
  ResourceType,
  ResponseCallback,
  UploadApiOptions,
  UploadResponseCallback,
} from 'cloudinary';
import { UploadedFile } from 'express-fileupload';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default {
  resources: async () => {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'breads/', // 폴더 이름
      max_results: 30, // 원하는 개수
    });

    return result;
  },
  upload: async (
    files: UploadedFile[],
    options?: UploadApiOptions,
    callback?: UploadResponseCallback,
  ) => {
    // 이미지 업로드 병렬 처리
    const uploadResults = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(
          file.tempFilePath,
          {
            folder: 'breads', // 폴더명
            quality: 'auto', // 자동 품질 최적화
            fetch_format: 'auto', // WebP 등 브라우저에 맞게 포맷 자동 최적화
            ...(options && options),
          },
          callback,
        ),
      ),
    );

    return uploadResults;
  },
  destroy: async (
    publicIds: string[],
    options?: {
      resource_type?: ResourceType;
      type?: DeliveryType;
      invalidate?: boolean;
    },
    callback?: ResponseCallback,
  ) => {
    await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id, options, callback)));
  },
};

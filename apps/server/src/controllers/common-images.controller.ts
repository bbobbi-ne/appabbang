import { Request, Response } from 'express';
import cloudinary from '@/lib/cloudinary';

const MAX_UPLOAD_COUNT = 10;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const getImages = async (_: Request, res: Response) => {
  try {
    const images = await cloudinary.resources();
    res.status(200).json(images);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '이미지 조회 실패' });
  }
};

export const uploadImages = async (req: Request, res: Response) => {
  try {
    const images = req.files?.image;

    if (!images) {
      res.status(400).json({ message: '이미지를 업로드해주세요.' });
      return;
    }

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

    const uploadResults = await cloudinary.upload(files);

    res.status(201).json(uploadResults);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '업로드 실패' });
  }
};

export const deleteImages = async (req: Request, res: Response) => {
  try {
    const { publicIds } = req.body;

    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      res.status(400).json({ message: 'publicIds 배열이 필요합니다.' });
      return;
    }

    await cloudinary.destroy(publicIds);

    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '삭제 실패' });
  }
};

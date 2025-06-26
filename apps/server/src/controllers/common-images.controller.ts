import { Request, Response } from 'express';
import cloudinary from '@/lib/cloudinary';
import * as ImageService from '@/services/image.service';

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

    const uploadResults = await ImageService.createCloudinary(images);

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

    await ImageService.removeCloudinary(publicIds);

    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '삭제 실패' });
  }
};

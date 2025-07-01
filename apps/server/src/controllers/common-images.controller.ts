import { Request, Response } from 'express';
import cloudinary from '@/lib/cloudinary';
import * as ImageService from '@/services/image.service';
import { AppError } from '@/types';

export const getImages = async (_: Request, res: Response) => {
  const images = await cloudinary.resources();
  res.status(200).json(images);
};

export const uploadImages = async (req: Request, res: Response) => {
  const images = req.files?.image;

  if (!images) {
    throw AppError.badRequest('이미지를 업로드해주세요.');
  }

  const uploadResults = await ImageService.createCloudinary(images);

  res.status(201).json(uploadResults);
};

export const deleteImages = async (req: Request, res: Response) => {
  const { publicIds } = req.body;

  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    throw AppError.badRequest('publicIds 배열이 필요합니다.');
  }

  await ImageService.removeCloudinary(publicIds);

  res.sendStatus(204);
};

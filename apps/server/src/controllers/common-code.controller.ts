import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
import { CodeGroup } from '@/types';

export const getCommonCode = async (_: Request, res: Response) => {
  // 최대 1000 개 조회
  const commonCode = await prisma.commonCode.findMany({
    take: 1000,
  });

  res.status(200).json(commonCode);
};

export const getCommonCodeByGroupName = async (req: Request, res: Response) => {
  const { groupName } = req.params;

  if (!groupName) {
    getCommonCode(req, res);
  }

  if (!Object.values(CodeGroup).includes(groupName as any)) {
    res.status(400).json({
      message: `'${groupName}'은(는) 유효하지 않은 코드 그룹입니다. (그룹명: ${Object.values(CodeGroup).join(', ')})`,
    });
  }

  const commonCode = await prisma.commonCode.findMany({
    where: { groupName },
    select: { code: true, name: true },
  });

  res.status(200).json(commonCode);
};

export const createCommonCode = async (req: Request, res: Response) => {
  const { code, groupName, name, remarkTxt } = req.body;
  await prisma.commonCode.create({
    data: { code, groupName, name, remarkTxt },
  });
  res.sendStatus(201);
};

export const updateCommonCode = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { code, groupName, name, remarkTxt } = req.body;

  if (!no) {
    res.status(400).json({ message: 'no 는 필수입니다' });
    return;
  }

  await prisma.commonCode.update({
    where: { no: Number(no) },
    data: { code, groupName, name, remarkTxt },
  });

  res.sendStatus(200);
};

export const deleteCommonCode = async (req: Request, res: Response) => {
  const { no } = req.params;

  if (!no) {
    res.status(400).json({ message: 'no 는 필수입니다' });
    return;
  }

  await prisma.commonCode.delete({
    where: { no: Number(no) },
  });
  res.sendStatus(204);
};

import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';

export const getByIdForLogin = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      no: true,
      id: true,
      pw: true,
      name: true,
      userRole: true,
    },
  });

  return user;
};

// 리프레시토큰 업데이트
export const updateRefreshToken = async (id: string, refreshToken: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: { refreshToken },
  });

  return user;
};

/** 유저 조회 */
export const getOne = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  return user;
};

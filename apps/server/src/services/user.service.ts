import { prisma } from '@/lib/prisma';

export const getById = async (id: string) => {
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

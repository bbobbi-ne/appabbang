import { prisma } from '@/lib/prisma';
import { AppError } from '@/types';

/**
 * 로그인하기 위한 사용자 정보 조회 (민감정보)
 * @param id
 * @returns user: User 테이블 정보
 */
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

/** refreshToken 업데이트 (어드민) */
export const updateRefreshToken = async (id: string, refreshToken: string | null) => {
  const user = await prisma.user.update({
    where: { id },
    data: { refreshToken },
  });

  return user;
};

/** 존재하는지만 확인하는 조회 함수 */
export const getOneForCheck = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      no: true,
      id: true,
    },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  return user;
};

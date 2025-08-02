import { prisma } from '@/lib/prisma';
import { UploadedFile } from 'express-fileupload';
import * as ImageService from './image.service';

/**
 * 주문차수 목록 조회
 */
export const getOrderRoundList = async () => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. 주문차수 이미지 공통코드 조회
    const IMAGE_TARGET_TYPE = await prisma.commonCode.findFirst({
      where: {
        groupName: 'image_target_type',
        name: 'orderRound',
      },
      select: {
        code: true,
      },
    });

    // 2. 주문차수 목록 조회
    const list = await tx.orderRound.findMany({
      select: {
        no: true,
        seq: true,
        name: true,
        startedAt: true,
        endedAt: true,
        orderRoundBreads: {
          select: {
            breadNo: true,
          },
        },
      },
      orderBy: { no: 'desc' },
    });

    // 3. 주문차수 이미지 조회
    const images = await tx.image.findMany({
      where: {
        imageTargetType: IMAGE_TARGET_TYPE!.code,
        order: 1,
      },
    });

    const imageMap = new Map<number, string>();
    images.forEach((img: any) => {
      imageMap.set(img.imageTargetNo, img.url);
    });

    const data = list.map((orderRound: any) => ({
      ...orderRound,
      image: imageMap.get(orderRound.no) || null,
    }));

    return data;
  });

  return result;
};

/**
 * 주문차수 상세 조회
 */
export const getOrderRound = async (no: number) => {
  const orderRound = await prisma.orderRound.findUnique({
    where: { no },
    select: {
      no: true,
      seq: true,
      name: true,
      startedAt: true,
      endedAt: true,
      orderRoundBreads: {
        select: {
          breadNo: true,
        },
      },
    },
  });

  return orderRound;
};

/** 주문차수 prop interface */
interface IOrderRound {
  no: number;
  seq: number;
  name: string;
  breadNoList: number[];
  startedAt: string;
  endedAt: string;
}

/**
 *  주문차수 등록(이미지 없음)
 *  or: orderRound
 *  orb: orderRoundBread
 */
export const createWithoutImage = async (
  body: Pick<IOrderRound, 'seq' | 'name' | 'breadNoList' | 'startedAt' | 'endedAt'>,
) => {
  try {
    // 1. 주문차수 등록 :: orderRound
    const orResult = await prisma.orderRound.create({
      data: body,
    });

    // 2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
    const breadNoList = await Promise.all(
      body.breadNoList.map(async (breadNo) => {
        const { breadNo: resultBreadNo } = await createOrderRoundBread({
          seq: body.seq,
          breadNo,
        });

        return resultBreadNo;
      }),
    );

    // 결과체크
    console.log({ ...orResult, breadNoList, image: [] });

    // 3. return model 생성 :: 주문차수 + (주문차수 + 빵) 목록
    return { ...orResult, breadNoList, image: [] };
  } catch (e) {
    return {
      code: 500,
      message: '주문차수 등록 과정에서 문제가 발생했습니다. \n관리자 확인이 필요합니다.',
    };
  }
};

/**
 * 주문차수 등록(이미지 있음)
 */
export const createWithImage = async (
  body: Pick<IOrderRound, 'seq' | 'name' | 'breadNoList' | 'startedAt' | 'endedAt'>,
  image: UploadedFile[] | UploadedFile,
) => {
  try {
    // 1. 주문차수 등록 :: orderRound
    const orResult = await prisma.orderRound.create({
      data: body,
    });

    // 2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
    const breadNoList = await Promise.all(
      body.breadNoList.map(async (breadNo) => {
        const { breadNo: resultBreadNo } = await createOrderRoundBread({
          seq: body.seq,
          breadNo,
        });

        return resultBreadNo;
      }),
    );

    // 3. 이미지 등록
    const imgResult = await ImageService.createCloudinary(image);

    // 결과체크
    console.log({ ...orResult, breadNoList, image: imgResult[0] });

    return { ...orResult, breadNoList, image: imgResult[0] };
  } catch (e) {
    return {
      code: 500,
      message: '주문차수 등록 과정에서 문제가 발생했습니다. \n관리자 확인이 필요합니다.',
    };
  }
};

/**
 * 주문차수 - 빵 매핑 테이블 등록
 */
const createOrderRoundBread = async ({ seq, breadNo }: { seq: number; breadNo: number }) => {
  const result = await prisma.orderRoundBread.create({
    data: {
      seq,
      breadNo,
    },
  });

  return { ...result };
};

/**
 * 주문차수 수정 (이미지 없음)
 */
export const updateWithoutImage = async (
  body: Pick<IOrderRound, 'no' | 'seq' | 'name' | 'breadNoList' | 'startedAt' | 'endedAt'>,
) => {
  const { no, seq, name, startedAt, endedAt } = body;

  try {
    // 1. 주문차수 수정 :: orderRound
    const orResult = await prisma.orderRound.update({
      where: { no },
      data: {
        seq,
        name,
        startedAt,
        endedAt,
      },
    });

    // 2. 주문차수 - 빵  매핑 테이블 수정
    // 2-1. 기존 빵을 조회하고 다시 수정하는 건 효율이 없으므로 특정 주문차수에 포함된 행은 완전삭제하고 다시 새롭게 등록한다.
    await prisma.orderRoundBread.deleteMany({
      where: { seq },
    });

    // 2-2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
    const breadNoList = await Promise.all(
      body.breadNoList.map(async (breadNo) => {
        const { breadNo: resultBreadNo } = await createOrderRoundBread({
          seq: body.seq,
          breadNo,
        });

        return resultBreadNo;
      }),
    );

    // 3. 결과 확인
    console.log({ ...orResult, breadNoList, image: [] });

    return { ...orResult, breadNoList, image: [] };
  } catch (e) {
    return {
      code: 500,
      message: '주문차수 수정 과정에서 문제가 발생했습니다. \n관리자 확인이 필요합니다.',
    };
  }
};

/**
 * 주문차수 수정 (이미지 있음)
 */
export const updateWithImage = async (
  body: Pick<IOrderRound, 'no' | 'seq' | 'name' | 'breadNoList' | 'startedAt' | 'endedAt'>,
  image: UploadedFile[] | UploadedFile,
) => {
  const { no, seq, name, startedAt, endedAt } = body;

  try {
    // 1. 주문차수 수정 :: orderRound
    const orResult = await prisma.orderRound.update({
      where: { no },
      data: {
        seq,
        name,
        startedAt,
        endedAt,
      },
    });

    // 2. 주문차수 - 빵  매핑 테이블 수정
    // 2-1. 기존 빵을 조회하고 다시 수정하는 건 효율이 없으므로 특정 주문차수에 포함된 행은 완전삭제하고 다시 새롭게 등록한다.
    await prisma.orderRoundBread.deleteMany({
      where: { seq },
    });

    // 2-2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
    const breadNoList = await Promise.all(
      body.breadNoList.map(async (breadNo) => {
        const { breadNo: resultBreadNo } = await createOrderRoundBread({
          seq: body.seq,
          breadNo,
        });

        return resultBreadNo;
      }),
    );

    // 이미지도 삭제하고 재등록해야 함.
    await prisma.$transaction(async (tx) => {
      const imgList = await tx.image.findMany({
        where: {},
      });
    });

    // 3. 이미지 등록
    const imgResult = await ImageService.createCloudinary(image);

    // 3. 결과 확인
    console.log({ ...orResult, breadNoList, image: imgResult[0] });

    return { ...orResult, breadNoList, image: imgResult[0] };
  } catch (e) {
    return {
      code: 500,
      message: '주문차수 수정 과정에서 문제가 발생했습니다. \n관리자 확인이 필요합니다.',
    };
  }
};

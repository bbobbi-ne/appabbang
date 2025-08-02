import { prisma } from '@/lib/prisma';
import { UploadedFile } from 'express-fileupload';
import * as ImageService from './image.service';
import { AppError } from '@/types';

// 1. 주문차수 이미지 공통코드 조회 - 전역 변수로 저장
let IMAGE_TARGET_TYPE_CODE: string | null = null;

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
 * 공통코드 주문차수 전용 code 조회
 */
const getImageTargetTypeCode = async () => {
  if (IMAGE_TARGET_TYPE_CODE === null) {
    const [groupName, name, code] = ['image_target_type', 'orderRound', true];

    const result = await prisma.commonCode.findFirst({
      where: {
        groupName,
        name,
      },
      select: {
        code,
      },
    });

    IMAGE_TARGET_TYPE_CODE = result?.code || null;
  }
  return IMAGE_TARGET_TYPE_CODE;
};

/**
 * 주문차수 목록 조회
 */
export const getOrderRoundList = async () => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. 주문차수 목록 조회
    const list = await tx.orderRound.findMany({
      take: 10000,
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

    // 2. 주문차수 이미지 조회
    const imageTargetType = await getImageTargetTypeCode(); // return code

    const images = await tx.image.findMany({
      where: {
        imageTargetType,
        order: 1,
      },
      orderBy: [{ no: 'desc', order: 'asc' }],
    });

    const imageMap = new Map<number, string>();
    images.forEach((img: any) => {
      imageMap.set(img.imageTargetNo, img.url);
    });

    // 3. 데이터 정렬 (or: orderRound)
    const data = list.map((or: any) => ({
      ...or,
      images: [...(imageMap.get(or.no) ? [{ url: imageMap.get(or.no) }] : [])],
    }));

    return data;
  });

  return result;
};

/**
 * 주문차수 상세 조회
 */
export const getOrderRound = async (no: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const or = await prisma.orderRound.findUnique({
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

    if (!or)
      throw AppError.notFound('주문차수를 찾을 수 없습니다. \n관리자에게 문의 바랍니다.', { no });

    const imageTargetType = await getImageTargetTypeCode();
    const image = await tx.image.findFirst({
      where: {
        imageTargetType,
        imageTargetNo: no,
        order: 1,
      },
      select: {
        publicId: true,
        url: true,
        name: true,
        order: true,
      },
    });

    return { ...or, image };
  });

  return result;
};

/**
 *  주문차수 등록(이미지 없음)
 *  or: orderRound
 *  orb: orderRoundBread
 */
export const createWithoutImage = async (
  body: Pick<IOrderRound, 'seq' | 'name' | 'breadNoList' | 'startedAt' | 'endedAt'>,
) => {
  try {
    // 0. 주문차수 가장 높은 값 조회
    const round = await prisma.orderRound.findFirst({
      orderBy: {
        seq: 'desc',
      },
      select: {
        seq: true,
      },
    });

    // 주문차수 자동증가
    const seq = round ? round.seq : 1;
    body.seq = seq;

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
      data: {
        seq: body.seq,
        name: body.name,
        startedAt: new Date(body.startedAt),
        endedAt: new Date(body.endedAt),
      },
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

    // 4. 이미지 정보를 데이터베이스에 저장
    const imageTargetTypeCode = await getImageTargetTypeCode();
    if (imgResult[0]) {
      await prisma.image.create({
        data: {
          url: imgResult[0].url,
          publicId: imgResult[0].publicId,
          imageTargetType: imageTargetTypeCode,
          imageTargetNo: orResult.no,
          order: 1,
        },
      });
    }

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
        startedAt: new Date(startedAt),
        endedAt: new Date(endedAt),
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
        startedAt: new Date(startedAt),
        endedAt: new Date(endedAt),
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
    const imageTargetTypeCode = await getImageTargetTypeCode();
    await prisma.$transaction(async (tx) => {
      // 기존 이미지 삭제
      await tx.image.deleteMany({
        where: {
          imageTargetType: imageTargetTypeCode,
          imageTargetNo: no,
        },
      });
    });

    // 3. 이미지 등록
    const imgResult = await ImageService.createCloudinary(image);

    // 4. 이미지 정보를 데이터베이스에 저장
    if (imgResult[0]) {
      await prisma.image.create({
        data: {
          url: imgResult[0].url,
          publicId: imgResult[0].publicId,
          imageTargetType: imageTargetTypeCode,
          imageTargetNo: orResult.no,
          order: 1,
        },
      });
    }

    // 5. 결과 확인
    console.log({ ...orResult, breadNoList, image: imgResult[0] });

    return { ...orResult, breadNoList, image: imgResult[0] };
  } catch (e) {
    return {
      code: 500,
      message: '주문차수 수정 과정에서 문제가 발생했습니다. \n관리자 확인이 필요합니다.',
    };
  }
};

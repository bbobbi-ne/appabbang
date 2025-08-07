import { prisma } from '@/lib/prisma';
import { UploadedFile } from 'express-fileupload';
import * as ImageService from './image.service';
import { AppError } from '@/types';
import { PrismaClient, Prisma, OrderRound, OrderRoundBread } from '@prisma/client';

// 1. 주문차수 이미지 공통코드 조회 - 전역 변수로 저장
let IMAGE_TARGET_TYPE_CODE: string | null = null;
const IMAGE_TARGET_TYPE_NAME = 'orderRound';

// OrderRound 등록 타입
type CreateOrderRoundInput = Pick<OrderRound, 'name' | 'startedAt' | 'endedAt'> & {
  breadNoList: number[];
};

// OrderRound 수정 타입
type UpdateOrderRoundInput = Pick<OrderRound, 'no' | 'name' | 'startedAt' | 'endedAt'> & {
  breadNoList: number[];
};

// OrderRouncBread 등록 타입
type CreatOrderRoundBreadInput = Pick<OrderRoundBread, 'no' | 'breadNo'>;

/**
 * 공통코드 주문차수 전용 code 조회
 */
const getImageTargetTypeCode = async (nameParam: string) => {
  if (IMAGE_TARGET_TYPE_CODE === null) {
    const [groupName, code] = ['image_target_type', true];
    let name = nameParam.includes('orderRound') ? IMAGE_TARGET_TYPE_NAME : 'breads';

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
    const imageTargetType = await getImageTargetTypeCode(IMAGE_TARGET_TYPE_NAME); // return code

    const images = await tx.image.findMany({
      where: {
        imageTargetType,
        order: 1,
      },
      orderBy: [{ no: 'desc' }, { order: 'asc' }],
    });

    const imageMap = new Map<number, string>();
    images.forEach((img: any) => {
      imageMap.set(img.imageTargetNo, img.url);
    });

    // 3. 데이터 정렬 (or: orderRound)
    const data = list.map((or: any) => ({
      ...or,
      image: [...(imageMap.get(or.no) ? [{ url: imageMap.get(or.no) }] : [])],
    }));

    return data;
  });

  return result;
};

/**
 * 주문차수 상세 조회
 * @params no 주문차수 테이블 번호
 * @params seq 주문차수
 */
export const getOrderRound = async (no: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const or = await prisma.orderRound.findFirst({
      where: { no },
      select: {
        no: true,
        name: true,
        startedAt: true,
        endedAt: true,
        orderRoundBreads: {
          select: {
            bread: {
              select: {
                no: true,
                name: true,
                description: true,
                unitPrice: true,
                breadStatus: true,
              },
            },
          },
        },
      },
    });

    if (!or)
      throw AppError.notFound('주문차수를 찾을 수 없습니다. \n관리자에게 문의 바랍니다.', {
        no,
      });

    // 주문차수의 이미지 조회
    const imageTargetType = await getImageTargetTypeCode(IMAGE_TARGET_TYPE_NAME);
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

    /******/
    // 주문차수-빵 매핑된 빵의 이미지 조회
    const breadImageTargetType = await getImageTargetTypeCode('breads');
    const breadImages = await tx.image.findMany({
      take: 10000,
      orderBy: [{ no: 'desc' }, { order: 'asc' }],
      where: {
        imageTargetType: breadImageTargetType,
        order: 1,
      },
    });

    const imageMap = new Map<number, string>();
    breadImages.forEach((img: any) => {
      imageMap.set(img.imageTargetNo, img.url);
    });

    /******/
    // 주문차수에 매핑된 빵 정보에 이미지 정보 삽입
    const newBreads = or.orderRoundBreads.map(({ bread }) => ({
      ...bread,
      images: [...(imageMap.get(bread.no) ? [{ url: imageMap.get(bread.no) }] : [])],
    }));

    const list = Array();

    newBreads.map((bread) => {
      const obj = { bread };
      list.push(obj);
    });

    or.orderRoundBreads = list; // 이미지가 들어간 빵 목록을 재삽입

    return { ...or, image };
  });

  return result;
};

/**
 *  주문차수 등록(이미지 X)
 *  or: orderRound
 *  orb: orderRoundBread
 */
export const createWithoutImage = async (body: CreateOrderRoundInput) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 주문차수 등록 :: orderRound
      const orResult = await prisma.orderRound.create({
        data: {
          name: body.name,
          startedAt: body.startedAt,
          endedAt: body.endedAt,
        },
      });

      // 2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
      const breadNoList = await Promise.all(
        body.breadNoList.map(async (breadNo) => {
          const { breadNo: resultBreadNo } = await createOrderRoundBread(tx, {
            no: orResult.no,
            breadNo,
          });

          return resultBreadNo;
        }),
      );

      // 3. return model 생성 :: 주문차수 + (주문차수 + 빵) 목록
      return { ...orResult, breadNoList, image: [] };
    });

    return result;
  } catch (e) {
    return {
      code: 500,
      message: '주문차수 등록 과정에서 문제가 발생했습니다. \n관리자 확인이 필요합니다.',
    };
  }
};

/**
 * 주문차수 등록(이미지 O)
 */
export const createWithImage = async (
  body: CreateOrderRoundInput,
  image: UploadedFile[] | UploadedFile,
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 주문차수 등록 :: orderRound
      const orResult = await tx.orderRound.create({
        data: {
          name: body.name,
          startedAt: new Date(body.startedAt),
          endedAt: new Date(body.endedAt),
        },
      });

      // 2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
      const breadNoList = await Promise.all(
        body.breadNoList.map(async (breadNo) => {
          const { breadNo: resultBreadNo } = await createOrderRoundBread(tx, {
            no: orResult.no,
            breadNo,
          });

          return resultBreadNo;
        }),
      );

      // 3. 이미지 등록
      const imgResult = await ImageService.createCloudinary(image);
      const {
        url,
        public_id: publicId,
        original_filename: name,
      } = imgResult[0] as { url: string; public_id: string; original_filename: string };

      // 4. 이미지 정보를 데이터베이스에 저장
      const imageTargetType = await getImageTargetTypeCode(IMAGE_TARGET_TYPE_NAME); // return code

      if (url && publicId) {
        await tx.image.create({
          data: {
            url,
            publicId,
            name,
            imageTargetType,
            imageTargetNo: orResult.no,
            order: 1,
          },
        });
      }

      return { ...orResult, breadNoList, image: imgResult[0] };
    });

    return result;
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
const createOrderRoundBread = async (
  tx: PrismaClient | Prisma.TransactionClient,
  { no, breadNo }: CreatOrderRoundBreadInput,
) => {
  const result = await tx.orderRoundBread.create({
    data: {
      seq: no,
      breadNo,
    },
  });

  return { ...result };
};

/**
 * 주문차수 수정 (이미지 X)
 */
export const updateWithoutImage = async (body: UpdateOrderRoundInput) => {
  const { no, name, startedAt, endedAt } = body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 주문차수 수정 :: orderRound
      const orResult = await tx.orderRound.update({
        where: { no },
        data: {
          name,
          startedAt,
          endedAt,
        },
      });

      // 2. 주문차수 - 빵  매핑 테이블 수정
      // 2-1. 기존 빵을 조회하고 다시 수정하는 건 효율이 없으므로 특정 주문차수에 포함된 행은 완전삭제하고 다시 새롭게 등록한다.
      await tx.orderRoundBread.deleteMany({
        where: { seq: no },
      });

      // ************ Postman 테스트를 위해서 일단 강제로 number로 변환
      body.breadNoList = body.breadNoList.map((breadNo) => Number(breadNo));

      // 2-2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
      const breadNoList = await Promise.all(
        body.breadNoList.map(async (breadNo) => {
          const { breadNo: resultBreadNo } = await createOrderRoundBread(tx, {
            no: body.no,
            breadNo,
          });

          return resultBreadNo;
        }),
      );

      return { ...orResult, breadNoList, image: [] };
    });

    return result;
  } catch (e) {
    return {
      code: 500,
      message: '주문차수 수정 과정에서 문제가 발생했습니다. \n관리자 확인이 필요합니다.',
    };
  }
};

/**
 * 주문차수 수정 (이미지 O)
 */
export const updateWithImage = async (
  body: UpdateOrderRoundInput,
  image: UploadedFile[] | UploadedFile,
) => {
  const { no, name, startedAt, endedAt } = body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 주문차수 수정 :: orderRound
      const orResult = await prisma.orderRound.update({
        where: { no },
        data: {
          name,
          startedAt: new Date(startedAt),
          endedAt: new Date(endedAt),
        },
      });

      // 2. 주문차수 - 빵  매핑 테이블 수정
      // 2-1. 기존 빵을 조회하고 다시 수정하는 건 효율이 없으므로 특정 주문차수에 포함된 행은 완전삭제하고 다시 새롭게 등록한다.
      await prisma.orderRoundBread.deleteMany({
        where: { seq: orResult.no },
      });

      // ************ Postman 테스트를 위해서 일단 강제로 number로 변환
      body.breadNoList = body.breadNoList.map((breadNo) => Number(breadNo));

      // 2-2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
      const breadNoList = await Promise.all(
        body.breadNoList.map(async (breadNo) => {
          const { breadNo: resultBreadNo } = await createOrderRoundBread(tx, {
            no: body.no,
            breadNo,
          });

          return resultBreadNo;
        }),
      );

      const imageTargetType = await getImageTargetTypeCode(IMAGE_TARGET_TYPE_NAME); // return code

      // 3. 이미지 수정
      // 기존 이미지의 마지막 순서 조회하여 클라우디너리 이미지 업로드
      const findImg = await prisma.image.findFirst({
        where: { imageTargetNo: no, imageTargetType },
        orderBy: { order: 'asc' },
        select: { order: true, publicId: true, url: true, name: true },
      });

      // 클라우디너리에 재업로드
      const lastOrder = findImg?.order || 0;
      const uploadResult = await ImageService.updateCloudinary(lastOrder, image); // update image cloud
      let returnImg = null;

      /* 삭제 */
      if (findImg) {
        await prisma.image.deleteMany({
          where: { publicId: findImg.publicId },
        });
      }

      /* 등록 */
      if (uploadResult[0]) {
        returnImg = await prisma.image.create({
          data: {
            publicId: uploadResult[0].public_id,
            url: uploadResult[0].secure_url,
            name: uploadResult[0].original_filename,
            imageTargetNo: no,
            imageTargetType,
            order: 1,
          },
        });
      }

      return { ...orResult, breadNoList, image: returnImg };
    });

    return result;
  } catch (e) {
    return {
      code: 500,
      message: '주문차수 수정 과정에서 문제가 발생했습니다. \n관리자 확인이 필요합니다.',
    };
  }
};

/**
 * 최신 주문차수 조회
 */
export const getLatest = async () => {
  const result = await prisma.$transaction(async (tx) => {
    const or = await prisma.orderRound.findFirst({
      select: {
        no: true,
        name: true,
        startedAt: true,
        endedAt: true,
        orderRoundBreads: {
          select: {
            bread: {
              select: {
                no: true,
                name: true,
                description: true,
                unitPrice: true,
                breadStatus: true,
              },
            },
          },
        },
      },
      orderBy: {
        no: 'desc',
      },
    });

    const imageTargetType = await getImageTargetTypeCode(IMAGE_TARGET_TYPE_NAME);
    let image;

    if (or) {
      image = await tx.image.findFirst({
        where: {
          imageTargetType,
          imageTargetNo: or.no,
          order: 1,
        },
        select: {
          publicId: true,
          url: true,
          name: true,
          order: true,
        },
      });
    }

    return { ...or, image };
  });

  return result;
};

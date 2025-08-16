import { prisma } from '@/lib/prisma';
import { UploadedFile } from 'express-fileupload';
import * as ImageService from './image.service';
import { AppError } from '@/types';
import { PrismaClient, Prisma, OrderRound, OrderRoundBread } from '@prisma/client';

// 1. 주문차수 이미지 공통코드 조회 - 전역 변수로 저장
let IMAGE_TARGET_TYPE_CODE: string | null = null;
const IMAGE_TARGET_TYPE_NAME = 'orderRound';

/** 클라우드 이미지 타입 */
type ImageProps = {
  url: string;
  public_id: string;
};

/** orderRoundBreads : 주문차수-빵 타입 */
type OrderRoundBreadsProps = {
  no: number;
  name: string;
};

/** OrderRound : 주문차수 등록 타입 */
type CreateOrderRoundInput = Pick<
  OrderRound,
  'name' | 'startedAt' | 'endedAt' | 'minOrderQty' | 'maxOrderQty'
> & {
  orderRoundBreads: OrderRoundBreadsProps[];
};

/** OrderRound : 주문차수 수정 타입 */
type UpdateOrderRoundInput = Pick<
  OrderRound,
  'no' | 'name' | 'startedAt' | 'endedAt' | 'minOrderQty' | 'maxOrderQty'
> & {
  orderRoundBreads: OrderRoundBreadsProps[];
};

/** OrderRouncBread : 주문차수 등록 타입 */
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
        minOrderQty: true,
        maxOrderQty: true,
        orderRoundBreads: {
          select: {
            bread: {
              select: {
                no: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { no: 'desc' },
    });

    // 2. 주문차수 이미지 조회
    const imageTargetType = await getImageTargetTypeCode(IMAGE_TARGET_TYPE_NAME); // return code
    let images;
    const imageMap = new Map<number, string>();

    if (imageTargetType) {
      images = await tx.image.findMany({
        where: { imageTargetType, order: 1 },
        orderBy: [{ no: 'desc' }, { order: 'asc' }],
      });

      images.forEach((img: any) => imageMap.set(img.imageTargetNo, img.url));
    }

    // 3. 데이터 정렬 (or: orderRound)
    const data = list.map((or) => {
      const orderRoundBreads = or.orderRoundBreads.map(({ bread }) => bread);

      return {
        ...or,
        orderRoundBreads,
        image: [...(imageMap.get(or.no) ? [{ url: imageMap.get(or.no) }] : [])],
      };
    });

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
    const or = await tx.orderRound.findFirst({
      where: { no },
      select: {
        no: true,
        name: true,
        startedAt: true,
        endedAt: true,
        minOrderQty: true,
        maxOrderQty: true,
        orderRoundBreads: {
          select: {
            bread: {
              select: {
                no: true,
                name: true,
                description: true,
                unitPrice: true,
                breadStatus: true,
                allergyInfo: true,
                countryOfOrigin: true,
              },
            },
          },
        },
      },
    });

    if (!or)
      throw AppError.notFound('주문차수를 찾을 수 없습니다. \n관리자에게 문의 바랍니다.', { no });

    // 주문차수의 이미지 조회
    const imageTargetType = await getImageTargetTypeCode(IMAGE_TARGET_TYPE_NAME);
    let image;

    if (imageTargetType) {
      image = await tx.image.findFirst({
        where: {
          imageTargetType,
          imageTargetNo: no,
          order: 1,
        },
        select: {
          publicId: true,
          url: true,
          order: true,
        },
      });
    }

    /******/
    // 주문차수-빵 매핑된 빵의 이미지 조회
    const breadImageTargetType = await getImageTargetTypeCode('breads');
    let breadImages;
    const imageMap = new Map<number, string>();

    if (breadImageTargetType) {
      breadImages = await tx.image.findMany({
        take: 10000,
        orderBy: [{ no: 'desc' }, { order: 'asc' }],
        where: {
          imageTargetType: breadImageTargetType,
          order: 1,
        },
      });

      breadImages.forEach((img: any) => imageMap.set(img.imageTargetNo, img.url));
    }

    /******/
    // 주문차수에 매핑된 빵 정보에 이미지 정보 삽입
    const newBreads = or.orderRoundBreads.map(({ bread }: any) => ({
      ...bread,
      images: [...(imageMap.get(bread.no) ? [{ url: imageMap.get(bread.no) }] : [])],
    }));

    const list = Array();

    newBreads.map((bread) => {
      const obj = { bread };
      list.push(obj);
    });

    or.orderRoundBreads = list; // 이미지가 들어간 빵 목록을 재삽입

    // 데이터 정렬 (or: orderRound)
    const orderRoundBreads = or?.orderRoundBreads.map(({ bread }) => bread);
    return { ...or, orderRoundBreads, image };
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
      const { name, startedAt, endedAt, minOrderQty, maxOrderQty } = body;

      // 1. 주문차수 등록 :: orderRound
      const orResult = await tx.orderRound.create({
        data: { name, startedAt, endedAt, minOrderQty, maxOrderQty },
      });

      // 2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
      const orderRoundBreads = await Promise.all(
        body.orderRoundBreads.map(async (bread) => {
          const createdBread = await createOrderRoundBread(tx, {
            no: orResult.no,
            breadNo: bread.no,
          });

          return createdBread;
        }),
      );

      // 3. return model 생성 :: 주문차수 + (주문차수 + 빵) 목록
      return { ...orResult, orderRoundBreads, image: [] };
    });

    return result;
  } catch (e) {
    console.log(e);
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
          minOrderQty: body.minOrderQty,
          maxOrderQty: body.maxOrderQty,
        },
      });

      // 2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
      const orderRoundBreads = await Promise.all(
        body.orderRoundBreads.map(async (bread) => {
          const createdBread = await createOrderRoundBread(tx, {
            no: orResult.no,
            breadNo: bread.no,
          });

          return createdBread;
        }),
      );

      // 3. 이미지 등록
      const imgResult = await ImageService.createCloudinary(image);
      const { url, public_id: publicId } = imgResult[0] as ImageProps;

      // 4. 이미지 정보를 데이터베이스에 저장
      const imageTargetType = await getImageTargetTypeCode(IMAGE_TARGET_TYPE_NAME); // return code

      if (imageTargetType) {
        if (url && publicId) {
          await tx.image.create({
            data: {
              url,
              publicId,
              imageTargetType,
              imageTargetNo: orResult.no,
              order: 1,
            },
          });
        }
      }

      return { ...orResult, orderRoundBreads, image: imgResult[0] };
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
 * 그 이후, 빵 정보를 조회하여 리턴한다.
 */
const createOrderRoundBread = async (
  tx: PrismaClient | Prisma.TransactionClient,
  { no, breadNo }: CreatOrderRoundBreadInput,
) => {
  const orderRoundBread = await tx.orderRoundBread.create({
    data: { orderRoundNo: no, breadNo },
  });

  if (orderRoundBread.breadNo) {
    const bread = await tx.bread.findFirst({
      where: { no: orderRoundBread.breadNo ?? undefined },
    });

    return bread ? { no: bread.no, name: bread.name } : null;
  }
};

/**
 * 주문차수 수정 (이미지 X)
 */
export const updateWithoutImage = async (body: UpdateOrderRoundInput) => {
  const { no, name, startedAt, endedAt, minOrderQty, maxOrderQty } = body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 0. 현재 시작일자가 존재하는 주문차수를 조회한다. (수정대상 제외)
      const findOr = await selectStartedAtOrderRound(startedAt);

      if (findOr && findOr.no !== body.no) {
        throw AppError.notFound(
          '다른 주문차수 일자에 포함됩니다. 시작일자/종료일자를 검토하세요.',
          { no, diffNo: findOr.no },
        );
      }

      // 1. 주문차수 수정 :: orderRound
      const orResult = await tx.orderRound.update({
        where: { no },
        data: {
          name,
          startedAt,
          endedAt,
          minOrderQty,
          maxOrderQty,
        },
      });

      // 2. 주문차수 - 빵  매핑 테이블 수정
      // 2-1. 기존 빵을 조회하고 다시 수정하는 건 효율이 없으므로 특정 주문차수에 포함된 행은 완전삭제하고 다시 새롭게 등록한다.
      await tx.orderRoundBread.deleteMany({ where: { orderRoundNo: no } });

      // body.orderRoundBreads = body.orderRoundBreads.map((bread) => bread);

      // 2-2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
      const orderRoundBreads = await Promise.all(
        body.orderRoundBreads.map(async (bread) => {
          const createdBread = await createOrderRoundBread(tx, {
            no: body.no,
            breadNo: bread.no,
          });

          return createdBread;
        }),
      );

      return { ...orResult, orderRoundBreads, image: [] };
    });

    return result;
  } catch (e) {
    console.log(e);
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
  const { no, name, startedAt, endedAt, minOrderQty, maxOrderQty } = body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 주문차수 수정 :: orderRound
      const orResult = await tx.orderRound.update({
        where: { no },
        data: {
          name,
          startedAt: new Date(startedAt),
          endedAt: new Date(endedAt),
          minOrderQty,
          maxOrderQty,
        },
      });

      // 2. 주문차수 - 빵  매핑 테이블 수정
      // 2-1. 기존 빵을 조회하고 다시 수정하는 건 효율이 없으므로 특정 주문차수에 포함된 행은 완전삭제하고 다시 새롭게 등록한다.
      await tx.orderRoundBread.deleteMany({ where: { orderRoundNo: orResult.no } });

      // body.orderRoundBreads = body.orderRoundBreads.map((bread) => bread);

      // 2-2. 주문차수에 맞는 빵 목록 등록 :: orderRoundBread
      const orderRoundBreads = await Promise.all(
        body.orderRoundBreads.map(async (bread) => {
          const createdBread = await createOrderRoundBread(tx, {
            no: body.no,
            breadNo: bread.no,
          });

          return createdBread;
        }),
      );

      const imageTargetType = await getImageTargetTypeCode(IMAGE_TARGET_TYPE_NAME); // return code

      // 3. 이미지 수정
      // 기존 이미지의 마지막 순서 조회하여 클라우디너리 이미지 업로드
      let findImg;
      if (imageTargetType) {
        findImg = await tx.image.findFirst({
          where: { imageTargetNo: no, imageTargetType },
          orderBy: { order: 'asc' },
          select: {
            order: true,
            publicId: true,
            url: true,
          },
        });
      }

      // 클라우디너리에 재업로드
      const lastOrder = findImg?.order || 0;
      const uploadResult = await ImageService.updateCloudinary(lastOrder, image); // update image cloud
      let createImg = null;

      /* cloud image 삭제 */
      if (findImg) {
        await tx.image.deleteMany({
          where: { publicId: findImg.publicId },
        });
      }

      /* cloud image 등록 */
      if (uploadResult[0] && imageTargetType) {
        createImg = await tx.image.create({
          data: {
            publicId: uploadResult[0].public_id,
            url: uploadResult[0].secure_url,
            imageTargetNo: no,
            imageTargetType,
            order: 1,
          },
        });
      }

      return { ...orResult, orderRoundBreads, image: createImg };
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
    const or = await tx.orderRound.findFirst({
      select: {
        no: true,
        name: true,
        startedAt: true,
        endedAt: true,
        minOrderQty: true,
        maxOrderQty: true,
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
      orderBy: { no: 'desc' },
    });

    const imageTargetType = await getImageTargetTypeCode(IMAGE_TARGET_TYPE_NAME);
    let image;

    if (or && imageTargetType) {
      image = await tx.image.findFirst({
        where: {
          imageTargetType,
          imageTargetNo: or.no,
          order: 1,
        },
        select: {
          publicId: true,
          url: true,
          order: true,
        },
      });

      const orderRoundBreads = or.orderRoundBreads.map(({ bread }) => bread);
      return { ...or, orderRoundBreads, image };
    }
  });

  return result;
};

/**
 * 현재일자에 진행중인 주문차수 조회
 */
export const getNow = async () => {
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const data = await tx.orderRound.findFirst({
      where: {
        startedAt: { lte: now },
        endedAt: { gte: now },
      },
      select: {
        no: true,
        name: true,
        startedAt: true,
        endedAt: true,
        minOrderQty: true,
        maxOrderQty: true,
        orderRoundBreads: {
          select: {
            orderRoundNo: true,
            breadNo: true,
          },
        },
      },
    });

    return data;
  });

  return result;
};

/**
 * 현재 시작일자가 포함된 주문차수 조회
 */
export const selectStartedAtOrderRound = async (startedAt: Date) => {
  const result = await prisma.$transaction(async (tx) => {
    const data = await tx.orderRound.findFirst({
      where: {
        startedAt: { lte: startedAt },
        endedAt: { gte: startedAt },
      },
      select: {
        no: true,
        name: true,
        startedAt: true,
        endedAt: true,
        minOrderQty: true,
        maxOrderQty: true,
        orderRoundBreads: {
          select: {
            orderRoundNo: true,
            breadNo: true,
          },
        },
      },
    });

    return data;
  });

  return result;
};

/**
 * 현재 시작일자가 포함된 주문차수 조회
 */
export const selectStartedAtOrderRoundUpdate = async (no: number, startedAt: Date) => {
  const result = await prisma.$transaction(async (tx) => {
    const data = await tx.orderRound.findFirst({
      where: {
        startedAt: { lte: startedAt },
        endedAt: { gte: startedAt },
      },
      select: {
        no: true,
        name: true,
        startedAt: true,
        endedAt: true,
        minOrderQty: true,
        maxOrderQty: true,
        orderRoundBreads: {
          select: {
            orderRoundNo: true,
            breadNo: true,
          },
        },
      },
    });

    if (data && data.no !== no) return data;
  });

  return result;
};

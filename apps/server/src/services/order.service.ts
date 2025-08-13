import { prisma } from '@/lib/prisma';
import { OrderItem, Order, Payment } from '@prisma/client';
import { hashPassword } from './auth.service';
import { AppError } from '@/types';
import { generateOrderNumber } from '@/lib/util';
import { commonCodeMap } from './common-code.service';

const ORDER_STATUS_CODE = '10'; // 접수요청

type CreateOrderRequestBody = Pick<
  Order,
  | 'ordererName'
  | 'ordererMobile'
  | 'recipientName'
  | 'recipientMobile'
  | 'address'
  | 'addressDetail'
  | 'zipcode'
  | 'message'
  | 'orderRoundNo'
  | 'totalPrice'
  | 'trackingNumber'
  | 'isPaymentRefundTermsAgreed'
  | 'orderPw'
  | 'isServiceTermsAgreed'
  | 'isPrivacyTermsAgreed'
> & { deliveryMethodNo: number } & { orderItems: Pick<OrderItem, 'breadNo' | 'quantity'>[] } & Pick<
    Payment,
    'bankCode' | 'accountNumber' | 'accountHolderName'
  > & { customerCouponNo?: number };

type UpdateOrderRequestBody = Partial<Pick<Order, 'orderStatus' | 'trackingNumber'>>;

/** 주문 생성 (비회원, 회원) */
export const create = async (no: number | undefined, body: CreateOrderRequestBody) => {
  const {
    ordererName,
    ordererMobile,
    recipientName,
    recipientMobile,
    address,
    addressDetail,
    zipcode,
    message,
    orderRoundNo,
    totalPrice,
    isPaymentRefundTermsAgreed,
    orderPw,
    isServiceTermsAgreed,
    isPrivacyTermsAgreed,
    deliveryMethodNo,
    orderItems,
    bankCode,
    accountNumber,
    accountHolderName,
    customerCouponNo,
  } = body;

  await prisma.$transaction(async (tx) => {
    // 배송 방법 조회
    const deliveryMethod = await tx.deliveryMethod.findUnique({
      where: { no: deliveryMethodNo },
    });

    if (!deliveryMethod) {
      throw AppError.badRequest('배송 방법을 찾을 수 없습니다.');
    }

    let discountAmount = 0;
    let couponNo = null;
    // 쿠폰 조회
    if (no && customerCouponNo) {
      const customerCoupon = await tx.customerCoupon.findUnique({
        where: { no: customerCouponNo },
        select: {
          isUsed: true,
          isExpired: true,
          expiredAt: true,
          customerNo: true,
          coupon: {
            select: {
              amount: true,
              no: true,
            },
          },
        },
      });

      if (!customerCoupon) {
        throw AppError.badRequest('쿠폰을 찾을 수 없습니다.');
      }

      if (customerCoupon.isUsed) {
        throw AppError.badRequest('이미 사용된 쿠폰입니다.');
      }

      if (customerCoupon.isExpired || customerCoupon.expiredAt < new Date()) {
        throw AppError.badRequest('만료된 쿠폰입니다.');
      }

      if (customerCoupon.customerNo !== no) {
        throw AppError.badRequest('쿠폰 소유자가 일치하지 않습니다.');
      }

      await tx.customerCoupon.update({
        where: { no: customerCouponNo },
        data: { isUsed: true },
      });

      couponNo = customerCoupon.coupon.no;
      discountAmount = customerCoupon.coupon.amount || 0;
    }

    // 빵 번호 리스트 생성
    const breadNoList = orderItems.map((item) => item.breadNo).filter((no) => no !== null);

    // 빵 조회
    const breads = await tx.bread.findMany({
      where: {
        no: { in: breadNoList },
      },
      select: { no: true, unitPrice: true, name: true, countryOfOrigin: true, allergyInfo: true },
    });

    // 빵 이미지 조회
    const images = await tx.image.findMany({
      where: {
        imageTargetType: 'breads',
        imageTargetNo: { in: breadNoList },
        order: 1,
      },
      select: { imageTargetNo: true, url: true },
    });

    // 빵이미지 매핑
    const imageMap = Object.fromEntries(images.map((img) => [img.imageTargetNo, img.url]));
    // {빵번호: 빵정보} 매핑
    const breadMap = Object.fromEntries(
      breads.map((b) => [b.no, { ...b, url: imageMap[b.no] || '' }]),
    );

    // 1. 주문 아이템 생성
    await tx.orderItem.createMany({
      data: orderItems.map((item) => {
        const bread = breadMap[item.breadNo!];

        if (!bread) {
          throw AppError.badRequest('빵을 찾을 수 없습니다.');
        }

        return {
          quantity: item.quantity,
          unitPrice: bread.unitPrice,
          totalPrice: bread.unitPrice * item.quantity,
          breadName: bread.name,
          countryOfOrigin: bread.countryOfOrigin,
          allergyInfo: bread.allergyInfo,
          breadNo: item.breadNo,
          orderNo: newOrder.no,
          breadImageUrl: bread.url,
        };
      }),
    });

    // 계산 검증
    const originPrice = orderItems.reduce(
      (acc, item) => acc + (breadMap[item.breadNo!]!.unitPrice || 0 * item.quantity),
      0,
    );

    const deliveryMethodFee = deliveryMethod.fee;

    const calculatedTotalPrice = originPrice - discountAmount + deliveryMethodFee;

    if (calculatedTotalPrice !== totalPrice) {
      throw AppError.badRequest('주문 금액이 일치하지 않습니다.', {
        calculatedTotalPrice,
        yourTotalPrice: totalPrice,
        originPrice,
        discountAmount,
        deliveryMethodFee,
      });
    }

    // 2. 주문 생성
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        orderStatus: ORDER_STATUS_CODE,
        trackingNumber: '',
        ordererName,
        ordererMobile,
        recipientName,
        recipientMobile,
        address,
        addressDetail,
        zipcode,
        message,
        deliveryMethodName: deliveryMethod.name,
        deliveryMethodFee: deliveryMethod.fee,
        discountAmount: 0,
        isPaymentRefundTermsAgreed,
        orderRoundNo,
        totalPrice,
        memo: '',
        // customer의 정보와 주문인&주문인전화번호가 다른경우도 검증해야할까?
        // = customer가 주문인과 일치해야하는가?
        customer: no ? { connect: { no } } : {},
        coupon: couponNo ? { connect: { no: couponNo } } : {},
        ...(!no
          ? {
              // 비회원 입력 항목
              orderPw: await hashPassword(orderPw || ''), // 비밀번호 암호화
              isPrivacyTermsAgreed,
              isServiceTermsAgreed,
            }
          : {
              orderPw: '',
              isPrivacyTermsAgreed: false,
              isServiceTermsAgreed: false,
            }),
      },
    });

    // 3. 결제 생성
    await tx.payment.create({
      data: {
        orderNo: newOrder.no,
        orderedAt: newOrder.createdAt,
        bankCode,
        accountNumber,
        accountHolderName,
      },
    });
  });
};

/** 주문 목록 조회 */
export const getList = async () => {
  const list = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      payment: { select: { isPaid: true } },
    },
  });
  return {
    list: list.map((item) => ({
      ...item,
      orderStatusName: getOrderStatusName(item?.orderStatus || ''),
    })),
  };
};

/** 주문 상세 조회 */
export const getByNo = async (no: number) => {
  const one = await prisma.order.findUnique({
    where: { no },
    include: {
      payment: { select: { bankCode: true, accountNumber: true, accountHolderName: true } },
      orderItems: {
        select: {
          breadNo: true,
          quantity: true,
          unitPrice: true,
          totalPrice: true,
          breadName: true,
          //   breadImageUrl: true,
        },
      },
    },
  });
  return {
    ...one,
    orderStatusName: getOrderStatusName(one?.orderStatus || ''),
    payment: {
      ...one?.payment,
      bankCodeName: getBankCodeName(one?.payment?.bankCode || ''),
    },
  };
};

/** 주문 수정  */
export const update = async (no: number, body: UpdateOrderRequestBody) => {
  await prisma.order.update({
    where: { no },
    data: body,
  });
};

/** 뱅크코드 이름 조회 */
export function getBankCodeName(code: string): string {
  return commonCodeMap.bankCodeMap.get(code) || '-';
}

/** 주문 이름 조회 */
export function getOrderStatusName(code: string): string {
  return commonCodeMap.orderStatusMap.get(code) || '-';
}

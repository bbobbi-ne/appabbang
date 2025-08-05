import { prisma } from '@/lib/prisma';
import { Address, Customer, OrderItem, Order, Payment } from '@prisma/client';
import { hashPassword } from './auth.service';
import { AppError } from '@/types';
import { commonCodeMap } from './common-code.service';

const ORDER_STATUS_CODE = '10'; // 접수됨
const DISCOUNT_TYPE_CODE_PERIOD = '10'; // 기간할인
const DISCOUNT_TYPE_CODE_CUSTOMER = '20'; // 고객할인

/** 비회원 주문 생성 */
export const createNonMemberOrder = async (
  body: Pick<Customer, 'name' | 'mobileNumber'> &
    Pick<
      Address,
      'address' | 'addressDetail' | 'zipcode' | 'message' | 'recipientName' | 'recipientMobile'
    > & {
      orderItems: Pick<OrderItem, 'breadNo' | 'quantity'>[];
    } & Pick<
      Order,
      'deliveryMethodNo' | 'discountNo' | 'orderPw' | 'totalPrice' | 'discountAmount'
    > &
    Pick<Payment, 'bankCode' | 'accountNumber' | 'accountHolderName'>,
) => {
  const {
    name,
    mobileNumber,
    address,
    addressDetail,
    zipcode,
    message,
    recipientName,
    recipientMobile,
    orderItems,
    deliveryMethodNo,
    orderPw,
    totalPrice,
    discountNo,
    discountAmount,
    bankCode,
    accountNumber,
    accountHolderName,
  } = body;

  if (discountAmount && !discountNo) {
    throw AppError.badRequest('할인 금액에 해당하는 할인 코드가 없습니다.');
  }

  const result = await prisma.$transaction(async (tx) => {
    const newCustomer = await tx.customer.create({
      data: {
        name,
        mobileNumber,
      },
    });

    const newAddress = await tx.address.create({
      data: {
        customerNo: newCustomer.no,
        address,
        addressDetail,
        zipcode,
        message,
        recipientName,
        recipientMobile,
      },
    });

    // 고객의 기본배송지 업데이트
    await tx.customer.update({
      where: { no: newCustomer.no },
      data: {
        defaultAddressNo: newAddress.no,
      },
    });

    // 비밀번호 검증
    // const isOrderPwValid = await comparePassword(orderPw!, hashedOrderPw);
    // if (!isOrderPwValid) {
    //   throw AppError.badRequest('비밀번호가 일치하지 않습니다.');
    // }

    const hashedOrderPw = await hashPassword(orderPw!);

    const newOrder = await tx.order.create({
      data: {
        customerNo: newCustomer.no,
        addressNo: newAddress.no,
        deliveryMethodNo: deliveryMethodNo,
        orderNumber: generateOrderNumber(),
        orderStatus: ORDER_STATUS_CODE,
        totalPrice, // 계산 검증 필요
        discountAmount: discountAmount ?? 0,
        orderPw: hashedOrderPw,
        memo: '',
        trackingNumber: '',
        canceledAt: null,
        payment: {
          create: {
            isPaid: false,
            orderedAt: new Date(),
            isRefunded: false,
            bankCode,
            accountNumber,
            accountHolderName,
            customerNo: newCustomer.no,
          },
        },
      },
    });

    const breadNos = orderItems.map((item) => item.breadNo);
    const breads = await tx.bread.findMany({
      where: { no: { in: breadNos } },
      select: { no: true, unitPrice: true },
    });
    const breadPriceMap = new Map(breads.map((bread) => [bread.no, bread.unitPrice]));

    await tx.orderItem.createMany({
      data: orderItems.map((item) => ({
        breadNo: item.breadNo,
        quantity: item.quantity,
        unitPrice: breadPriceMap.get(item.breadNo) ?? 0,
        totalPrice: (breadPriceMap.get(item.breadNo) ?? 0) * item.quantity,
        orderNo: newOrder.no,
      })),
    });

    /////////////////////////계산 검증/////////////////////////
    // 원가
    const originalTotalPrice = orderItems.reduce(
      (acc, item) => acc + (breadPriceMap.get(item.breadNo) ?? 0) * item.quantity,
      0,
    );

    let calculatedDiscountAmount = 0;
    // 할인 (기간할인)
    if (discountNo && discountAmount) {
      const discount = await tx.discount.findFirst({
        where: {
          discountType: DISCOUNT_TYPE_CODE_PERIOD,
          fromDt: { lte: new Date() },
          toDt: { gte: new Date() },
          no: discountNo,
        },
        orderBy: {
          amount: 'desc',
        },
        select: {
          no: true,
          amount: true,
        },
      });

      if (!discount) {
        throw AppError.badRequest('해당하는 할인 코드가 없습니다.');
      }

      if (discountAmount !== discount.amount) {
        throw AppError.badRequest('할인 금액이 일치하지 않습니다.', {
          calculatedDiscountAmount: discount?.amount,
          discountAmount,
        });
      } else {
        tx.order.update({
          where: { no: newOrder.no },
          data: {
            discountNo: discount.no,
          },
        });

        calculatedDiscountAmount = discount.amount ?? 0;
      }
    }

    // 배송비
    const deliveryMethod = await tx.deliveryMethod.findUnique({
      where: {
        no: deliveryMethodNo,
      },
    });

    if (totalPrice !== originalTotalPrice - calculatedDiscountAmount + (deliveryMethod?.fee ?? 0)) {
      throw AppError.badRequest('주문 금액이 일치하지 않습니다.', {
        calculatedTotalPrice:
          originalTotalPrice - calculatedDiscountAmount + (deliveryMethod?.fee ?? 0),
        yourTotalPrice: totalPrice,
        breadsPrice: originalTotalPrice,
        discountAmount: calculatedDiscountAmount,
        deliveryFee: deliveryMethod?.fee ?? 0,
      });
    }

    return {
      orderNumber: newOrder.orderNumber,
      name,
      mobileNumber,
      address,
      addressDetail,
      zipcode,
      message,
      recipientName,
      recipientMobile,
      orderItems,
      deliveryMethodNo,
      totalPrice,
      discountAmount: calculatedDiscountAmount,
    };
  });

  return result;
};

/** 회원 주문 생성 */
export const createMemberOrder = async (
  body: {
    orderItems: Pick<OrderItem, 'breadNo' | 'quantity'>[];
  } & Pick<
    Order,
    'customerNo' | 'addressNo' | 'deliveryMethodNo' | 'discountNo' | 'totalPrice' | 'discountAmount'
  > &
    Pick<Payment, 'bankCode' | 'accountNumber' | 'accountHolderName'>,
) => {
  const {
    customerNo,
    addressNo,
    deliveryMethodNo,
    discountNo,
    totalPrice,
    orderItems,
    discountAmount,
    bankCode,
    accountNumber,
    accountHolderName,
  } = body;

  const result = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        customerNo,
        addressNo,
        deliveryMethodNo,
        orderNumber: generateOrderNumber(),
        orderStatus: ORDER_STATUS_CODE,
        totalPrice, // 계산 검증 필요
        discountAmount: discountAmount ?? 0,
        memo: '',
        trackingNumber: '',
        canceledAt: null,
        payment: {
          create: {
            isPaid: false,
            orderedAt: new Date(),
            isRefunded: false,
            bankCode,
            accountNumber,
            accountHolderName,
            customerNo,
          },
        },
      },
    });

    const breadNos = orderItems.map((item) => item.breadNo);
    const breads = await tx.bread.findMany({
      where: { no: { in: breadNos } },
      select: { no: true, unitPrice: true },
    });
    const breadPriceMap = new Map(breads.map((bread) => [bread.no, bread.unitPrice]));

    await tx.orderItem.createMany({
      data: orderItems.map((item) => ({
        breadNo: item.breadNo,
        quantity: item.quantity,
        unitPrice: breadPriceMap.get(item.breadNo) ?? 0,
        totalPrice: (breadPriceMap.get(item.breadNo) ?? 0) * item.quantity,
        orderNo: newOrder.no,
      })),
    });

    /////////////////////////계산 검증/////////////////////////
    // 원가
    const originalTotalPrice = orderItems.reduce(
      (acc, item) => acc + (breadPriceMap.get(item.breadNo) ?? 0) * item.quantity,
      0,
    );

    // 할인 금액
    let calculatedDiscountAmount = 0;

    if (discountNo) {
      const discount = await tx.discount.findUnique({
        where: {
          no: discountNo,
          fromDt: { lte: new Date() },
          toDt: { gte: new Date() },
        },
        select: {
          discountType: true,
          amount: true,
        },
      });

      if (!discount) {
        throw AppError.badRequest('할인 코드가 일치하지 않습니다.');
      }

      // 고객 할인 검증 후 isUsed 업데이트 및 할인 금액 적용
      if (discount?.discountType === DISCOUNT_TYPE_CODE_CUSTOMER) {
        const discountCustomer = await tx.discountCustomer.findFirst({
          where: {
            customerNo,
            discountNo,
            isUsed: false,
          },
        });

        if (!discountCustomer) {
          throw AppError.badRequest('고객 할인 코드가 일치하지 않습니다.');
        }

        await tx.discountCustomer.update({
          where: {
            customerNo_discountNo: {
              customerNo,
              discountNo,
            },
          },
          data: {
            isUsed: true,
          },
        });

        calculatedDiscountAmount = discount.amount ?? 0;
      } else if (discount?.discountType === DISCOUNT_TYPE_CODE_PERIOD) {
        calculatedDiscountAmount = discount.amount ?? 0;
      }

      if (discountAmount !== calculatedDiscountAmount) {
        throw AppError.badRequest('할인 금액이 일치하지 않습니다.', {
          calculatedDiscountAmount,
          discountAmount,
        });
      }
    }

    // 배송비
    const deliveryMethod = await tx.deliveryMethod.findUnique({
      where: {
        no: deliveryMethodNo,
      },
    });

    if (totalPrice !== originalTotalPrice - calculatedDiscountAmount + (deliveryMethod?.fee ?? 0)) {
      throw AppError.badRequest('주문 금액이 일치하지 않습니다.', {
        calculatedTotalPrice:
          originalTotalPrice - calculatedDiscountAmount + (deliveryMethod?.fee ?? 0),
        yourTotalPrice: totalPrice,
        breadsPrice: originalTotalPrice,
        discountAmount: calculatedDiscountAmount,
        deliveryFee: deliveryMethod?.fee ?? 0,
      });
    }

    return newOrder;
  });

  return result;
};

/** 주문번호 생성 */
export const generateOrderNumber = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ''); // 20240622
  const time = now.getTime().toString().slice(-5); // 뒤 5자리 시간 밀리초
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD-${date}-${time}${random}`;
};

/** 주문조회 */
export const getOrderList = async () => {
  const orders = await prisma.order.findMany({
    orderBy: { no: 'desc' },
    select: {
      no: true,
      orderNumber: true,
      orderStatus: true,
      totalPrice: true,
      trackingNumber: true,
      canceledAt: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          no: true,
          name: true,
          mobileNumber: true,
        },
      },
      address: {
        select: {
          no: true,
          address: true,
          addressDetail: true,
          zipcode: true,
          message: true,
          recipientName: true,
          recipientMobile: true,
        },
      },
      deliveryMethod: {
        select: {
          no: true,
          name: true,
        },
      },
      payment: {
        select: {
          isPaid: true,
          isRefunded: true,
        },
      },
    },
  });

  const result = orders.map((order) => ({
    ...order,
    orderStatusName: getOrderStatusName(order.orderStatus),
  }));

  return result;
};

/** 뱅크코드 이름 조회 */
export function getBankCodeName(code: string): string {
  return commonCodeMap.bankCodeMap.get(code) || '-';
}

/** 주문 상세 조회 */
export const getOrderByNo = async (no: number) => {
  const order = await prisma.order.findUnique({
    where: { no },
    select: {
      no: true,
      orderNumber: true,
      orderStatus: true,
      totalPrice: true,
      discountAmount: true,
      trackingNumber: true,
      canceledAt: true,
      createdAt: true,
      updatedAt: true,
      orderItem: {
        select: {
          breadNo: true,
          quantity: true,
          unitPrice: true,
          totalPrice: true,
          bread: {
            select: {
              no: true,
              name: true,
            },
          },
        },
      },
      customer: {
        select: {
          no: true,
          name: true,
          mobileNumber: true,
        },
      },
      address: {
        select: {
          no: true,
          address: true,
          addressDetail: true,
          zipcode: true,
          message: true,
          recipientName: true,
          recipientMobile: true,
        },
      },
      deliveryMethod: {
        select: {
          no: true,
          name: true,
          fee: true,
        },
      },
      payment: {
        select: {
          isPaid: true,
          isRefunded: true,
          accountHolderName: true,
          accountNumber: true,
          bankCode: true,
        },
      },
    },
  });

  const bankCodeName = getBankCodeName(order?.payment?.bankCode || '-');

  const result = {
    ...order,
    payment: {
      ...order?.payment,
      bankCodeName,
    },
  };

  return result;
};

/** 주문 이름 조회 */
export function getOrderStatusName(code: string): string {
  return commonCodeMap.orderStatusMap.get(code) || '-';
}

/** 주문 수정  */
export const updateOrder = async (
  no: number,
  body: {
    orderStatus: string;
    trackingNumber: string;
    address: string;
    addressDetail: string;
    zipcode: string;
    message: string;
  },
) => {
  const updated = await prisma.order.update({
    where: { no },
    data: {
      orderStatus: body.orderStatus,
      trackingNumber: body.trackingNumber,
      address: {
        update: {
          address: body.address,
          addressDetail: body.addressDetail,
          zipcode: body.zipcode,
          message: body.message,
        },
      },
    },
  });

  return updated;
};

/** 주문 상태 수정 */
export const updateOrderStatus = async (no: number, orderStatus: string) => {
  const updated = await prisma.order.update({
    where: { no },
    data: {
      orderStatus,
      ...(orderStatus === '50' && {
        payment: {
          update: {
            isRefunded: false,
          },
        },
      }),
    },
  });

  return updated;
};

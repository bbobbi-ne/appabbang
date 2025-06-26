import { prisma } from '@/lib/prisma';
import { Address, Customer, OrderItem, Order } from '@prisma/client';
import { hashPassword } from './auth.service';

const ORDER_STATUS_CODE = '10'; // 접수됨
const DISCOUNT_TYPE_CODE = '10'; // 기간할인

/* 비회원 주문 생성 */
export const createNonMemberOrder = async (
  body: Pick<Customer, 'name' | 'mobileNumber'> &
    Pick<
      Address,
      'address' | 'addressDetail' | 'zipcode' | 'message' | 'recipientName' | 'recipientMobile'
    > & {
      orderItems: Pick<OrderItem, 'breadNo' | 'quantity'>[];
    } & Pick<Order, 'deliveryMethodNo' | 'orderPw' | 'totalPrice'>,
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
  } = body;

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

    const hashedOrderPw = await hashPassword(orderPw);
    const newOrder = await tx.order.create({
      data: {
        customerNo: newCustomer.no,
        addressNo: newAddress.no,
        deliveryMethodNo: deliveryMethodNo,
        orderNumber: generateOrderNumber(),
        orderStatus: ORDER_STATUS_CODE,
        totalPrice, // 계산 검증 필요
        orderPw: hashedOrderPw,
        paid: false,
        memo: '',
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

    // 할인 (기간할인)
    const discount = await tx.discount.findFirst({
      where: {
        discountType: DISCOUNT_TYPE_CODE,
        fromDt: { lte: new Date() },
        toDt: { gte: new Date() },
      },
      orderBy: {
        amount: 'desc',
      },
    });

    // 배송비
    const deliveryMethod = await tx.deliveryMethod.findUnique({
      where: {
        no: deliveryMethodNo,
      },
    });

    if (totalPrice !== originalTotalPrice - (discount?.amount ?? 0) + (deliveryMethod?.fee ?? 0)) {
      throw new Error('주문 금액이 일치하지 않습니다.');
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
      orderPw,
      totalPrice,
    };
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

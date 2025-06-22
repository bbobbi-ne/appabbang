import { prisma } from '@/lib/prisma';
import { Address, Customers, OrderItems, Orders } from '@prisma/client';
import { hashPassword } from './auth.service';

export const createNonMemberOrder = async ({
  customer,
  address,
  orderItems,
  order,
}: {
  customer: Customers;
  address: Address;
  orderItems: OrderItems[];
  order: Orders;
}) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const newCustomer = await tx.customers.create({
        data: customer,
      });

      const newAddress = await tx.address.create({
        data: address,
      });

      const hashedOrderPw = await hashPassword(order.orderPw);
      const deliveryMethodNo = order.deliveryMethodNo;

      const newOrder = await tx.orders.create({
        data: {
          customerNo: newCustomer.no,
          addressNo: newAddress.no,
          deliveryMethodNo: deliveryMethodNo,
          ordersNumber: generateOrderNumber(),
          orderStatus: '10', // 서버에서 입력함.
          totalPrice: 0, // 서버에서 입력함. (계산 필요)
          orderPw: hashedOrderPw,
          paid: false,
        },
      });

      const newOrderItems = await tx.orderItems.createMany({
        data: orderItems.map((item) => ({
          ...item,
          orderNo: newOrder.no,
        })),
      });
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateOrderNumber = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ''); // 20240622
  const time = now.getTime().toString().slice(-5); // 뒤 5자리 시간 밀리초
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD-${date}-${time}${random}`;
};

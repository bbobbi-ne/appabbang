import type { OrdersDetailData } from '@/api/data-contracts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@appabbang/ui';

type OrderItem = OrdersDetailData['orderItem'][number];

function OrderTable({ orderItem, deliveryFee }: { orderItem: OrderItem[]; deliveryFee: number }) {
  console.log(orderItem);
  const totalPrice = orderItem.reduce((acc, item) => {
    return acc + item.totalPrice;
  }, 0);

  return (
    <>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>메뉴</TableHead>
            <TableHead>수량</TableHead>
            <TableHead>단가</TableHead>
            <TableHead>총금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderItem.map((item) => (
            <TableRow>
              <TableCell>{item.bread.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unitPrice}</TableCell>
              <TableCell>{item.totalPrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="text-right">
        <p>
          금액 : <strong>{totalPrice}</strong>원
        </p>
        <p className="text-red-500">배송비 + {deliveryFee}원</p>
        <p className="text-sky-500">할인금액 -6,500원</p>
        <p className="text-2xl font-bold">총 금액 : {totalPrice}</p>
      </div>
    </>
  );
}

export default OrderTable;

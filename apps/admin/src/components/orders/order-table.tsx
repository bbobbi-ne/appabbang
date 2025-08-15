import type { OrdersDetailData } from '@/api/data-contracts';
import { formatCurrencyKR } from '@/utils/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@appabbang/ui';

type OrderItem = OrdersDetailData['orderItems'][number];

function OrderTable({ orderItem, deliveryFee }: { orderItem: OrderItem[]; deliveryFee: number }) {
  const totalPrice = orderItem.reduce((acc, item) => {
    return acc + item.totalPrice;
  }, 0);

  return (
    <>
      <div
        data-slot="table-container"
        className="relative border  rounded-md w-full overflow-x-auto"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">메뉴</TableHead>
              <TableHead className="w-[15%]">수량</TableHead>
              <TableHead className="w-[15%]">단가</TableHead>
              <TableHead className="w-[15%]">총금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItem.map((item) => (
              <TableRow key={item.breadNo}>
                <TableCell className="line-clamp-2 pb-0 whitespace-normal break-words">
                  {item.breadName}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrencyKR(item.unitPrice)}</TableCell>
                <TableCell>{formatCurrencyKR(item.totalPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-right">
        <div className="flex">
          <label className="flex-3/4">금액 :</label>
          <p className="flex-1/4">{totalPrice}원</p>
        </div>
        <div className="flex">
          <label className="flex-3/4">배송비(+) :</label>
          <p className="flex-1/4">{deliveryFee}원</p>
        </div>
        <div className="flex">
          <label className="flex-3/4">할인금액(-) :</label>
          <p className="flex-1/4">(할인지정 필요)원</p>
        </div>
        <div className="flex text-red-500">
          <label className="flex-3/4">총 금액 :</label>
          <p className="flex-1/4">{totalPrice}원</p>
        </div>
      </div>
    </>
  );
}

export default OrderTable;

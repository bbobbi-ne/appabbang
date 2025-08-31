import type { OrdersDetailData } from '@/api/data-contracts';
import { formatCurrencyKR } from '@appabbang/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@appabbang/ui';

function OrderTable({ orderData }: { orderData: OrdersDetailData }) {
  const itemsTotalPrice = orderData.orderItems.reduce((acc, item) => {
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
            {orderData.orderItems.map((item) => (
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
          <label className="flex-3/4">주문금액 :</label>
          <p className="flex-1/4">{itemsTotalPrice + orderData.deliveryMethodFee}원</p>
        </div>
        <div className="flex">
          <label className="flex-3/4">상품금액(+) :</label>
          <p className="flex-1/4">{itemsTotalPrice}원</p>
        </div>
        <div className="flex">
          <label className="flex-3/4">배송비(+) :</label>
          <p className="flex-1/4">{orderData.deliveryMethodFee}원</p>
        </div>
        <div className="flex">
          <label className="flex-3/4">할인금액(-) :</label>
          <p className="flex-1/4">{orderData.discountAmount}원</p>
        </div>
        <div className="flex text-red-500">
          <label className="flex-3/4">결제금액 :</label>
          <p className="flex-1/4">{orderData.totalPrice}원</p>
        </div>
      </div>
    </>
  );
}

export default OrderTable;

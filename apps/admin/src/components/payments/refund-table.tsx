import type { OrdersDetailData, PaymentsDetailData } from '@/api/data-contracts';
import { formatIsoToDateTime, formatCurrencyKR } from '@/utils/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@appabbang/ui';

function RefundTable({
  ordersDetail,
  paymentDetail,
}: {
  ordersDetail: OrdersDetailData;
  paymentDetail: PaymentsDetailData;
}) {
  const totalPrice =
    ordersDetail.orderItems.reduce((acc, item) => {
      return acc + item.totalPrice;
    }, 0) + ordersDetail.deliveryMethodFee;
  return (
    <div className="space-y-6">
      <div
        data-slot="table-container"
        className="relative border rounded-md w-full overflow-x-auto"
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
            {ordersDetail.orderItems.map((item) => (
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

      {paymentDetail.isPaid && (
        <div className="text-right space-y-1">
          <div className="flex">
            <label className="flex-3/5">주문일자 :</label>
            <p className="flex-2/5">{formatIsoToDateTime(paymentDetail.createdAt)}</p>
          </div>
          <div className="flex">
            <label className="flex-3/5">주문자 :</label>
            <p className="flex-2/5">{ordersDetail.ordererName}</p>
          </div>
          <div className="flex">
            <label className="flex-3/5">환불계좌 :</label>
            <p className="flex-2/5">{paymentDetail.accountNumber}</p>
          </div>
          <div className="flex">
            <label className="flex-3/5">결제수단 :</label>
            <p className="flex-2/5">{paymentDetail.bankCodeName}</p>
          </div>
          <div className="flex">
            <label className="flex-3/5">주문금액 :</label>
            <p className="flex-2/5">{formatCurrencyKR(totalPrice)}원</p>
          </div>
          <div className="flex">
            <label className="flex-3/5">배송비(-) :</label>
            <p className="flex-2/5">{formatCurrencyKR(ordersDetail.deliveryMethodFee)}원</p>
          </div>
          <div className="flex">
            <label className="flex-3/5">할인금액(-) :</label>
            <p className="flex-2/5">(할인지정 필요)원</p>
          </div>
          <div className="flex text-red-500 font-semibold">
            <label className="flex-3/5">환불 예정 금액 :</label>
            <p className="flex-2/5">
              {formatCurrencyKR(totalPrice - ordersDetail.deliveryMethodFee)}원
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RefundTable;

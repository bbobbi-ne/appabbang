import type { PaymentsListData } from '@/api/data-contracts';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@appabbang/ui';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { SortAsc, SortDesc } from 'lucide-react';
import { formatIsoToDateTime, formatCurrencyKR } from '@/utils/format';

import { usePaidUpdateMutation } from '@/hooks/use-payment';
import { RefundDialog } from '@/components/payments/refund-dialog';
import { useGetOrderStatusQuery } from '@/hooks/use-common-code';

export type PaymentsListItem = PaymentsListData[number];

export const paymentsColumns = () => {
  const columnHelper = createColumnHelper<PaymentsListItem>();
  const { paidUpdateMutation } = usePaidUpdateMutation();
  const { data: orderStatus } = useGetOrderStatusQuery();
  const columns: ColumnDef<PaymentsListItem, any>[] = [
    columnHelper.display({
      id: 'cell-no',
      maxSize: 1,
      header: ({ column }) => {
        const isSorted = column.getIsSorted() === 'asc';
        return (
          <Button
            className={`p-0 ${isSorted ? 'text-blue-500' : ''} hover:text-primary gap-0`}
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {isSorted ? <SortAsc /> : <SortDesc />} 번호
          </Button>
        );
      },
      cell: (info) => {
        const index = info.table.getPrePaginationRowModel().rows.length - info.row.index;
        return <p className="text-center">{index}</p>;
      },
    }),
    columnHelper.accessor('order.orderNumber', {
      maxSize: 2,
      header: ({ column }) => <p>주문번호</p>,
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('order.orderStatusName', {
      maxSize: 1,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문상태
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('isPaid', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          결제완료여부
        </Button>
      ),
      cell: (info) => {
        const value = info.getValue() ? '완료' : '미완료';
        const no = info.row.original.no;
        const disabledCodes = orderStatus?.filter((item) =>
          ['접수요청', '취소요청'].includes(item.name),
        );

        const rowOrderStatus = disabledCodes?.find(
          (item) => item.code === info.row.original.order.orderStatus,
        );

        return (
          <Select
            disabled={
              !disabledCodes?.map((item) => item.code).includes(info.row.original.order.orderStatus)
            }
            value={value}
            onValueChange={(selectValue) => {
              const isPaid = selectValue === '완료' ? true : false;
              paidUpdateMutation({
                no,
                data: { isPaid, orderNo: no },
              });
            }}
          >
            <SelectTrigger>
              <SelectValue>{value}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'완료'}>완료</SelectItem>
              <SelectItem value={'미완료'}>미완료</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    }),

    columnHelper.accessor('order.totalPrice', {
      maxSize: 6,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          결제금액
        </Button>
      ),
      cell: (info) => {
        return <p>{formatCurrencyKR(info.getValue())}원</p>;
      },
    }),
    columnHelper.accessor('createdAt', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문일시
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{formatIsoToDateTime(info.getValue())}</p>;
      },
    }),
    columnHelper.accessor('paidConfirmedAt', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          입금확인일시
        </Button>
      ),
      cell: (info) => {
        const value = info.getValue() === null ? '미입금' : formatIsoToDateTime(info.getValue());

        return <p className="text-center">{value}</p>;
      },
    }),
    columnHelper.accessor('bankCodeName', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          은행명
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('accountNumber', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          계좌번호
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('accountHolderName', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          예금주명
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{info.getValue()}</p>;
      },
    }),
    columnHelper.display({
      id: 'refundDetails',
      maxSize: 1,
      header: ({ column }) => {
        return <p>취소/환불정보</p>;
      },
      cell: (info) => {
        const refundCode = ['50', '51', '52'];

        const refund = !!refundCode.includes(info.row.original.order.orderStatus);
        return (
          <>
            {refund ? (
              <RefundDialog no={info.row.original.no} />
            ) : (
              <Button disabled={true}>확인</Button>
            )}
          </>
        );
      },
    }),
  ];

  return columns;
};

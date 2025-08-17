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
import { renderSortButton } from '@/components/ui/rebder-sort-button';

export type PaymentsListItem = PaymentsListData[number];

export const paymentsColumns = () => {
  const columnHelper = createColumnHelper<PaymentsListItem>();
  const { paidUpdateMutation } = usePaidUpdateMutation();
  const { data: orderStatus } = useGetOrderStatusQuery();

  const columns: ColumnDef<PaymentsListItem, any>[] = [
    columnHelper.accessor('no', {
      maxSize: 1,
      header: ({ column }) => renderSortButton(column, '번호'),
      cell: (info) => {
        const index = info.table.getPrePaginationRowModel().rows.length - info.row.index;
        return <p className="text-center">{index}</p>;
      },
    }),
    columnHelper.accessor('order.orderNumber', {
      maxSize: 5,
      header: () => <p>주문번호</p>,
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor('order.orderStatus', {
      maxSize: 1,
      header: ({ column }) => {
        const rawValue = column.getFilterValue();
        const value = typeof rawValue === 'string' ? rawValue : 'all';

        return (
          <Select
            value={value}
            onValueChange={(val) => column.setFilterValue(val === 'all' ? undefined : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="주문상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {orderStatus?.map(({ code, name }) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
      cell: (info) => {
        const code = info.getValue();
        const status = orderStatus?.find((item) => item.code === code)?.name || '';
        return <p className="text-center">{status}</p>;
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === 'all') return true;
        return row.getValue(columnId) === filterValue;
      },
    }),
    columnHelper.accessor('isPaid', {
      maxSize: 1,
      header: ({ column }) => {
        const rawValue = column.getFilterValue();
        const value = typeof rawValue === 'string' ? rawValue : 'all';
        return (
          <Select
            value={value}
            onValueChange={(val) => column.setFilterValue(val === 'all' ? undefined : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="결제완료 여부" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="true">완료</SelectItem>
              <SelectItem value="false">미완료</SelectItem>
            </SelectContent>
          </Select>
        );
      },
      cell: (info) => {
        const value = info.getValue() ? '완료' : '미완료';
        const no = info.row.original.no;
        const disabledCodes = orderStatus?.filter((item) =>
          ['접수요청', '취소요청'].includes(item.name),
        );
        return (
          <Select
            disabled={
              !disabledCodes?.map((item) => item.code).includes(info.row.original.order.orderStatus)
            }
            value={value}
            onValueChange={(selectValue) => {
              const isPaid = selectValue === '완료';
              paidUpdateMutation({ no, data: { isPaid, orderNo: no } });
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
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === undefined) return true;
        const rowValue = row.getValue(columnId);
        return String(rowValue) === filterValue;
      },
    }),
    columnHelper.accessor('order.totalPrice', {
      maxSize: 2,
      header: ({ column }) => renderSortButton(column, '결제금액'),
      cell: (info) => <p>{formatCurrencyKR(info.getValue())}원</p>,
    }),
    columnHelper.accessor('createdAt', {
      maxSize: 3,
      header: ({ column }) => renderSortButton(column, '주문일시'),
      cell: (info) => <p>{formatIsoToDateTime(info.getValue())}</p>,
    }),
    columnHelper.accessor('paidConfirmedAt', {
      maxSize: 3,
      header: ({ column }) => renderSortButton(column, '입금확인일시'),
      cell: (info) => {
        const value = info.getValue() === null ? '미입금' : formatIsoToDateTime(info.getValue());
        return <p>{value}</p>;
      },
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) ? new Date(rowA.getValue(columnId)).getTime() : 0;
        const b = rowB.getValue(columnId) ? new Date(rowB.getValue(columnId)).getTime() : 0;
        return a - b;
      },
    }),
    columnHelper.accessor('bankCodeName', {
      maxSize: 1,
      header: () => (
        <Button className="p-0" variant="ghost">
          은행명
        </Button>
      ),
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor('accountNumber', {
      maxSize: 3,
      header: () => (
        <Button className="p-0" variant="ghost">
          계좌번호
        </Button>
      ),
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor('accountHolderName', {
      maxSize: 1,
      header: () => (
        <Button className="p-0" variant="ghost">
          예금주명
        </Button>
      ),
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.display({
      id: 'refundDetails',
      maxSize: 1,
      header: () => <p>취소/환불정보</p>,
      cell: (info) => {
        const refundCode = ['50', '51', '52'];
        const refund = refundCode.includes(info.row.original.order.orderStatus);
        return refund ? <RefundDialog no={info.row.original.no} /> : <Button disabled>확인</Button>;
      },
    }),
  ];

  return columns;
};

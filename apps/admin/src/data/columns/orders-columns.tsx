import type { OrdersListData } from '@/api/data-contracts';
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
import { formatCurrencyKR, formatDateTime } from '@/utils/format';
import { useOrderStatusUpdateMutation } from '@/hooks/use-order';
import { useGetOrderStatusQuery } from '@/hooks/use-common-code';
import { renderSortButton } from '@/components/ui/rebder-sort-button';

export type OrdersListItem = OrdersListData[number];

export const ordersColumns = () => {
  const columnHelper = createColumnHelper<OrdersListItem>();
  const { data: ordersStatus } = useGetOrderStatusQuery();
  const { orderStatusUpdateMutation } = useOrderStatusUpdateMutation();

  const columns: ColumnDef<OrdersListItem, any>[] = [
    columnHelper.accessor('no', {
      maxSize: 1,
      header: ({ column }) => renderSortButton(column, '번호'),
      cell: (info) => {
        const index = info.table.getPrePaginationRowModel().rows.length - info.row.index;
        return <p className="text-center">{index}</p>;
      },
    }),
    columnHelper.accessor('orderNumber', {
      maxSize: 5,
      header: () => (
        <Button className="p-0" variant="ghost">
          주문번호
        </Button>
      ),
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
    }),
    columnHelper.accessor('ordererName', {
      maxSize: 1,
      header: () => (
        <Button className="p-0" variant="ghost">
          이름
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('ordererMobile', {
      maxSize: 3,
      header: () => (
        <Button className="p-0" variant="ghost">
          전화번호
        </Button>
      ),
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
    }),
    columnHelper.accessor('payment.isPaid', {
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
              <SelectValue placeholder="입금확인" />
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
        const isPaid = info.getValue<boolean>();
        return (
          <p className={`${isPaid ? '' : 'text-red-500'} font-semibold`}>
            {isPaid ? '완료' : '미완료'}
          </p>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === undefined) return true; // 전체
        const isPaid = row.getValue<boolean>(columnId);
        if (filterValue === 'true') return !!isPaid;
        if (filterValue === 'false') return isPaid === false;
        return true;
      },
    }),
    columnHelper.accessor('orderStatus', {
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {ordersStatus?.map(({ name, code }) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
      cell: (info) => {
        const value = info.getValue();
        const found = ordersStatus?.find((item) => item.code === value);
        const no = info.row.original.no;
        return (
          <Select
            value={value}
            onValueChange={(val: '10' | '20' | '30' | '40' | '50') =>
              orderStatusUpdateMutation({ no, orderStatus: { orderStatus: val } })
            }
          >
            <SelectTrigger>
              <SelectValue>{found?.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ordersStatus?.map(({ name, code }) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const columnValue = ordersStatus?.find((item) => item.code === row.getValue(columnId));
        return columnValue?.code === filterValue;
      },
    }),
    columnHelper.accessor('deliveryMethodName', {
      maxSize: 1,
      header: () => (
        <Button className="p-0" variant="ghost">
          배송방법
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor((row) => `${row.address} ${row.addressDetail} (${row.zipcode})`, {
      id: 'address',
      maxSize: 5,
      header: () => (
        <Button className="p-0" variant="ghost">
          배송지
        </Button>
      ),
      cell: (info) => {
        const { address, addressDetail, zipcode } = info.row.original;
        return (
          <p className="line-clamp-3 whitespace-normal break-words">
            {address} {addressDetail} ({zipcode})
          </p>
        );
      },
    }),

    columnHelper.accessor('totalPrice', {
      maxSize: 2,
      header: ({ column }) => renderSortButton(column, '결제금액'),
      cell: (info) => <p>{formatCurrencyKR(info.getValue())}원</p>,
    }),
    columnHelper.accessor('createdAt', {
      maxSize: 3,
      header: ({ column }) => renderSortButton(column, '주문등록일시'),
      cell: (info) => (
        <div className="line-clamp-3 whitespace-normal break-words">
          {formatDateTime(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      maxSize: 3,
      header: ({ column }) => renderSortButton(column, '주문수정일시'),
      cell: (info) => (
        <div className="line-clamp-3 whitespace-normal break-words">
          {formatDateTime(info.getValue())}
        </div>
      ),
    }),
  ];

  return columns;
};

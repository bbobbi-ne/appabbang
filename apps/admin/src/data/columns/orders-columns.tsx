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

export type OrdersListItem = OrdersListData[number];

export const ordersColumns = () => {
  const columnHelper = createColumnHelper<OrdersListItem>();
  const { data: ordersStatus } = useGetOrderStatusQuery();
  const { orderStatusUpdateMutation } = useOrderStatusUpdateMutation();

  const columns: ColumnDef<OrdersListItem, any>[] = [
    columnHelper.accessor('no', {
      maxSize: 0,
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
    columnHelper.accessor('orderNumber', {
      maxSize: 15,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문번호
        </Button>
      ),
      cell: (info) => {
        return <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>;
      },
    }),
    // columnHelper.accessor('customer.name', {
    //   maxSize: 5,
    //   header: ({ column }) => (
    //     <Button className="p-0" variant="ghost">
    //       이름
    //     </Button>
    //   ),
    //   cell: (info) => {
    //     return info.getValue();
    //   },
    // }),
    // columnHelper.accessor('customer.mobileNumber', {
    //   maxSize: 10,
    //   header: ({ column }) => (
    //     <Button className="p-0" variant="ghost">
    //       전화번호
    //     </Button>
    //   ),
    //   cell: (info) => {
    //     return <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>;
    //   },
    // }),
    columnHelper.accessor('payment.isPaid', {
      maxSize: 5,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          입금확인
        </Button>
      ),
      cell: (info) => {
        const value = info.getValue() ? '완료' : '미완료';
        return <p className={`${info.getValue() ? '' : 'text-red-500'} font-semibold`}>{value}</p>;
      },
    }),
    columnHelper.accessor('orderStatus', {
      maxSize: 5,
      header: ({ column }) => {
        const rawValue = column.getFilterValue();
        const value = typeof rawValue === 'string' ? rawValue : 'all';

        return (
          <Select
            value={value}
            onValueChange={(val) => {
              column.setFilterValue(val === 'all' ? undefined : val);
            }}
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
            onValueChange={(val: '10' | '20' | '30' | '40' | '50') => {
              orderStatusUpdateMutation({ no, orderStatus: { orderStatus: val } });
            }}
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
      maxSize: 5,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          배송방법
        </Button>
      ),
      cell: (info) => {
        return info.getValue();
      },
    }),
    columnHelper.accessor('address', {
      maxSize: 20,
      header: ({ column }) => (
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
      maxSize: 10,
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
      maxSize: 5,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문등록일시
        </Button>
      ),
      cell: (info) => {
        return (
          <div className="line-clamp-3 whitespace-normal break-words">
            {formatDateTime(info.getValue())}
          </div>
        );
      },
    }),
    columnHelper.accessor('updatedAt', {
      maxSize: 5,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문수정일시
        </Button>
      ),
      cell: (info) => {
        return (
          <div className="line-clamp-3 whitespace-normal break-words">
            {formatDateTime(info.getValue())}
          </div>
        );
      },
    }),
  ];

  return columns;
};

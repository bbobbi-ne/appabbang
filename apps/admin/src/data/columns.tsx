import type {
  BreadsListData,
  CouponsListData,
  CustomersListData,
  OrderRoundListData,
  OrdersListData,
  PaymentsListData,
} from '@/api/data-contracts';
import {
  AspectRatio,
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@appabbang/ui';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { SortAsc, SortDesc } from 'lucide-react';
import {
  formatIso,
  formatIsoWithoutSeconds,
  formatKR,
  formatToDate,
  formatToDateTime,
} from '@/utils/format';
import {
  useOrderAndStatusAndDliveryTypeQuery,
  useOrderStatusUpdateMutation,
} from '@/hooks/use-order';
import { usePaidUpdateMutation } from '@/hooks/use-payment';
import { RefundDialog } from '@/components/payments/refund-dialog';
import { useGetOrderStatusQuery } from '@/hooks/use-common-code';

export interface MaterialColumns {
  no: number;
  name: string;
  material_type: 'ingredient' | 'packaging';
  unit: string;
  created_at: any;
  quantity: number;
  updated_at: Date;
}

export interface PurchaseColumns {
  no: number;
  title: string;
  customer_no: string;
  status: 'requested' | 'processing' | 'completed';
  completed_at: Date;
  memo: string;
  total_price: number;
  receipt_image_url: string;
}

export type CustomersListItem = CustomersListData[number];
export type PaymentsListItem = PaymentsListData[number];
export type OrderRoundListItem = OrderRoundListData[number];
export type BreadListItem = BreadsListData[number];
export type OrdersListItem = OrdersListData[number];
export type CouponsListItem = CouponsListData[number];

export const BreadsColumns = () => {
  const columnHelper = createColumnHelper<BreadListItem>();

  const columns: ColumnDef<BreadListItem, any>[] = [
    columnHelper.display({
      id: 'select',
      maxSize: 1,
      header: ({ table }) => (
        <Checkbox
          className="h-5 w-5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.preventDefault()}>
          <Checkbox
            className="w-5 h-5"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
    }),

    columnHelper.accessor('no', {
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

    columnHelper.accessor('images', {
      maxSize: 3,
      header: '대표이미지',
      cell: ({ row }) => {
        const url = (row.getValue('images') as { url: string }[]) || [];
        const src = url[0]?.url
          ? url[0].url
          : 'https://cdn.imweb.me/upload/S202206178ecd8851ac794/cd0f057a7035b.jpg';

        return (
          <AspectRatio ratio={9 / 5}>
            <img
              src={src}
              alt={row.original.name}
              className="h-full w-full rounded-lg object-fill"
            />
          </AspectRatio>
        );
      },
    }),

    columnHelper.accessor('name', {
      maxSize: 3,
      header: ({ column }) => {
        const isSorted = column.getIsSorted() === 'asc';
        return (
          <Button
            className={`p-0 ${isSorted ? 'text-blue-500' : ''} hover:text-primary`}
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {isSorted ? <SortAsc /> : <SortDesc />} 메뉴명
          </Button>
        );
      },
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
    }),

    columnHelper.accessor('unitPrice', {
      maxSize: 3,
      header: ({ column }) => {
        const isSorted = column.getIsSorted() === 'asc';

        return (
          <Button
            className={`p-0 ${isSorted ? 'text-blue-500' : ''} hover:text-primary`}
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {isSorted ? <SortAsc /> : <SortDesc />} 단가
          </Button>
        );
      },
      cell: (info) => (
        <p className="text-right">
          {new Intl.NumberFormat('ko-KR', { currency: 'KRW' }).format(info.getValue())}원
        </p>
      ),
    }),

    columnHelper.accessor('countryOfOrigin', {
      maxSize: 5,
      header: ({ column }) => '원산지정보',
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
    }),

    columnHelper.accessor('allergyInfo', {
      maxSize: 5,
      header: ({ column }) => '알레르기 정보',
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue() || '없음'}</p>
      ),
    }),

    columnHelper.accessor('description', {
      maxSize: 5,
      header: '설명',
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
    }),

    // columnHelper.accessor('breadStatus', {
    //   header: ({ column }) => {
    //     const rawValue = column.getFilterValue();
    //     const value = typeof rawValue === 'string' ? rawValue : 'all';

    //     return (
    //       <Select
    //         value={value}
    //         onValueChange={(val) => {
    //           column.setFilterValue(val === 'all' ? undefined : val);
    //         }}
    //       >
    //         <SelectTrigger>
    //           <SelectValue />
    //         </SelectTrigger>
    //         <SelectContent>
    //           <SelectItem value="all">전체</SelectItem>
    //           {breadStatus?.map(({ name, code }) => (
    //             <SelectItem key={code} value={code}>
    //               {name}
    //             </SelectItem>
    //           ))}
    //         </SelectContent>
    //       </Select>
    //     );
    //   },

    //   cell: (info) => {
    //     const value = info.getValue();
    //     const found = breadStatus?.find((item) => item.code === value);
    //     const no = info.row.original.no;

    //     return (
    //       <Select
    //         value={value}
    //         onValueChange={(val: '10' | '20' | '30' | '40' | '50') => {
    //           statusUpdateMutation({ no, payload: { breadStatus: val } });
    //         }}
    //       >
    //         <SelectTrigger>
    //           <SelectValue>{found?.name}</SelectValue>
    //         </SelectTrigger>
    //         <SelectContent>
    //           {breadStatus?.map(({ name, code }) => (
    //             <SelectItem key={code} value={code}>
    //               {name}
    //             </SelectItem>
    //           ))}
    //         </SelectContent>
    //       </Select>
    //     );
    //   },

    //   filterFn: (row, columnId, filterValue) => {
    //     const columnValue = breadStatus?.find((item) => item.code === row.getValue(columnId));
    //     return columnValue?.code === filterValue;
    //   },
    // }),

    columnHelper.accessor('createdAt', {
      maxSize: 3,
      header: ({ column }) => {
        const isSorted = column.getIsSorted() === 'asc';

        return (
          <Button
            className={`p-0 ${isSorted ? 'text-blue-500' : ''} hover:text-primary`}
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {isSorted ? <SortAsc /> : <SortDesc />} 등록일자
          </Button>
        );
      },
      cell: (info) => (
        <p className="line-clamp-2 whitespace-normal break-words text-center">
          {formatToDate(new Date(info.getValue()))}
        </p>
      ),
    }),

    columnHelper.accessor('updatedAt', {
      maxSize: 3,
      header: ({ column }) => {
        const isSorted = column.getIsSorted() === 'asc';

        return (
          <Button
            className={`p-0 ${isSorted ? 'text-blue-500' : ''} hover:text-primary`}
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {isSorted ? <SortAsc /> : <SortDesc />} 최근 수정일
          </Button>
        );
      },
      cell: (info) => (
        <p className="line-clamp-2 whitespace-normal break-words text-center">
          {formatToDateTime(new Date(info.getValue()))}
        </p>
      ),
    }),
  ];

  return columns;
};

export const muterialColumns = () => {
  const columnHelper = createColumnHelper<MaterialColumns>();

  const columns: ColumnDef<MaterialColumns, any>[] = [
    columnHelper.accessor('no', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          No
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          재료명
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('material_type', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          재료타입
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('unit', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          단위
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('quantity', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          재고수량
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('updated_at', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          최근수정일
        </Button>
      ),
      cell: (info) => {},
    }),
  ];

  return columns;
};

export const ordersColumns = () => {
  const columnHelper = createColumnHelper<OrdersListItem>();
  const { ordersStatus } = useOrderAndStatusAndDliveryTypeQuery();
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
    columnHelper.accessor('customer.name', {
      maxSize: 5,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          이름
        </Button>
      ),
      cell: (info) => {
        return info.getValue();
      },
    }),
    columnHelper.accessor('customer.mobileNumber', {
      maxSize: 10,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          전화번호
        </Button>
      ),
      cell: (info) => {
        return <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>;
      },
    }),
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
    columnHelper.accessor('deliveryMethod.name', {
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
        const { address, addressDetail, zipcode } = info.getValue();

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
        return <p>{formatKR(info.getValue())}원</p>;
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
            {formatToDate(info.getValue())}
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
            {formatToDateTime(info.getValue())}
          </div>
        );
      },
    }),
  ];

  return columns;
};

export const orderRoundColumns = () => {
  const columnHelper = createColumnHelper<OrderRoundListItem>();

  const columns: ColumnDef<OrderRoundListItem, any>[] = [
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
    columnHelper.accessor('image', {
      maxSize: 2,
      header: ({ column }) => <p>주문차수 이미지</p>,
      cell: (info) => {
        const src = info.getValue()[0]
          ? info.getValue()[0].url
          : 'https://cdn.imweb.me/upload/S202206178ecd8851ac794/cd0f057a7035b.jpg';

        return (
          <AspectRatio ratio={9 / 5}>
            <img
              src={src}
              alt={info.row.original.name}
              className="h-full w-full rounded-lg object-fill"
            />
          </AspectRatio>
        );
      },
    }),
    columnHelper.accessor('no', {
      maxSize: 1,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문차수
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('name', {
      maxSize: 3,

      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          이름
        </Button>
      ),
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),

    columnHelper.accessor('orderRoundBreads', {
      maxSize: 6,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          판매리스트
        </Button>
      ),
      cell: (info) => {
        const names = info
          .getValue()
          .map((item: any) => item.name)
          .join(', ');
        return <p className="line-clamp-2 whitespace-normal break-words">{names}</p>;
      },
    }),
    columnHelper.accessor('startedAt', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          시작일자
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{formatIsoWithoutSeconds(info.getValue())}</p>;
      },
    }),
    columnHelper.accessor('endedAt', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          종료일자
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{formatIsoWithoutSeconds(info.getValue())}</p>;
      },
    }),
  ];

  return columns;
};

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
              console.log(selectValue);
              const isPaid = selectValue === '완료' ? true : false;
              paidUpdateMutation({
                no,
                rowOrderStatus: rowOrderStatus!,
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
        return <p>{formatKR(info.getValue())}원</p>;
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
        return <p className="text-center">{formatIso(info.getValue())}</p>;
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
        const value = info.getValue() === null ? '미입금' : formatIso(info.getValue());

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

        const refund = !!refundCode.find((code) => code === info.row.original.order.orderStatus);
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

export const purchaseColumns = () => {
  const columnHelper = createColumnHelper<PurchaseColumns>();

  const columns: ColumnDef<PurchaseColumns, any>[] = [
    columnHelper.accessor('no', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          No
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('title', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          제목
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('status', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          발주요청 상태태
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('completed_at', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          완료날짜
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('memo', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          메모
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('total_price', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          발주금액 합계
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('receipt_image_url', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          영수증 이미지
        </Button>
      ),
      cell: (info) => {},
    }),
  ];

  return columns;
};

export const customersColumns = () => {
  const columnHelper = createColumnHelper<CustomersListItem>();

  const columns: ColumnDef<CustomersListItem, any>[] = [
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
    columnHelper.accessor('id', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          ID
        </Button>
      ),
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          이름
        </Button>
      ),
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('mobile_number', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          휴대폰번호
        </Button>
      ),
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('default_address_no', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          기본배송지
        </Button>
      ),
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('created_at', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          가입일
        </Button>
      ),
      cell: (info) => {},
    }),
  ];

  return columns;
};

export const couponsColumns = () => {
  const columnHelper = createColumnHelper<CouponsListItem>();

  const columns: ColumnDef<CouponsListItem, any>[] = [
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
    columnHelper.accessor('name', {
      maxSize: 20,
      header: () => (
        <Button className="p-0" variant="ghost">
          쿠폰명
        </Button>
      ),
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('amount', {
      maxSize: 15,
      header: () => (
        <Button className="p-0" variant="ghost">
          쿠폰금액
        </Button>
      ),
      cell: (info) => {
        return <p className="text-right">{formatKR(info.getValue())} 원</p>;
      },
    }),
    columnHelper.accessor('expireAfterDays', {
      maxSize: 15,
      header: () => (
        <Button className="p-0" variant="ghost">
          쿠폰만료일
        </Button>
      ),
      cell: (info) => {
        return <p className="text-right">{info.getValue()} 일</p>;
      },
    }),
    columnHelper.accessor('createdAt', {
      maxSize: 15,
      header: () => (
        <Button className="p-0" variant="ghost">
          등록일
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{formatToDate(info.getValue())}</p>;
      },
    }),
    columnHelper.accessor('updatedAt', {
      maxSize: 15,
      header: () => (
        <Button className="p-0" variant="ghost">
          수정일
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{formatToDate(info.getValue())}</p>;
      },
    }),
    columnHelper.display({
      id: 'actions',
      maxSize: 20,
      header: '발급',
    }),
  ];

  return columns;
};

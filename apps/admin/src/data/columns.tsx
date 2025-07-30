import type { BreadsListData, OrdersListData } from '@/api/data-contracts';
import { AspectRatio, Button, Checkbox } from '@appabbang/ui';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { SortAsc, SortDesc } from 'lucide-react';
import { formatToDate, formatToDateTime } from '@/utils/format';

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
export interface CustomerColumns {
  no: number;
  id: string;
  name: string;
  mobile_number: string;
  default_address_no: Date;
  created_at: Date;
}

export type BreadListItem = BreadsListData[number];
export type OrdersListItem = OrdersListData[number];

export const BreadsColumns = () => {
  const columnHelper = createColumnHelper<BreadListItem>();

  // 알레르기 원산지정보 추가 필
  const columns: ColumnDef<BreadListItem, any>[] = [
    columnHelper.display({
      id: 'select',
      maxSize: 0,
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
      maxSize: 3,
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
      maxSize: 5,
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
      maxSize: 5,
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
      cell: ({ row }) => (
        <p className="line-clamp-3 whitespace-normal break-words">{row.getValue('name')}</p>
      ),
    }),

    columnHelper.accessor('unitPrice', {
      maxSize: 5,
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

    columnHelper.accessor('description', {
      maxSize: 10,
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
      maxSize: 5,
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
      maxSize: 5,
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
      maxSize: 5,
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
        return value;
      },
    }),
    columnHelper.accessor('orderStatusName', {
      maxSize: 5,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문상태
        </Button>
      ),
      cell: (info) => {
        return info.getValue();
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
        const { address, addressDetail } = info.getValue();

        return (
          <p className="line-clamp-3 whitespace-normal break-words">
            {address} {addressDetail}
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
        return <p>{info.getValue()}원</p>;
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
  const columnHelper = createColumnHelper<CustomerColumns>();

  const columns: ColumnDef<CustomerColumns, any>[] = [
    columnHelper.accessor('no', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          No
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('id', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          ID
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          이름
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('mobile_number', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          휴대폰번호
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('default_address_no', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          기본배송지
        </Button>
      ),
      cell: (info) => {},
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

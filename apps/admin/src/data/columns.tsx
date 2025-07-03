import { useGetBreadsAndStatusQuery, useUpdateBreadStatusMutation } from '@/hooks/use-breads';
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
import { ArrowUpDown } from 'lucide-react';

export interface BreadsColumns {
  no: number;
  name: string;
  description: string;
  unitPrice: number;
  breadStatus: any;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
}
export interface MaterialColumns {
  no: number;
  name: string;
  material_type: 'ingredient' | 'packaging';
  unit: string;
  created_at: any;
  quantity: number;
  updated_at: Date;
}
export interface OrdersColumns {
  no: number;
  customer_no: string;
  name: string;
  mobile_number: string;
  address_no: number;
  delivery_no: number;
  order_number: string;
  status: number;
  total_price: string;
  created_at: number;
  updated_at: Date;
  // order_pw: string;
  // paid: boolean;
  // memo: string;
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

export const BreadsColumns = () => {
  const breadStatus = useGetBreadsAndStatusQuery().breadStatus;
  const { updateBreadStatusMutation } = useUpdateBreadStatusMutation();
  const columnHelper = createColumnHelper<BreadsColumns>();

  const columns: ColumnDef<BreadsColumns, any>[] = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <div className="flex justify-center">
          <Checkbox
            className=""
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
    }),

    columnHelper.accessor('no', {
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          번호 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        return info.getValue();
      },
    }),

    columnHelper.accessor('name', {
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          메뉴명 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue('name'),
    }),

    columnHelper.accessor('description', {
      header: '설명',
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
    }),

    columnHelper.accessor('unitPrice', {
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          단가 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(
          info.getValue(),
        ),
    }),

    columnHelper.accessor('images', {
      header: '대표이미지',
      cell: ({ row }) => {
        const url = (row.getValue('images') as { url: string }[]) || [];
        const src = url[0]?.url
          ? url[0].url
          : 'https://cdn.imweb.me/upload/S202206178ecd8851ac794/cd0f057a7035b.jpg';

        return (
          <AspectRatio>
            <img
              src={src}
              alt={row.original.name}
              className="h-full w-full rounded-lg object-cover"
            />
          </AspectRatio>
        );
      },
    }),

    columnHelper.accessor('breadStatus', {
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
              {breadStatus?.map(({ name, code }) => (
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
        const found = breadStatus?.find((item) => item.code === value);
        const no = info.row.original.no;

        return (
          <Select
            value={value}
            onValueChange={(val) => {
              updateBreadStatusMutation({ no, breadStatus: val });
            }}
          >
            <SelectTrigger>
              <SelectValue>{found?.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {breadStatus?.map(({ name, code }) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },

      filterFn: (row, columnId, filterValue) => {
        const columnValue = breadStatus?.find((item) => item.code === row.getValue(columnId));
        return columnValue?.code === filterValue;
      },

      enableSorting: true,
    }),

    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          생성일 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="line-clamp-2 whitespace-normal break-words text-center">
          {new Intl.DateTimeFormat('ko-KR', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(info.getValue()))}
        </div>
      ),
    }),

    columnHelper.accessor('updatedAt', {
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          최근 수정일 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="line-clamp-2 whitespace-normal break-words text-center">
          {new Intl.DateTimeFormat('ko-KR', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(info.getValue()))}
        </div>
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
  const columnHelper = createColumnHelper<OrdersColumns>();

  const columns: ColumnDef<OrdersColumns, any>[] = [
    columnHelper.accessor('no', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          No
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('order_number', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문번호
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('customer_no', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          고객아이디
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
          전화번호
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('status', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문상태
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('delivery_no', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          배송방법
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('address_no', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          배송지
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('total_price', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          총금액
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('created_at', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문시간
        </Button>
      ),
      cell: (info) => {},
    }),
    columnHelper.accessor('updated_at', {
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          상태변경시간
        </Button>
      ),
      cell: (info) => {},
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

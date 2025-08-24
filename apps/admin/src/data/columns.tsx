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

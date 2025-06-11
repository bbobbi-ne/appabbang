import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';

import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  AspectRatio,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@appabbang/ui';
import { makeBreadsData, type Breads } from '@/data/demo-brads';

export const Route = createFileRoute('/_dashboardLayout/dashboard/breads/')({
  component: RouteComponent,
});

const columnHelper = createColumnHelper<Breads>();

export const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),

  columnHelper.accessor('no', {
    header: '번호',
    cell: (info) => <div>{info.getValue()}</div>,
  }),

  columnHelper.accessor('name', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          메뉴명
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue<string>('name');

      return <div className="font-medium">{name}</div>;
    },
    footer: (info) => info.column.id,
  }),

  columnHelper.accessor('description', {
    header: '설명',
    cell: (info) => <div className="line-clamp-2 ">{info.getValue()}</div>,
  }),

  columnHelper.accessor('unit_price', {
    header: '단가',
    cell: (info) => {
      const price = info.getValue();
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(price);
    },
  }),
  columnHelper.accessor('image_url', {
    header: '대표이미지',
    cell: ({ row }) => {
      const name = row.original.name;

      return (
        <AspectRatio ratio={16 / 8}>
          <img
            src={row.getValue('image_url')}
            alt={name}
            className="h-full w-full rounded-lg object-cover"
          />
        </AspectRatio>
      );
    },
  }),

  columnHelper.accessor('bread_status', {
    header: '상태',
    cell: (info) => {
      const statusValue = String(info.getValue());

      return (
        <Select value={statusValue} onValueChange={(val) => console.log('Changed:', val)}>
          <SelectTrigger icon={false} className="border-none shadow-none w-full hover:bg-accent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">품절</SelectItem>
            <SelectItem value="1">판매중</SelectItem>
            <SelectItem value="2">준비중</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  }),

  columnHelper.accessor('updated_at', {
    header: '최근 수정일',
    cell: (info) => {
      const date = new Date(info.getValue());
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    },
  }),
];

function RouteComponent() {
  const [data, setData] = React.useState<Breads[]>(() => makeBreadsData(300));
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 30,
  });
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="flex flex-col w-full max-w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination>
          <PaginationContent>
            {/* Prev 버튼 */}
            <PaginationItem>
              <Button
                variant={'outline'}
                className="cursor-pointer"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                Prev
              </Button>
            </PaginationItem>

            {/* 페이지 번호 버튼들 */}
            {Array.from({ length: table.getPageCount() }, (_, index) => (
              <PaginationItem key={index}>
                <Button
                  variant={'outline'}
                  disabled={index === table.getState().pagination.pageIndex}
                  onClick={() => table.setPageIndex(index)}
                >
                  {index + 1}
                </Button>
              </PaginationItem>
            ))}

            {/* Next 버튼 */}
            <PaginationItem>
              <Button
                variant={'outline'}
                className="cursor-pointer"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

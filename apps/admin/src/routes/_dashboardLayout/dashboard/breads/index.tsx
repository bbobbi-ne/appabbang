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
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';

import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@appabbang/ui';

import { TablePagination } from '@/components/table-pagination';
import { BreadsDialog } from '../../../../components/breads_dialog';
import { useQuery } from '@tanstack/react-query';
import { getBreads } from '@/service/breadApi';
import { ArrowUpDown } from 'lucide-react';
import { useBreadStatus } from '@/hooks/useBreadStatus';

export type Breads = {
  no: number;
  name: string;
  description: string;
  unitPrice: number;
  breadStatus: any;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
  image: string[] | string;
};

export const Route = createFileRoute('/_dashboardLayout/dashboard/breads/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const { data } = useBreadStatus();
  const breadStatus = data?.breadStatus;

  const columnHelper = createColumnHelper<Breads>();

  const columns: ColumnDef<Breads, any>[] = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="mr-2"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
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

    columnHelper.accessor('image', {
      header: '대표이미지',
      cell: ({ row }) => (
        <AspectRatio>
          <img
            src={row.getValue('image')}
            alt={row.original.name}
            className="h-full w-full rounded-lg object-cover"
          />
        </AspectRatio>
      ),
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
              <SelectValue placeholder="상태" />
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
        const found = breadStatus?.find((item) => item.name === value);
        return found?.name;
      },

      filterFn: (row, columnId, filterValue) => {
        const columnValue = breadStatus?.find((item) => item.name === row.getValue(columnId));

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
      cell: (info) =>
        new Intl.DateTimeFormat('ko-KR', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(info.getValue())),
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
      cell: (info) =>
        new Intl.DateTimeFormat('ko-KR', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(info.getValue())),
    }),
  ];

  const {
    data: bradsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['breads'],
    queryFn: getBreads,
  });

  const table = useReactTable<Breads>({
    data: bradsData?.breads,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <>로딩중</>;
  if (isError) return <>에러</>;

  return (
    <>
      <Card className="">
        <CardHeader className="py-0">
          <BreadsDialog />
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter>
          <TablePagination table={table} />
        </CardFooter>
      </Card>
    </>
  );
}

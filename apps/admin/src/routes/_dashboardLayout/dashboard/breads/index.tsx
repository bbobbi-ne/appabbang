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
import { BreadsCreateDialog } from '../../../../components/breads-create-dialog';
import { useQuery } from '@tanstack/react-query';
import { getBreads } from '@/service/breadApi';
import { ArrowUpDown } from 'lucide-react';
import { useBreadStatus } from '@/hooks/useBreadStatus';
import {
  useDeleteBreadMutation,
  useGetBreadsQuery,
  useUpdateBreadMutation,
} from '@/hooks/useBreads';
import { BreadModifyDialog } from '@/components/bread-modify-dialog';

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
  const { data: breadStatusData } = useBreadStatus();
  const breadStatus = breadStatusData?.breadStatus;
  const { deleteBreadMutation } = useDeleteBreadMutation();
  const { updateBreadMutation } = useUpdateBreadMutation();

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
            src={
              row.getValue('image') ||
              'https://res.cloudinary.com/appabbang/image/upload/v1750588032/breads/nfaxnkenijts73eglojy.jpg'
            }
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
        const found = breadStatus?.find((item) => item.name === value);
        const no = info.row.original.no;

        console.log(no);
        console.log(value);

        return (
          <Select
            value={value}
            onValueChange={(val) => {
              console.log(val);
              // console.log(i)
              // updateBreadMutation(no)
              // info.setFilterValue(val === 'all' ? undefined : val);
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
        // return (
        //   <p className="z-20" onClick={(e) => e.preventDefault()}>
        //     {found?.name}
        //   </p>
        // );
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

    columnHelper.display({
      id: 'delete',
      cell: ({ row }) => (
        <Button variant={'destructive'} onClick={() => deleteBreadMutation([row.original.no])}>
          삭제
        </Button>
      ),
    }),
  ];

  const { data: bradsData, isLoading, isError } = useGetBreadsQuery();

  console.log(bradsData);
  const table = useReactTable<Breads>({
    data: bradsData,
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

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original.no);

  return (
    <>
      <Card className="shadow-none bg-background border-none">
        <CardHeader>
          <h1>빵관리</h1>
          <BreadsCreateDialog />
        </CardHeader>
        <CardContent className="max-h-[550px] border-1 p-0 m-6 mt-0 rounded-lg overflow-auto relative">
          <Table className="">
            <TableHeader className="sticky top-0 z-10 bg-background">
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
                    <BreadModifyDialog no={cell.row.original.no} key={cell.id}>
                      <TableCell>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    </BreadModifyDialog>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="space-x-2">
          <TablePagination table={table} />
          {selectedRows.length > 0 && (
            <Button onClick={() => deleteBreadMutation(selectedRows)} variant="destructive">
              선택항목 삭제
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}

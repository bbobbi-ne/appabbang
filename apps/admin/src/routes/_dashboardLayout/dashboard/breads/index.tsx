import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@appabbang/ui';

import { TablePagination } from '@/components/table-pagination';
import { BreadsCreateDialog } from '../../../../components/breads-create-dialog';
import { useDeleteBreadMutation, useGetBreadsQuery } from '@/hooks/use-breads';
import { BreadModifyDialog } from '@/components/bread-modify-dialog';
import { BreadsColumns } from '@/data/columns';

export const Route = createFileRoute('/_dashboardLayout/dashboard/breads/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const { data: bradsData, isLoading, isError } = useGetBreadsQuery();
  const { deleteBreadMutation } = useDeleteBreadMutation();
  const columns = BreadsColumns();

  const table = useReactTable<BreadsColumns>({
    data: bradsData as BreadsColumns[],
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

  if (isLoading) return;
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

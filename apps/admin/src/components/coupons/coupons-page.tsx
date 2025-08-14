import {
  Card,
  TableHead,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  CardFooter,
  TableCell,
} from '@appabbang/ui';
import {
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { TablePagination } from '../ui/table-pagination';
import { useState } from 'react';
import { couponsColumns, type CouponsListItem } from '@/data/columns';
import { useCouponsQuery } from '@/hooks/use-coupon';
import { CouponCreateDialog } from '@/components/coupons/coupon-create-dialog';
import { CouponModifyDialog } from './coupon-modify-dialog';

export const CouponsPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const columns = couponsColumns();
  const {
    // isError, isLoading,

    data: coupons,
  } = useCouponsQuery();

  const table = useReactTable<CouponsListItem>({
    data: coupons || [],
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

  return (
    <>
      <Card className="shadow-none bg-background border-none">
        <CardHeader>
          <CardTitle>쿠폰 관리</CardTitle>
          <CouponCreateDialog />
        </CardHeader>
        <CardContent className="max-h-[550px] border-1 p-0 m-6 mt-0 rounded-lg overflow-auto relative">
          <Table>
            <TableHeader className="bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const max = header.column.columnDef.maxSize;
                    return (
                      <TableHead
                        style={{ width: `${max}%` }}
                        className="text-center"
                        key={header.id}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="p-4 text-center">
                    쿠폰이 없습니다.
                  </TableCell>
                </TableRow>
              )}

              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="cursor-pointer ">
                  {row.getVisibleCells().map((cell) => (
                    <CouponModifyDialog no={cell.row.original.no} key={cell.id}>
                      <TableCell>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    </CouponModifyDialog>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="space-x-2">
          <TablePagination table={table} />
        </CardFooter>
      </Card>
    </>
  );
};

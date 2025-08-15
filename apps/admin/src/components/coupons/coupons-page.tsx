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
  Button,
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
import { useNavigate } from '@tanstack/react-router';

export const CouponsPage = () => {
  const navigate = useNavigate();
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
                <TableRow key={row.id} className="cursor-pointer text-xs">
                  {row.getVisibleCells().map((cell) => {
                    // action 컬럼은 CouponModifyDialog로 감싸지 않음
                    if (cell.column.id === 'actions') {
                      return (
                        <TableCell key={cell.id}>
                          <div className="flex justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate({ to: `/dashboard/coupons/${cell.row.original.no}` })
                              }
                            >
                              쿠폰 발급
                            </Button>
                          </div>
                        </TableCell>
                      );
                    }

                    // 나머지 컬럼은 CouponModifyDialog로 감쌈
                    return (
                      <CouponModifyDialog no={cell.row.original.no} key={cell.id}>
                        <TableCell>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      </CouponModifyDialog>
                    );
                  })}
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

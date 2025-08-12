import { TablePagination } from '@/components/ui/table-pagination';
import TableSkeleton from '@/components/ui/table-skeletion';
import { paymentsColumns, type PaymentsListItem } from '@/data/columns';
import { usePaymentsListAndOrderStatusQuery, usePaymentsListQuery } from '@/hooks/use-payment';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  ScrollArea,
  ScrollBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@appabbang/ui';
import { createFileRoute } from '@tanstack/react-router';
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
import { useState } from 'react';

export const Route = createFileRoute('/dashboard/payment/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { paymentsList, isLoading, isError } = usePaymentsListAndOrderStatusQuery();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const columns = paymentsColumns();

  const table = useReactTable<PaymentsListItem>({
    data: paymentsList || [],
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

  if (isLoading) return <TableSkeleton />;
  if (isError) return <>에러</>;

  return (
    <>
      <Card className="shadow-none bg-background border-none">
        <CardHeader>
          <CardTitle>결제관리</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[550px] w-full border-1 rounded-lg ">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background shadow border-b-0">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const max = header.column.columnDef.maxSize;

                        return (
                          <TableHead
                            className="text-center"
                            style={{ width: `${max}%` }}
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
                        빵을 등록해주세요.
                      </TableCell>
                    </TableRow>
                  )}
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
        <CardFooter className="space-x-2">
          <TablePagination table={table} />
          {/* {selectedRows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">선택항목 삭제</Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.preventDefault()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>삭제시 복구가 어렵습니다.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      table.setRowSelection({});
                      deleteBreadMutation({ noList: selectedRows });
                    }}
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )} */}
        </CardFooter>
      </Card>
    </>
  );
}

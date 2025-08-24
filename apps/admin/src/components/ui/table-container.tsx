import * as React from 'react';
import {
  flexRender,
  type Table as ReactTable, // ✅ table 타입 import
} from '@tanstack/react-table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  ScrollArea,
  ScrollBar,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Button,
} from '@appabbang/ui';
import { TablePagination } from '@/components/ui/table-pagination';
import TableSkeleton from './table-skeletion';

interface TableContainerProps<TData> {
  title: string; // 테이블 제목
  table: ReactTable<TData>; // ✅ table 인스턴스를 외부에서 받음
  isLoading: boolean;
  isError?: boolean;
  emptyMessage: string;
  createDialog?: React.ReactNode;
  searchBar?: React.ReactNode;
  rowWrapper?: (cell: React.ReactNode, rowData: TData, key: string) => React.ReactNode;
  enableRowSelection?: boolean;
  onDeleteSelected?: (selectedIds: number[]) => void;
}

/**
 * 🔹 TableContainer (UI 전용)
 * - table 인스턴스를 외부에서 받아서 렌더링만 담당
 * - Skeleton, 에러, 빈 데이터 메시지 지원
 */
export function TableContainer<TData>({
  title,
  table,
  isLoading,
  isError,
  emptyMessage,
  createDialog,
  rowWrapper,
  enableRowSelection = false,
  onDeleteSelected,
  searchBar,
}: TableContainerProps<TData>) {
  if (isLoading) return <TableSkeleton />;
  if (isError) return <>에러</>;

  const selectedRows = enableRowSelection
    ? table.getSelectedRowModel().rows.map((r) => (r.original as any).no)
    : [];

  return (
    <Card className="shadow-none bg-background border-none">
      {/* 테이블 헤더 */}
      <CardHeader className="space-y-6">
        <CardTitle>{title}</CardTitle>
        <div className="flex justify-between">
          {searchBar}
          {createDialog}
        </div>
      </CardHeader>

      {/* 테이블 본문 */}
      <CardContent>
        <ScrollArea className="border-1 rounded-lg">
          <div className="max-h-[550px] w-full ">
            <Table>
              {/* 컬럼 헤더 */}
              <TableHeader className="sticky z-5 top-0 bg-background shadow border-b-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const max = header.column.columnDef.maxSize;
                      return (
                        <TableHead
                          className="text-center"
                          style={{ width: max ? `${max}%` : undefined }}
                          key={header.id}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              {/* 데이터 바디 */}
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="p-4 text-center">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        const content = (
                          <TableCell className="text-center" key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                        return rowWrapper ? rowWrapper(content, row.original, cell.id) : content;
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      {/* 테이블 푸터 */}
      <CardFooter className="space-x-2">
        <TablePagination table={table} />

        {/* 선택 항목 삭제 */}
        {enableRowSelection && selectedRows.length > 0 && onDeleteSelected && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">선택항목 삭제</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>삭제시 복구가 어렵습니다.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    table.setRowSelection({});
                    onDeleteSelected(selectedRows);
                  }}
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}

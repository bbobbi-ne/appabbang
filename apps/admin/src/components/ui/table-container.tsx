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
  type ColumnDef,
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
  columns: ColumnDef<TData, any>[]; // 컬럼 정의
  data: TData[] | undefined; // 테이블 데이터
  isLoading: boolean; // 로딩 상태
  isError?: boolean; // 에러 여부
  emptyMessage: string; // 데이터가 없을 때 보여줄 메시지
  createDialog?: React.ReactNode; // 상단에 추가 버튼/다이얼로그 컴포넌트 (create Dialog 트리거로 주로사용중 )
  rowWrapper?: (cell: React.ReactNode, rowData: TData, key: string) => React.ReactNode; // 셀 커스텀 래퍼 (Modify Dialog로 감싸는데 주로사용중)
  enableRowSelection?: boolean; // 행 선택 기능 활성화 여부
  onDeleteSelected?: (selectedIds: number[]) => void; // 선택된 행 삭제 콜백
}

/**
 * 🔹 TableContainer
 * - React Table과 shadcn UI 라이브러리를 결합한 범용 테이블 컴포넌트
 * - 페이징, 정렬, 필터링, 선택 기능 포함
 * - Skeleton, 에러 메시지, 빈 데이터 메시지 지원
 */
export function TableContainer<TData>({
  title,
  columns,
  data = [],
  isLoading,
  isError,
  emptyMessage,
  createDialog,
  rowWrapper,
  enableRowSelection = false,
  onDeleteSelected,
}: TableContainerProps<TData>) {
  // 테이블 상태 관리
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  // React Table 생성
  const table = useReactTable<TData>({
    data: data || [],
    columns,
    state: { pagination, sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // 로딩 상태일 때 Skeleton 렌더링
  if (isLoading) return <TableSkeleton />;
  if (isError) return <>에러</>; // 에러 상태 처리

  // 선택된 행의 ID 추출
  const selectedRows = enableRowSelection
    ? table.getSelectedRowModel().rows.map((r) => (r.original as any).no)
    : [];

  return (
    <Card className="shadow-none bg-background border-none">
      {/* 테이블 헤더 */}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {createDialog}
      </CardHeader>

      {/* 테이블 내용 */}
      <CardContent>
        <ScrollArea className="h-[550px] w-full border-1 rounded-lg">
          <div className="min-w-[1000px]">
            <Table>
              {/* 테이블 컬럼 헤더 */}
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

              {/* 테이블 바디 */}
              <TableBody>
                {/* 데이터 없을 경우 메시지 표시 */}
                {table.getRowModel().rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="p-4 text-center">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}

                {/* 실제 데이터 렌더링 */}
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      const content = (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                      // rowWrapper가 있으면 커스텀 처리
                      return rowWrapper ? rowWrapper(content, row.original, cell.id) : content;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      {/* 테이블 푸터 */}
      <CardFooter className="space-x-2">
        {/* 페이징 컴포넌트 */}
        <TablePagination table={table} />

        {/* 선택 행 삭제 기능 */}
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
                    table.setRowSelection({}); // 선택 초기화
                    onDeleteSelected(selectedRows); // 삭제 콜백 실행
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

import {
  couponTableCustomerColumns,
  type CustomersListItem,
} from '@/data/columns/customers-columns';
import { useGetCustomersQuery } from '@/hooks/use-customer';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Checkbox,
  Input,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from '@appabbang/ui';
import { useCouponIssueMutation } from '@/hooks/use-coupon';
import { TablePagination } from '../ui/table-pagination';

function CouponIssueTable({ no }: { no: number }) {
  // 테이블 상태 관리
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState({});
  const [searchValue, setSearchValue] = useState('');

  const columns = couponTableCustomerColumns();
  const { data: customers, isError, isLoading, isSuccess } = useGetCustomersQuery();

  const table = useReactTable<CustomersListItem>({
    data: customers || [],
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // 검색 필터링 로직 (고객 목록에만 적용)
    globalFilterFn: (row, _, filterValue) => {
      const searchLower = filterValue.toLowerCase();
      const id = row.getValue('id')?.toString().toLowerCase() || '';
      const name = row.getValue('name')?.toString().toLowerCase() || '';
      const mobileNumber = row.getValue('mobileNumber')?.toString().toLowerCase() || '';

      return (
        id.includes(searchLower) || name.includes(searchLower) || mobileNumber.includes(searchLower)
      );
    },
  });

  const selectedCustomers = table.getSelectedRowModel().rows.length;
  const issueCouponMutation = useCouponIssueMutation(Number(no));

  const issueCoupon = async (selectedCustomerNos: number[]) => {
    try {
      await issueCouponMutation.mutateAsync(selectedCustomerNos);
      toast.success('쿠폰이 발급되었습니다.');
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || '쿠폰 발급에 실패했습니다.');
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 pb-4">
        <Input
          placeholder="아이디, 이름, 휴대전화번호로 검색..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            table.setGlobalFilter(e.target.value);
          }}
          className="max-w-sm"
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="ml-auto w-fit"
              disabled={selectedCustomers === 0 || issueCouponMutation.isPending}
            >
              쿠폰 발급
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>선택한 고객에게 쿠폰을 발급합니다.</AlertDialogTitle>
              <AlertDialogDescription>정말로 발급하시겠습니까?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  const selectedRows = table.getFilteredSelectedRowModel().rows;
                  const selectedCustomerNos = selectedRows.map((row) => row.original.no);
                  await issueCoupon(selectedCustomerNos as number[]);
                }}
              >
                확인
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {isSuccess && (
        <div className="flex gap-4">
          <div className="flex-1 space-y-4">
            <h4 className="text-lg font-semibold mb-2">고객 목록</h4>
            {/* 고객 정보 테이블 */}
            <ScrollArea className="border-1 rounded-lg">
              <div className="w-full max-h-[400px]">
                <Table>
                  <TableHeader className="sticky z-5 top-0 bg-background shadow border-b-0">
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
                          고객이 없습니다.
                        </TableCell>
                      </TableRow>
                    )}

                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          // 체크박스 컬럼이 아닌 경우에만 행 클릭으로 선택/해제
                          row.toggleSelected(!row.getIsSelected());
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-xs">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
            <TablePagination table={table} />
          </div>

          {/*  */}
          <div className="flex-1 ">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold">선택된 고객</h4>
              <p className="text-sm text-muted-foreground">Total: {selectedCustomers}명</p>
            </div>
            <ScrollArea className="border-1 rounded-lg">
              <div className="w-full max-h-[400px]">
                <Table className="">
                  <TableHeader className="sticky z-5 top-0 bg-background shadow border-b-0">
                    <TableRow>
                      <TableHead style={{ width: '10%' }} className="text-center">
                        -
                      </TableHead>
                      <TableHead style={{ width: '30%' }} className="text-center">
                        아이디
                      </TableHead>
                      <TableHead style={{ width: '30%' }} className="text-center">
                        이름
                      </TableHead>
                      <TableHead style={{ width: '30%' }} className="text-center">
                        휴대전화번호
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.getSelectedRowModel().rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="p-4 text-center text-muted-foreground">
                          선택된 고객이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      table.getSelectedRowModel().rows.map((row, _) => (
                        <TableRow
                          key={row.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            row.toggleSelected(false);
                          }}
                        >
                          <TableCell className="text-center">
                            <div
                              onClick={(e) => e.preventDefault()}
                              className="flex justify-center"
                            >
                              <Checkbox
                                className="w-5 h-5"
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-center">{row.original.id}</TableCell>
                          <TableCell className="text-xs text-center">{row.original.name}</TableCell>
                          <TableCell className="text-xs text-center">
                            {row.original.mobileNumber}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
}

export default CouponIssueTable;

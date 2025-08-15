import { useCouponDetailQuery, useCouponIssueMutation } from '@/hooks/use-coupon';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  Button,
  Checkbox,
  Input,
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
  type Table as TableType,
} from '@tanstack/react-table';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

export const CouponDetailPage = () => {
  const { no } = useParams({ from: '/dashboard/coupons/$no' });
  const { data, isError, isSuccess } = useCouponDetailQuery(Number(no));
  const navigate = useNavigate();

  // 테이블 상태 관리
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState({});
  const [searchValue, setSearchValue] = useState('');

  const columns = customerColumns();

  const table = useReactTable<CustomerData>({
    data: sampleCustomers,
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

  // 선택된 고객 수 (검색 필터링과 관계없이 전체 선택된 고객)
  const selectedCustomers = table.getSelectedRowModel().rows.length;

  const issueCouponMutation = useCouponIssueMutation(Number(no));
  const issueCoupon = async (selectedCustomerNos: number[]) => {
    try {
      await issueCouponMutation.mutateAsync(selectedCustomerNos);
      toast.success('쿠폰이 발급되었습니다.');
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || '쿠폰 발급에 실패했습니다.');
      setTimeout(() => {
        toast.error('아직 고객 데이터가 샘플이라는 뜻이지요.');
      }, 2000);
    }
  };

  useEffect(() => {
    if (isError) {
      navigate({ to: '/dashboard/coupons' });
    }
  }, [isError]);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold leading-none tracking-tight pb-6">
        쿠폰 관리 &gt; 쿠폰 발급
      </h3>

      {data && (
        <div className="bg-secondary rounded-lg p-2 space-y-2 mb-6">
          <p className="text-sm text-secondary-foreground">
            <b>
              {data.name} ({data.amount}원)
            </b>{' '}
            쿠폰을 발급할 고객을 선택해주세요.
          </p>
          <p className="text-xs text-muted-foreground">
            쿠폰은 발급 후{' '}
            <b>
              <u>{data.expireAfterDays}일</u>
            </b>{' '}
            후에 만료됩니다.
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 pb-4">
        <div className="flex-1">
          <Input
            placeholder="아이디, 이름, 휴대전화번호로 검색..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              table.setGlobalFilter(e.target.value);
            }}
            className="max-w-sm"
          />
        </div>
        <Button
          // size="sm"
          disabled={selectedCustomers === 0 || issueCouponMutation.isPending}
          onClick={async () => {
            if (window.confirm('선택한 고객에게 쿠폰을 발급하시겠습니까?')) {
              const selectedRows = table.getFilteredSelectedRowModel().rows;
              const selectedCustomerNos = selectedRows.map((row) => row.original.no);
              await issueCoupon(selectedCustomerNos);
            }
          }}
        >
          선택한 고객에게 쿠폰 발급
        </Button>
      </div>

      {isSuccess && (
        <div className="flex gap-4">
          <CustomerTable table={table} columns={columns} />
          <SelectedCustomerTable table={table} selectedCustomers={selectedCustomers} />
        </div>
      )}
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////////////

// 고객 데이터 타입 정의
interface CustomerData {
  no: number;
  id: string;
  name: string;
  mobileNumber: string;
}

// 샘플 고객 데이터
const sampleCustomers: CustomerData[] = [
  { no: 1, id: 'customer001', name: '김철수', mobileNumber: '010-1234-5678' },
  { no: 2, id: 'customer002', name: '이영희', mobileNumber: '010-2345-6789' },
  { no: 3, id: 'customer003', name: '박민수', mobileNumber: '010-3456-7890' },
  { no: 4, id: 'customer004', name: '정수진', mobileNumber: '010-4567-8901' },
  { no: 5, id: 'customer005', name: '최지영', mobileNumber: '010-5678-9012' },
  { no: 6, id: 'customer006', name: '강동원', mobileNumber: '010-6789-0123' },
  { no: 7, id: 'customer007', name: '윤서연', mobileNumber: '010-7890-1234' },
  { no: 8, id: 'customer008', name: '임태현', mobileNumber: '010-8901-2345' },
  { no: 9, id: 'customer009', name: '한소희', mobileNumber: '010-9012-3456' },
  { no: 10, id: 'customer010', name: '송민호', mobileNumber: '010-0123-4567' },
];

// 고객 테이블 컬럼 정의
const customerColumns = () => {
  const columnHelper = createColumnHelper<CustomerData>();

  const columns: ColumnDef<CustomerData, any>[] = [
    columnHelper.display({
      id: 'select',
      maxSize: 10,
      header: ({ table }) => (
        <Checkbox
          className="h-5 w-5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.preventDefault()} className="flex justify-center">
          <Checkbox
            className="w-5 h-5"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
    }),
    columnHelper.display({
      id: 'index',
      maxSize: 10,
      header: '번호',
      cell: (info) => {
        // 현재 행이 필터링된 결과에서 몇 번째인지 직접 찾기
        //  const filteredRows = info.table.getFilteredRowModel().rows;
        //  const currentRowIndex = filteredRows.findIndex((row) => row.id === info.row.id);
        //  const index = filteredRows.length - currentRowIndex;
        //  return <p className="text-center">{index}</p>;

        // 역순으로 표시 (전체 데이터 개수부터 시작)
        const totalRows = info.table.getCoreRowModel().rows.length;
        return <p className="text-center">{totalRows - info.row.index}</p>;
      },
    }),
    columnHelper.accessor('id', {
      maxSize: 20,
      header: '아이디',
      cell: (info) => <p className="text-center">{info.getValue()}</p>,
    }),
    columnHelper.accessor('name', {
      maxSize: 20,
      header: '이름',
      cell: (info) => <p className="text-center">{info.getValue()}</p>,
    }),
    columnHelper.accessor('mobileNumber', {
      maxSize: 25,
      header: '휴대전화번호',
      cell: (info) => <p className="text-center">{info.getValue()}</p>,
    }),
  ];

  return columns;
};

const CustomerTable = ({
  table,
  columns,
}: {
  table: TableType<CustomerData>;
  columns: ColumnDef<CustomerData, any>[];
}) => {
  return (
    <div className="flex-1">
      <h4 className="text-lg font-semibold mb-2">고객 목록</h4>
      {/* 고객 정보 테이블 */}
      <div className="w-full max-h-[300px] overflow-y-auto">
        <Table>
          <TableHeader className="bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const max = header.column.columnDef.maxSize;
                  return (
                    <TableHead style={{ width: `${max}%` }} className="text-center" key={header.id}>
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
    </div>
  );
};

const SelectedCustomerTable = ({
  table,
  selectedCustomers,
}: {
  table: TableType<CustomerData>;
  selectedCustomers: number;
}) => {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">선택된 고객</h4>
        <p className="text-sm text-muted-foreground">Total: {selectedCustomers}명</p>
      </div>
      <div className="w-full max-h-[300px] overflow-y-auto">
        <Table>
          <TableHeader className="bg-background">
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
                    <div onClick={(e) => e.preventDefault()} className="flex justify-center">
                      <Checkbox
                        className="w-5 h-5"
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-center">{row.original.id}</TableCell>
                  <TableCell className="text-xs text-center">{row.original.name}</TableCell>
                  <TableCell className="text-xs text-center">{row.original.mobileNumber}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

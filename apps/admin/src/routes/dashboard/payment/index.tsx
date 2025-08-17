import { TableContainer } from '@/components/ui/table-container';
import { TableSearchBar } from '@/components/ui/table-search-bar';
import { paymentsColumns, type PaymentsListItem } from '@/data/columns/payments-columns';
import { usePaymentsWithOrderStatusQuery } from '@/hooks/use-payment';
import { useDebounce } from '@/utils/debounce';
import { createFileRoute } from '@tanstack/react-router';
import {
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
  const { paymentsList, isLoading, isError } = usePaymentsWithOrderStatusQuery();

  const [sorting, setSorting] = useState<SortingState>([{ id: 'no', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchColumn, setSearchColumn] = useState<string>('order.orderNumber');
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 200);

  const searchColumns = [
    { label: '주문번호', value: 'order.orderNumber' },
    { label: '예금주명', value: 'accountHolderName' },
    { label: '계좌번호', value: 'accountNumber' },
  ];

  const table = useReactTable<PaymentsListItem>({
    data: paymentsList || [],
    columns: paymentsColumns(),
    state: { pagination, sorting, columnFilters, globalFilter: debouncedSearchValue },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const keys = searchColumn.split('.');
      let cellValue: any = row.original;

      for (const key of keys) {
        if (cellValue === undefined || cellValue === null) break;
        cellValue = cellValue[key];
      }

      if (cellValue === undefined || cellValue === null) return false;
      if (typeof cellValue === 'number') return cellValue.toString().includes(filterValue);
      return (cellValue || '').toString().toLowerCase().includes(filterValue.toLowerCase());
    },
  });
  return (
    <TableContainer
      title="결제관리"
      table={table}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="결제 데이터가 없습니다."
      searchBar={
        <TableSearchBar
          columns={searchColumns}
          value={searchValue}
          column={searchColumn}
          onValueChange={setSearchValue}
          onColumnChange={setSearchColumn}
        />
      }
    />
  );
}

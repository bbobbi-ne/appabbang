import { OrderDialog } from '@/components/orders/order-dialog';
import { TableContainer } from '@/components/ui/table-container';
import { TableSearchBar } from '@/components/ui/table-search-bar';
import { ordersColumns, type OrdersListItem } from '@/data/columns/orders-columns';
import { useOrdersWithStatusAndDeliveryQuery } from '@/hooks/use-order';
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

export const Route = createFileRoute('/dashboard/orders/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isError, isLoading, orders } = useOrdersWithStatusAndDeliveryQuery();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'no', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const [searchColumn, setSearchColumn] = useState<string>('ordererName');
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 200);

  const searchColumns = [
    { label: '주문번호', value: 'orderNumber' },
    { label: '이름', value: 'ordererName' },
    { label: '전화번호', value: 'ordererMobile' },
    { label: '배송지', value: 'address' },
  ];

  const table = useReactTable<OrdersListItem>({
    data: orders || [],
    columns: ordersColumns(),
    state: { pagination, sorting, columnFilters, globalFilter: debouncedSearchValue },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(searchColumn);
      if (cellValue === undefined || cellValue === null) return false;
      if (typeof cellValue === 'number') {
        return cellValue.toString().includes(filterValue);
      }
      return (cellValue || '').toString().toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <TableContainer
      title="주문관리"
      table={table}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="주문이 없습니다."
      rowWrapper={(cell, row, key) => (
        <OrderDialog key={key} no={row.no}>
          {cell}
        </OrderDialog>
      )}
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

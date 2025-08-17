import { createFileRoute } from '@tanstack/react-router';
import { orderRoundColumns, type OrderRoundListItem } from '@/data/columns/order-rounds-columns';
import { useOrderRoundsQuery } from '@/hooks/use-order-round';
import OrderRoundCreateDialog from '@/components/order-round/order-round-create-dialog';
import OrderRoundModifyDialog from '@/components/order-round/order-round-modify-dialog';
import { TableContainer } from '@/components/ui/table-container';
import { useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import { useDebounce } from '@/utils/debounce';
import { TableSearchBar } from '@/components/ui/table-search-bar';

export const Route = createFileRoute('/dashboard/orderRound/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: orderRounds, isLoading, isError } = useOrderRoundsQuery();

  const [sorting, setSorting] = useState<SortingState>([{ id: 'cell-no', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchValue, setSearchValue] = useState('');
  const [searchColumn, setSearchColumn] = useState<string>('name');
  const debouncedSearchValue = useDebounce(searchValue, 200);

  const searchColumns = [
    { label: '이름', value: 'name' },
    { label: '판매리스트', value: 'orderRoundBreads' },
  ];

  console.log(orderRounds);
  const table = useReactTable<OrderRoundListItem>({
    data: orderRounds || [],
    columns: orderRoundColumns(),
    state: { pagination, sorting, columnFilters, globalFilter: debouncedSearchValue },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const lowerFilter = (filterValue || '').toString().toLowerCase();

      if (searchColumn === 'name') {
        return row.original.name.toLowerCase().includes(lowerFilter);
      }

      if (searchColumn === 'orderRoundBreads') {
        const breads = row.original.orderRoundBreads.map((b) => b.name.toLowerCase()).join(' ');
        return breads.includes(lowerFilter);
      }

      return false;
    },
  });

  return (
    <TableContainer
      title="주문차수"
      table={table}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="주문차수를 등록해주세요."
      createDialog={<OrderRoundCreateDialog />}
      rowWrapper={(cell, row, key) => (
        <OrderRoundModifyDialog key={key} no={row.no}>
          {cell}
        </OrderRoundModifyDialog>
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

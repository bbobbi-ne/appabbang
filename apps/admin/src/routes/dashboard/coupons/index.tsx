import { createFileRoute } from '@tanstack/react-router';
import { TableContainer } from '@/components/ui/table-container';
import { useCouponsQuery } from '@/hooks/use-coupon';
import { couponsColumns, type CouponsListItem } from '@/data/columns/coupons-columns';
import { CouponCreateDialog } from '@/components/coupons/coupon-create-dialog';
import { CouponModifyDialog } from '@/components/coupons/coupon-modify-dialog';
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
import { useDebounce } from '@appabbang/utils';

import { TableSearchBar } from '@/components/ui/table-search-bar';

export const Route = createFileRoute('/dashboard/coupons/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: coupons, isLoading, isError } = useCouponsQuery();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 200);
  const searchColumns = [{ label: '쿠폰명', value: 'name' }];

  const table = useReactTable<CouponsListItem>({
    data: coupons || [],
    columns: couponsColumns(),
    state: { pagination, sorting, columnFilters, globalFilter: debouncedSearchValue },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const cellValue = row.getValue('name');
      if (!cellValue) return false;
      return cellValue.toString().toLowerCase().includes(filterValue.toLowerCase());
    },
  });
  return (
    <TableContainer
      title="쿠폰관리"
      table={table}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="등록된쿠폰이 없습니다."
      createDialog={<CouponCreateDialog />}
      rowWrapper={(cell, row, key) => (
        <CouponModifyDialog key={key} no={row.no}>
          {cell}
        </CouponModifyDialog>
      )}
      searchBar={
        <TableSearchBar
          columns={searchColumns}
          value={searchValue}
          column={'name'}
          onValueChange={setSearchValue}
        />
      }
    />
  );
}

import { TableContainer } from '@/components/ui/table-container';
import { BreadsColumns, type BreadListItem } from '@/data/columns/bread-columns';
import { BreadCreateDialog } from '@/components/breads/bread-create-dialog';
import { BreadModifyDialog } from '@/components/breads/bread-modify-dialog';
import { useDeleteBreadMutation, useGetBreadsQuery } from '@/hooks/use-breads';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { TableSearchBar } from '@/components/ui/table-search-bar';
import { useDebounce } from '@appabbang/utils';

export const Route = createFileRoute('/dashboard/breads/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: breads, isError, isLoading } = useGetBreadsQuery();
  const { deleteBread } = useDeleteBreadMutation();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'no', desc: true }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchColumn, setSearchColumn] = useState<string>('name');
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 200);

  const searchColumns = [
    { label: '메뉴명', value: 'name' },
    { label: '단가', value: 'unitPrice' },
    { label: '알레르기 정보', value: 'allergyInfo' },
    { label: '원산지 정보', value: 'countryOfOrigin' },
  ];

  const table = useReactTable<BreadListItem>({
    data: breads || [],
    columns: BreadsColumns(),
    state: { pagination, sorting, globalFilter: debouncedSearchValue },
    onSortingChange: setSorting,
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
      title="빵관리"
      table={table}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="빵을 등록해주세요."
      createDialog={<BreadCreateDialog />}
      rowWrapper={(cell, row, key) => (
        <BreadModifyDialog key={key} no={row.no}>
          {cell}
        </BreadModifyDialog>
      )}
      enableRowSelection
      onDeleteSelected={(ids) => deleteBread({ noList: ids })}
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

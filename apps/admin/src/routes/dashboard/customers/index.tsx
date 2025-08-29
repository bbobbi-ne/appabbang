import { TableContainer } from '@/components/ui/table-container';
import { TableSearchBar } from '@/components/ui/table-search-bar';
import TableSkeleton from '@/components/ui/table-skeletion';
import { customersColumns, type CustomersListItem } from '@/data/columns/customers-columns';
import { useGetCustomersQuery } from '@/hooks/use-customer';
import { useDebounce } from '@appabbang/utils';
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
import React, { useState } from 'react';

export const Route = createFileRoute('/dashboard/customers/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'createdAt', desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const { data: customers, isLoading, isError } = useGetCustomersQuery();
  const [searchColumn, setSearchColumn] = useState<string>('id');
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 200);
  const columns = customersColumns();

  const table = useReactTable<CustomersListItem>({
    data: customers || [],
    columns,
    state: {
      pagination,
      sorting,
      globalFilter: debouncedSearchValue,
      columnFilters,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(searchColumn);

      // 주소 컬럼일 때는 row.original.address에서 찾아 문자열로 만들기
      if (searchColumn === 'defaultAddressNo') {
        const defaultAddressNo = row.getValue('defaultAddressNo');
        const defaultAddress = row.original.address?.find((addr) => addr.no === defaultAddressNo);

        if (!defaultAddress) return false;

        // 주소 + 상세주소 + 우편번호 합쳐서 문자열 검색
        const addressString =
          `${defaultAddress.address} ${defaultAddress.addressDetail} ${defaultAddress.zipcode}`.toLowerCase();
        return addressString.includes(filterValue.toLowerCase());
      }

      if (cellValue === undefined || cellValue === null) return false;

      if (typeof cellValue === 'number') {
        return cellValue.toString().includes(filterValue);
      }

      return (cellValue || '').toString().toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  const searchColumns = [
    { label: 'ID', value: 'id' },
    { label: '이름', value: 'name' },
    { label: '휴대폰번호	', value: 'mobileNumber' },
    { label: '기본배송지', value: 'defaultAddressNo' },
  ];

  if (isLoading) return <TableSkeleton />;
  if (isError) return <>에러임</>;

  return (
    <>
      <TableContainer
        title="고객관리"
        table={table}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="등록된 고객이 없습니다."
        enableRowSelection
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
    </>
  );
}

import type { CustomersListData } from '@/api/data-contracts';
import { Button, Checkbox } from '@appabbang/ui';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { formatIsoToDate } from '@appabbang/utils';
import { renderSortButton } from '@/components/ui/rebder-sort-button';

export type CustomersListItem = CustomersListData[number];

export const customersColumns = () => {
  const columnHelper = createColumnHelper<CustomersListItem>();

  const columns: ColumnDef<CustomersListItem, any>[] = [
    columnHelper.accessor('no', {
      maxSize: 1,
      header: ({ column }) => renderSortButton(column, '번호'),
      cell: (info) => {
        const index = info.table.getPrePaginationRowModel().rows.length - info.row.index;
        return <p className="text-center">{index}</p>;
      },
    }),
    columnHelper.accessor('id', {
      maxSize: 3,
      header: () => (
        <Button className="p-0" variant="ghost">
          ID
        </Button>
      ),
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
    }),

    columnHelper.accessor('name', {
      maxSize: 1,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          이름
        </Button>
      ),
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),

    columnHelper.accessor('mobileNumber', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          휴대폰번호
        </Button>
      ),
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('defaultAddressNo', {
      maxSize: 5,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          기본배송지
        </Button>
      ),
      cell: (info) => {
        const defaultAddressNo = info.getValue();
        const defaultAddress = info.row.original.address
          ? info.row.original.address.find((adress) => adress.no === defaultAddressNo)
          : undefined;

        if (defaultAddress) {
          const { zipcode, address, addressDetail } = defaultAddress;

          return (
            <p>
              [{zipcode}] {address},{addressDetail}
            </p>
          );
        }

        return <p></p>;
      },
    }),

    columnHelper.accessor('createdAt', {
      maxSize: 3,
      header: ({ column }) => renderSortButton(column, '가입일'),
      cell: (info) => {
        const createdAt = formatIsoToDate(info.getValue());

        return <p>{createdAt}</p>;
      },
    }),
  ];

  return columns;
};

// 고객 테이블 컬럼 정의
export const couponTableCustomerColumns = () => {
  const columnHelper = createColumnHelper<CustomersListItem>();

  const columns: ColumnDef<CustomersListItem, any>[] = [
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
        <div className="flex justify-center">
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

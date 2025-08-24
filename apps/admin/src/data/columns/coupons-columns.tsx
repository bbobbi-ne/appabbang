import { Button } from '@appabbang/ui';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { formatCurrencyKR, formatDateTime } from '@appabbang/utils';
import type { CouponsListData } from '@/api/data-contracts';
import { useNavigate } from '@tanstack/react-router';
import { renderSortButton } from '@/components/ui/rebder-sort-button';

export type CouponsListItem = CouponsListData[number];

export const couponsColumns = () => {
  const columnHelper = createColumnHelper<CouponsListItem>();
  const naviage = useNavigate();

  const columns: ColumnDef<CouponsListItem, any>[] = [
    columnHelper.display({
      id: 'cell-no',
      maxSize: 1,
      header: () => <p>번호</p>,
      cell: (info) => {
        const index = info.table.getPrePaginationRowModel().rows.length - info.row.index;
        return <p className="text-center">{index}</p>;
      },
    }),
    columnHelper.accessor('name', {
      maxSize: 3,
      header: () => <p>쿠폰명</p>,
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('amount', {
      maxSize: 1,
      header: ({ column }) => renderSortButton(column, '쿠폰금액'),
      cell: (info) => {
        return <p>{formatCurrencyKR(info.getValue())} 원</p>;
      },
    }),
    columnHelper.accessor('expireAfterDays', {
      maxSize: 1,
      header: ({ column }) => renderSortButton(column, '쿠폰만료일'),
      cell: (info) => {
        return <p className="text-center">{info.getValue()} 일</p>;
      },
    }),
    columnHelper.accessor('createdAt', {
      maxSize: 3,
      header: ({ column }) => renderSortButton(column, '등록일'),
      cell: (info) => {
        return <p>{formatDateTime(info.getValue())}</p>;
      },
    }),
    columnHelper.accessor('updatedAt', {
      maxSize: 3,
      header: ({ column }) => renderSortButton(column, '수정일'),
      cell: (info) => {
        return <p>{formatDateTime(info.getValue())}</p>;
      },
    }),
    columnHelper.display({
      id: 'actions',
      maxSize: 1,
      header: '발급',
      cell: (info) => (
        <div className="w-full" onClick={(e) => e.preventDefault()}>
          <Button onClick={() => naviage({ to: `/dashboard/coupons/${info.row.original.no}` })}>
            발급
          </Button>
        </div>
      ),
    }),
  ];

  return columns;
};

import type { BreadsListData } from '@/api/data-contracts';
import { AspectRatio, Button, Checkbox } from '@appabbang/ui';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { SortAsc, SortDesc } from 'lucide-react';
import { formatDate } from '@appabbang/utils';
import { renderSortButton } from '@/components/ui/rebder-sort-button';

export type BreadListItem = BreadsListData[number];

export const BreadsColumns = () => {
  const columnHelper = createColumnHelper<BreadListItem>();

  const columns: ColumnDef<BreadListItem, any>[] = [
    columnHelper.display({
      id: 'select',
      maxSize: 1,
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
        <div onClick={(e) => e.preventDefault()}>
          <Checkbox
            className="w-5 h-5"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
    }),

    columnHelper.accessor('no', {
      maxSize: 1,
      header: ({ column }) => renderSortButton(column, '번호'),
      cell: (info) => {
        const index = info.table.getPrePaginationRowModel().rows.length - info.row.index;
        return <p className="text-center">{index}</p>;
      },
    }),

    columnHelper.accessor('images', {
      maxSize: 3,
      header: '대표이미지',
      cell: ({ row }) => {
        const url = (row.getValue('images') as { url: string }[]) || [];
        const src = url[0]?.url
          ? url[0].url
          : 'https://cdn.imweb.me/upload/S202206178ecd8851ac794/cd0f057a7035b.jpg';

        return (
          <AspectRatio ratio={9 / 5}>
            <img
              src={src}
              alt={row.original.name}
              className="h-full w-full rounded-lg object-fill"
            />
          </AspectRatio>
        );
      },
    }),

    columnHelper.accessor('name', {
      maxSize: 3,
      header: ({ column }) => renderSortButton(column, '메뉴명'),
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as string;
        return value.toLowerCase().includes(filterValue.toLowerCase());
      },
    }),

    columnHelper.accessor('unitPrice', {
      maxSize: 1,
      header: ({ column }) => {
        const isSorted = column.getIsSorted() === 'asc';
        return (
          <Button
            className={`p-0 ${isSorted ? 'text-blue-500' : ''} hover:text-primary`}
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {isSorted ? <SortAsc /> : <SortDesc />} 단가
          </Button>
        );
      },
      cell: (info) => (
        <p>{new Intl.NumberFormat('ko-KR', { currency: 'KRW' }).format(info.getValue())}원</p>
      ),
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number;
        return value.toString().includes(filterValue);
      },
    }),

    columnHelper.accessor('allergyInfo', {
      maxSize: 5,
      header: '알레르기 정보',
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue() || '없음'}</p>
      ),
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as string;
        return (value || '').toLowerCase().includes(filterValue.toLowerCase());
      },
    }),

    columnHelper.accessor('countryOfOrigin', {
      maxSize: 5,
      header: '원산지 정보',
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as string;
        return (value || '').toLowerCase().includes(filterValue.toLowerCase());
      },
    }),

    columnHelper.accessor('description', {
      maxSize: 5,
      header: '설명',
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
    }),

    columnHelper.accessor('createdAt', {
      maxSize: 2,
      header: '등록일자',
      cell: (info) => (
        <p className="line-clamp-2 whitespace-normal break-words">
          {formatDate(new Date(info.getValue()))}
        </p>
      ),
    }),

    columnHelper.accessor('updatedAt', {
      maxSize: 2,
      header: '최근 수정일',
      cell: (info) => (
        <p className="line-clamp-2 whitespace-normal break-words">
          {formatDate(new Date(info.getValue()))}
        </p>
      ),
    }),
  ];

  return columns;
};

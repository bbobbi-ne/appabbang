import type { OrderRoundListData } from '@/api/data-contracts';
import { AspectRatio, Button } from '@appabbang/ui';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { SortAsc, SortDesc } from 'lucide-react';
import { formatIsoToDateTime } from '@/utils/format';

export type OrderRoundListItem = OrderRoundListData[number];

export const orderRoundColumns = () => {
  const columnHelper = createColumnHelper<OrderRoundListItem>();

  const columns: ColumnDef<OrderRoundListItem, any>[] = [
    columnHelper.display({
      id: 'cell-no',
      maxSize: 1,
      header: ({ column }) => {
        const isSorted = column.getIsSorted() === 'asc';
        return (
          <Button
            className={`p-0 ${isSorted ? 'text-blue-500' : ''} hover:text-primary gap-0`}
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {isSorted ? <SortAsc /> : <SortDesc />} 번호
          </Button>
        );
      },
      cell: (info) => {
        const index = info.table.getPrePaginationRowModel().rows.length - info.row.index;
        return <p className="text-center">{index}</p>;
      },
    }),
    columnHelper.accessor('image', {
      maxSize: 2,
      header: ({ column }) => <p>주문차수 이미지</p>,
      cell: (info) => {
        const src = info.getValue()[0]
          ? info.getValue()[0].url
          : 'https://cdn.imweb.me/upload/S202206178ecd8851ac794/cd0f057a7035b.jpg';

        return (
          <AspectRatio ratio={9 / 5}>
            <img
              src={src}
              alt={info.row.original.name}
              className="h-full w-full rounded-lg object-fill"
            />
          </AspectRatio>
        );
      },
    }),
    columnHelper.accessor('no', {
      maxSize: 1,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          주문차수
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('name', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          이름
        </Button>
      ),
      cell: (info) => {
        return <p>{info.getValue()}</p>;
      },
    }),

    columnHelper.accessor('orderRoundBreads', {
      maxSize: 6,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          판매리스트
        </Button>
      ),
      cell: (info) => {
        const names = info
          .getValue()
          .map((item: any) => item.name)
          .join(', ');
        return <p className="line-clamp-2 whitespace-normal break-words">{names}</p>;
      },
    }),
    columnHelper.accessor('startedAt', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          시작일자
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{formatIsoToDateTime(info.getValue())}</p>;
      },
    }),
    columnHelper.accessor('endedAt', {
      maxSize: 3,
      header: ({ column }) => (
        <Button className="p-0" variant="ghost">
          종료일자
        </Button>
      ),
      cell: (info) => {
        return <p className="text-center">{formatIsoToDateTime(info.getValue())}</p>;
      },
    }),
  ];

  return columns;
};

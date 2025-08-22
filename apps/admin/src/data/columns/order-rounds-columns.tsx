import type { OrderRoundListData } from '@/api/data-contracts';
import { AspectRatio, Button } from '@appabbang/ui';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { formatIsoToDateTime } from '@/utils/format';
import { renderSortButton } from '@/components/ui/rebder-sort-button';

export type OrderRoundListItem = OrderRoundListData[number];

export const orderRoundColumns = () => {
  const columnHelper = createColumnHelper<OrderRoundListItem>();

  const columns: ColumnDef<OrderRoundListItem, any>[] = [
    columnHelper.display({
      id: 'cell-no',
      maxSize: 1,
      header: () => <p>번호</p>,
      cell: (info) => {
        const index = info.table.getPrePaginationRowModel().rows.length - info.row.index;
        return <p className="text-center">{index}</p>;
      },
    }),
    columnHelper.accessor('image', {
      maxSize: 1,
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
      header: ({ column }) => renderSortButton(column, '주문차수'),
      cell: (info) => <p>{info.getValue()}</p>,
      sortingFn: (rowA, rowB) => rowA.original.no - rowB.original.no,
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

    columnHelper.accessor('orderRoundBreads', {
      maxSize: 2,
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
      maxSize: 2,
      header: ({ column }) => renderSortButton(column, '시작일시'),
      cell: (info) => <p>{formatIsoToDateTime(info.getValue())}</p>,
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.startedAt).getTime() - new Date(rowB.original.startedAt).getTime(),
    }),
    columnHelper.accessor('endedAt', {
      maxSize: 3,
      header: ({ column }) => renderSortButton(column, '종료일시'),
      cell: (info) => <p>{formatIsoToDateTime(info.getValue())}</p>,
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.endedAt).getTime() - new Date(rowB.original.endedAt).getTime(),
    }),
  ];

  return columns;
};

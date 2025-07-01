import {
  useDeleteBreadMutation,
  useUpdateBreadMutation,
  useBreadStatus,
  useUpdateBreadStatusMutation,
} from '@/hooks/use-breads';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AspectRatio,
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@appabbang/ui';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

export interface BreadsColumns {
  no: number;
  name: string;
  description: string;
  unitPrice: number;
  breadStatus: any;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
  image: string[] | string;
}

export const columnHelper = createColumnHelper<BreadsColumns>();

export const BreadsColumns = () => {
  const { data: breadStatus } = useBreadStatus();
  const { deleteBreadMutation } = useDeleteBreadMutation();
  const { updateBreadStatusMutation } = useUpdateBreadStatusMutation();
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const columns: ColumnDef<BreadsColumns, any>[] = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <div className="flex justify-center">
          <Checkbox
            className=""
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
    }),

    columnHelper.accessor('no', {
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          번호 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        return info.getValue();
      },
    }),

    columnHelper.accessor('name', {
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          메뉴명 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue('name'),
    }),

    columnHelper.accessor('description', {
      header: '설명',
      cell: (info) => (
        <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>
      ),
    }),

    columnHelper.accessor('unitPrice', {
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          단가 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(
          info.getValue(),
        ),
    }),

    columnHelper.accessor('image', {
      header: '대표이미지',
      cell: ({ row }) => (
        <AspectRatio>
          <img
            src={
              row.getValue('image') ||
              'https://res.cloudinary.com/appabbang/image/upload/v1750588032/breads/nfaxnkenijts73eglojy.jpg'
            }
            alt={row.original.name}
            className="h-full w-full rounded-lg object-cover"
          />
        </AspectRatio>
      ),
    }),

    columnHelper.accessor('breadStatus', {
      header: ({ column }) => {
        const rawValue = column.getFilterValue();
        const value = typeof rawValue === 'string' ? rawValue : 'all';

        return (
          <Select
            value={value}
            onValueChange={(val) => {
              column.setFilterValue(val === 'all' ? undefined : val);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {breadStatus?.map(({ name, code }) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },

      cell: (info) => {
        const value = info.getValue();
        const found = breadStatus?.find((item) => item.code === value);
        const no = info.row.original.no;

        return (
          <Select
            value={value}
            onValueChange={(val) => {
              console.log(val);
              updateBreadStatusMutation({ no, breadStatus: val });
            }}
          >
            <SelectTrigger>
              <SelectValue>{found?.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {breadStatus?.map(({ name, code }) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },

      filterFn: (row, columnId, filterValue) => {
        const columnValue = breadStatus?.find((item) => item.code === row.getValue(columnId));
        return columnValue?.code === filterValue;
      },

      enableSorting: true,
    }),

    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          생성일 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="line-clamp-2 whitespace-normal break-words text-center">
          {new Intl.DateTimeFormat('ko-KR', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(info.getValue()))}
        </div>
      ),
    }),

    columnHelper.accessor('updatedAt', {
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          최근 수정일 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="line-clamp-2 whitespace-normal break-words text-center">
          {new Intl.DateTimeFormat('ko-KR', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(info.getValue()))}
        </div>
      ),
    }),

    columnHelper.display({
      id: 'delete',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <AlertDialog
            open={alertOpen}
            onOpenChange={(open) => {
              setAlertOpen(open);
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant={'destructive'}
                onClick={(e) => {
                  e.preventDefault();
                  setAlertOpen(true);
                }}
              >
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.preventDefault()}>
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>삭제시 복구가 어렵습니다.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setAlertOpen(false)}>취소</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBreadMutation([row.original.no])}>
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    }),
  ];

  return columns;
};

import {
  AspectRatio,
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@appabbang/ui';
import { faker } from '@faker-js/faker/locale/ko';
import { faker as fakerEn } from '@faker-js/faker';

import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export type Breads = {
  no: number;
  name: string;
  description: string;
  unit_price: number;
  image_url: string;
  bread_status: number;
  updated_at: Date;
};

// ✅ 길이만큼 숫자 배열 생성
const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

// ✅ 단일 빵 데이터 생성 함수
const newBread = (no: number): Breads => {
  return {
    no,
    name: faker.person.fullName() + '빵',
    description: fakerEn.food.description(),
    unit_price: parseFloat(faker.commerce.price({ min: 1000, max: 20000 })),
    image_url:
      faker.image.urlLoremFlickr({
        category: faker.helpers.arrayElement(['people', 'nature', 'city', 'food']),
        width: faker.number.int({ min: 300, max: 500 }),
        height: faker.number.int({ min: 200, max: 400 }),
      }) + `?lock=${faker.string.uuid()}`,
    bread_status: faker.number.int({ min: 0, max: 2 }), // 예: 0: 품절, 1: 판매중, 2: 준비중
    updated_at: faker.date.recent({ days: 10 }),
  };
};

// ✅ 전체 빵 목록 생성
export function makeBreadsData(len: number): Breads[] {
  return range(len).map((i) => newBread(i + 1)); // no는 1부터 시작
}

const columnHelper = createColumnHelper<Breads>();

export const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className="mr-2"
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
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
    cell: (info) => <p className="line-clamp-3 whitespace-normal break-words">{info.getValue()}</p>,
  }),

  columnHelper.accessor('unit_price', {
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

  columnHelper.accessor('image_url', {
    header: '대표이미지',
    cell: ({ row }) => (
      <AspectRatio>
        <img
          src={row.getValue('image_url')}
          alt={row.original.name}
          className="h-full w-full rounded-lg object-cover"
        />
      </AspectRatio>
    ),
  }),

  columnHelper.accessor('bread_status', {
    header: ({ column }) => {
      const rawValue = column.getFilterValue();
      const value = typeof rawValue === 'number' ? String(rawValue) : '';

      return (
        <Select
          value={value}
          onValueChange={(val) => {
            column.setFilterValue(val === '' ? undefined : Number(val));
          }}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">품절</SelectItem>
            <SelectItem value="1">판매중</SelectItem>
            <SelectItem value="2">준비중</SelectItem>
          </SelectContent>
        </Select>
      );
    },

    cell: (info) => {
      const status = info.getValue();
      if (status === 0) return '품절';
      if (status === 1) return '판매중';
      if (status === 2) return '준비중';
      return '-';
    },

    filterFn: (row, columnId, filterValue) => {
      return row.getValue(columnId) === filterValue;
    },

    enableSorting: true,
  }),

  columnHelper.accessor('updated_at', {
    header: ({ column }) => (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        최근 수정일 <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: (info) =>
      new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(info.getValue())),
  }),
];

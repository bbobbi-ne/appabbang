import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@appabbang/ui';
import { type ChangeEvent, type FC, useEffect } from 'react';

interface TableSearchBarProps {
  columns?: { label: string; value: string }[];
  value: string;
  column: string;
  onValueChange: (val: string) => void;
  onColumnChange?: (col: string) => void;
  placeholder?: string;
}

export const TableSearchBar: FC<TableSearchBarProps> = ({
  columns = [],
  value,
  column,
  onValueChange,
  onColumnChange,
  placeholder = '검색...',
}) => {
  useEffect(() => {
    const firstColumnValue = columns?.[0]?.value;
    if (columns.length === 1 && firstColumnValue && onColumnChange) {
      onColumnChange(firstColumnValue);
    }
  }, [columns, onColumnChange]);

  return (
    <div className="flex items-center gap-2 py-6">
      {columns.length > 1 ? (
        <Select value={column} onValueChange={(val) => onColumnChange?.(val)}>
          <SelectTrigger>
            <SelectValue placeholder="검색 컬럼 선택" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col.value} value={col.value}>
                {col.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : columns.length === 1 ? (
        <p className="border-input rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none">
          {columns[0]?.label}
        </p>
      ) : null}

      <Input
        className="h-9"
        placeholder={placeholder}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value)}
      />
    </div>
  );
};

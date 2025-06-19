import {
  Button,
  Input,
  Pagination,
  PaginationContent,
  PaginationItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@appabbang/ui';
import type { Table } from '@tanstack/react-table';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';

export function TablePagination({ table }: { table: Table<any> }) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  return (
    <>
      <Pagination className="justify-normal">
        <PaginationContent>
          <Input className="absolute w-[150px] left-[-150px] " />
          {/* 처음 */}
          <PaginationItem>
            <Button
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => table.setPageIndex(0)}
            >
              <ChevronsLeft />
            </Button>
          </PaginationItem>

          {/* 이전 */}
          <PaginationItem>
            <Button
              variant="outline"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft />
            </Button>
          </PaginationItem>

          {/* 다음 */}
          <PaginationItem>
            <Button
              variant="outline"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <ChevronRight />
            </Button>
          </PaginationItem>

          {/* 끝 */}
          <PaginationItem>
            <Button
              variant="outline"
              disabled={currentPage === pageCount - 1}
              onClick={() => table.setPageIndex(pageCount - 1)}
            >
              <ChevronsRight />
            </Button>
          </PaginationItem>
        </PaginationContent>
        <div className="flex items-center gap-2 px-4">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          <p>| 이동:</p>
          <Input
            className="w-16 h-auto"
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
          <Select
            defaultValue={table.getState().pagination.pageSize + ''}
            onValueChange={(e) => {
              table.setPageSize(Number(e));
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize + ''}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Pagination>
    </>
  );
}

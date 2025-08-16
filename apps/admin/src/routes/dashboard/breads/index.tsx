import { TableContainer } from '@/components/ui/table-container';
import { BreadsColumns } from '@/data/columns/bread-columns';
import { BreadCreateDialog } from '@/components/breads/bread-create-dialog';
import { BreadModifyDialog } from '@/components/breads/bread-modify-dialog';
import { useDeleteBreadMutation, useGetBreadsQuery } from '@/hooks/use-breads';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/breads/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: breads, isError, isLoading } = useGetBreadsQuery();
  const { deleteBread } = useDeleteBreadMutation();

  return (
    <TableContainer
      title="빵관리"
      columns={BreadsColumns()}
      data={breads}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="빵을 등록해주세요."
      createDialog={<BreadCreateDialog />}
      rowWrapper={(cell, row, key) => (
        <BreadModifyDialog key={key} no={row.no}>
          {cell}
        </BreadModifyDialog>
      )}
      enableRowSelection
      onDeleteSelected={(ids) => deleteBread({ noList: ids })}
    />
  );
}

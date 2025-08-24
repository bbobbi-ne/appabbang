import { Button } from '@appabbang/ui';
import { SortAsc, SortDesc } from 'lucide-react';

export const renderSortButton = (column: any, label: string) => {
  const isSorted = column.getIsSorted();
  return (
    <Button
      className={`p-0 ${isSorted ? 'text-blue-500' : ''} hover:text-primary gap-0`}
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === 'asc')}
    >
      {isSorted === 'asc' ? <SortAsc /> : <SortDesc />} {label}
    </Button>
  );
};

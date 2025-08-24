import { cn } from '@appabbang/ui';

type Props = {
  title: string;
  className?: string;
};

export default function Title({ title, className }: Props) {
  return (
    <div
      className={cn('text-primary text-2xl lg:text-4xl font-semibold text-center py-4', className)}
    >
      {title}
    </div>
  );
}

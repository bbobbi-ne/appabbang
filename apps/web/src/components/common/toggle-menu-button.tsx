import { Button, cn } from '@appabbang/ui';

// Custom CSS
const btnCssStr = `bg-white text-black hover:bg-primary hover:text-white`;

interface IToggleMenuButtonProps {
  activeMenu: string;
  onChangeActiveMenu: (value: string) => void;
  list: { label: string; value: string }[];
}

export function ToggleMenuButton({ activeMenu, onChangeActiveMenu, list }: IToggleMenuButtonProps) {
  return (
    <div className="flex flex-row gap-2 my-4 overflow-x-auto">
      {list.map((item) => (
        <Button
          key={item.value}
          onClick={() => onChangeActiveMenu(item.value)}
          className={cn('w-full', activeMenu !== item.value && btnCssStr)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}

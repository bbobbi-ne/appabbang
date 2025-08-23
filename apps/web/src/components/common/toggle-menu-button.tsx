import { Button } from '@appabbang/ui';

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
          className="w-full"
          variant={activeMenu.includes(item.value) ? 'default' : 'outline'}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}

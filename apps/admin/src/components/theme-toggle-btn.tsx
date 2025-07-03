import { useThemeStore } from '@/hooks/use-theme';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@appabbang/ui';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect } from 'react';

function ThemeToggleBtn() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="cursor-pointer w-fit"
          onClick={() => {
            toggleTheme();
            const next = useThemeStore.getState().theme;
            document.documentElement.classList.toggle('dark', next === 'dark');
          }}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </TooltipTrigger>
        <TooltipContent>{theme === 'dark' ? 'light mode' : 'dark mode'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ThemeToggleBtn;

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarStore {
  defaultOpen: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      defaultOpen: false,
      open: false,
      setOpen: (open) => set({ open }),
      toggleOpen: () => set({ open: !get().open }),
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@appabbang/ui';
import { Sidebar } from '@/components/Sidebar';

export const Route = createFileRoute('/_dashboardLayout')({
  component: DashboardLayout,
});

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}

function DashboardContent() {
  // const { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <SidebarTrigger />
      <Outlet />
    </div>
  );
}

import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  SidebarProvider,
  SidebarTrigger,
} from '@appabbang/ui';
import { useInitializeAuth } from '@/hooks/use-initialize-auth';
import { useAuthStore } from '@/stores/authStore';
import { AlertDialog } from '@appabbang/ui';
import { Sidebar } from '@/components/sidebar';
import { useBreadStatus } from '@/hooks/use-breads';

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
  const { isError, isSuccess } = useInitializeAuth();
  const { clearAccessToken, clearAuth } = useAuthStore();
  useBreadStatus();

  const navigate = useNavigate();

  const closeDialog = () => {
    clearAccessToken();
    clearAuth();
    navigate({ to: '/' });
  };

  return (
    <>
      {isError && (
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>로그인 세션이 만료되었습니다.</AlertDialogTitle>
              <AlertDialogDescription>로그인 화면으로 돌아깁니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Button onClick={closeDialog}>확인</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Sidebar />
      {isSuccess && (
        <main className="w-full p-2">
          <SidebarTrigger className="fixed" />
          <Outlet />
        </main>
      )}
    </>
  );
}

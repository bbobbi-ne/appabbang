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
import { Sidebar } from '@/components/Sidebar';
import { useInitializeAuth } from '@/hooks/useInitializeAuth';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { AlertDialog } from '@appabbang/ui';

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
  const { data, isLoading, isError, isSuccess } = useInitializeAuth();
  const { setAccessToken, clearAccessToken, setAuth, clearAuth } = useAuthStore();

  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      setAccessToken(data.accessToken);
      setAuth(data.auth);
    }
  }, [data, isSuccess]);

  const closeDialog = () => {
    clearAccessToken();
    clearAuth();
    navigate({ to: '/' });
  };

  return (
    <div className="flex min-h-screen">
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
      <SidebarTrigger />
      <Outlet />
    </div>
  );
}

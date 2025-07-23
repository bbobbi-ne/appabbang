import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroupContent,
  SidebarMenu,
  SidebarGroupLabel,
  SidebarHeader,
} from '@appabbang/ui';
import { Home, Info, Newspaper, Hamburger, ScrollText, LayoutDashboard } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

// Menu items.
const mainMenu = {
  groupNm: '소개',
  items: [
    { title: '홈', url: '/', icon: Home },
    { title: '업체소개', url: '/info/company', icon: Info },
    { title: '빵 소개', url: '/info/bread', icon: Hamburger },
    { title: '공지사항', url: '/info/notice', icon: ScrollText },
  ],
};

const orderMenu = {
  groupNm: '주문',
  items: [{ title: '빵 주문', url: '/order/form', icon: Newspaper }],
};

const mypageMenu = {
  groupNm: '마이페이지',
  items: [{ title: '대시보드', url: '/mypage', icon: LayoutDashboard }],
};

const menuList = [mainMenu, orderMenu, mypageMenu];

export default function LayoutSidebar({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="left" variant="floating">
        <SidebarHeader className="text-center m-5">아빠빵</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {menuList.map((menu) => (
              <>
                <SidebarGroupLabel>{menu.groupNm}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menu.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className="cursor-pointer"
                          onClick={() => navigate({ to: item.url })}
                        >
                          <a>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            ))}
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

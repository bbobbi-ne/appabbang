import {
  Sidebar as SidebarRoot,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@appabbang/ui';
import { Link, useRouterState } from '@tanstack/react-router';
import ThemeToggleBtn from './theme-toggle-btn';
import { HouseIcon, Receipt, Scroll, ScrollText, Store, Users } from 'lucide-react';

const items = [
  { title: '홈', url: '/dashboard', icon: <HouseIcon /> },
  { title: '빵관리', url: '/dashboard/breads', icon: <Store /> },
  { title: '주문관리', url: '/dashboard/orders', icon: <ScrollText /> },
  { title: '결제관리', url: '/dashboard/payment', icon: <Receipt /> },
  { title: '주문차수', url: '/dashboard/orderRound', icon: <Scroll /> },
  { title: '고객관리', url: '/dashboard/customers', icon: <Users /> },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SidebarRoot>
      <SidebarHeader className="font-bold">
        {/* <img
          className="w-[200px] h-[100px] rounded-lg object-fill"
          src="/images/appabbang_logo.png"
        /> */}
        ㅇㅃㅃ
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map(({ title, url, icon }) => (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton isActive={pathname.endsWith(url)} asChild>
                <Link to={url}>
                  {icon}
                  {title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggleBtn />
      </SidebarFooter>
    </SidebarRoot>
  );
}

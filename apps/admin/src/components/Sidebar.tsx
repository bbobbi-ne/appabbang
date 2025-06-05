import {
  Sidebar as SidebarRoot,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@appabbang/ui';

const items = [
  { title: 'Home', url: '/dashboard' },
  { title: '빵관리', url: '/dashboard/breads' },
  { title: '재료관리', url: '/dashboard/ingredients' },
  { title: '주문관리', url: '/dashboard/orders' },
  { title: '발주관리', url: '/dashboard/purchases' },
  { title: '고객센터', url: '/dashboard/customers' },
];

export function Sidebar() {
  return (
    <SidebarRoot>
      <SidebarHeader>
        <h1 className="--color-sidebar-primary">아빠빵</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map(({ title, url }) => (
            <SidebarMenuItem>
              <SidebarMenuButton>{title}</SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>Footer</SidebarFooter>
    </SidebarRoot>
  );
}

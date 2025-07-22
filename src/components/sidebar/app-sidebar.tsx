"use client";

import { NavUser } from "@/components/sidebar/nav-user";
import { ROUTES } from "@/components/sidebar/routes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/sidebar";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* LOGO HERE! */}</SidebarHeader>
      <SidebarContent>
        {ROUTES.navMain.map((item) => (
          <SidebarGroup key={item.title || item.items[0]?.url}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={ROUTES.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

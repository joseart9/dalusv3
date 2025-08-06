"use client";

import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/app/types/users";
import { useAuth } from "@/providers/auth-provider";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={user.first_name} />
                <AvatarFallback className="rounded-lg">
                  {user.first_name ? user.first_name.charAt(0) : ""}
                  {user.last_name ? user.last_name.charAt(0) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.first_name} {user.last_name}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={user.first_name} />
                  <AvatarFallback className="rounded-lg">
                    {user.first_name ? user.first_name.charAt(0) : ""}
                    {user.last_name ? user.last_name.charAt(0) : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex flex-row items-center gap-2 mb-2">
                    <span className="truncate font-medium">
                      {user.first_name} {user.last_name}
                    </span>
                    <Badge
                      size="sm"
                      variant={
                        user.role === "admin" ? "destructive" : "secondary"
                      }
                      className="truncate text-[0.6rem] rounded-full"
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="cursor-pointer"
              >
                <BadgeCheck />
                Configuración
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

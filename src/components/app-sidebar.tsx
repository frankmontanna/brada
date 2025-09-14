"use client";

import {
  IconBrowserX,
  IconClipboardText,
  IconHistoryToggle,
  IconHome,
  IconUsers,
} from "@tabler/icons-react";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { OperadorLogo } from "./OperadorLogo";

const data = {
  user: {
    name: "admin",
    rule: "Administrador",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Inicio",
      url: "/0perador",
      icon: IconHome,
    },
    {
      title: "Histórico",
      url: "/0perador/historico",
      icon: IconHistoryToggle,
    },
    {
      title: "Log",
      url: "/0perador/log",
      icon: IconClipboardText,
    },
  ],
  config: [
    {
      title: "Usúarios",
      url: "/0perador/usuarios",
      icon: IconUsers,
    },
    {
      title: "Cloaker",
      url: "/0perador/cloaker",
      icon: IconBrowserX,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <OperadorLogo />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Painel" items={data.navMain} />
        <NavMain label="Configurações" items={data.config} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

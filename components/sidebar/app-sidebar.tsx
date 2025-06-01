"use client"

import * as React from "react"
import { RiRobot2Fill, RiRobot2Line, RiRobotFill } from "@remixicon/react";

import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconLanguage,
  IconUsers,
  IconWriting,
  IconPencilQuestion,
  Icon,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/sidebar/nav-documents"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import NavbarLogo from "@/components/logos/NavBarLogo";
import { Separator } from "../ui/separator";

type NavItem = {
  title: string
  url: string
  icon?: Icon
  status?: "new" | "wip" | "down"
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navHome: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      status: "new"
    },
  ] as NavItem[],

  navChat: [
    {
      title: "Chat Now",
      url: "/dashboard/chat",
      icon: RiRobot2Line,
      status: "wip"
    },
  ] as NavItem[],

  navPractice: [
    {
      title: "Text Matching",
      url: "/dashboard/practice/textMatching",
      icon: IconLanguage,
      status: "wip"
    },
    {
      title: "Quiz",
      url: "/dashboard/practice/quiz", 
      icon: IconPencilQuestion,
      status: "wip"
    },
    {
      title: "Speaking Exercise",
      url: "/dashboard/practice/speaking",
      icon: IconLanguage,
      status: "down"
    }
  ] as NavItem[],

  navLearn: [
    {
      title: "Learn to Speak",
      url: "/dashboard/learn/speak",
      icon: IconListDetails,
      status: "down"
    },
    {
      title: "Learn to Write", 
      url: "/dashboard/learn/write",
      icon: IconWriting,
      status: "down"
    },
  ] as NavItem[],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex flex-col items-center justify-center p-6">
                <NavbarLogo />
              </div>
            </SidebarMenuButton>
            <SidebarMenuButton>
              <span className="text-xl font-semibold text-center w-full">
                Conversational AI
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className="my-2" />
      <SidebarContent className="px-2 py-4">
        <NavMain items={data.navHome} category="Summary" />
        <NavMain items={data.navChat} category="Chat" />
        <NavMain items={data.navLearn} category="Learn Now" />
        <NavMain items={data.navPractice} category="Practice" />
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <SidebarGroupLabel>Profile</SidebarGroupLabel>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
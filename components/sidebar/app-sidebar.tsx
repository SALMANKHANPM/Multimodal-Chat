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

import  NavbarLogo  from "@/components/logos/NavBarLogo";
import { Separator } from "../ui/separator";

// Define the NavItem type
type NavItem = {
  title: string
  url: string
  icon?: Icon
  status?: "new" | "wip" | "down"
}

// Then update your data object to use this type
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
      title : "Quiz",
      url: "/dashboard/practice/quiz",
      icon: IconPencilQuestion,
      status: "wip"
    },
    {
      title : "Speaking Exercise",
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
  ]as NavItem[],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              
            >
              <div className="flex flex-col items-center justify-center p-10">
              <NavbarLogo/>

              </div>

            </SidebarMenuButton>
           
            <SidebarMenuButton>
            <span className="text-bold font-italic text-xl font-semibold pl-8">Conversational AI</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-2">
        <NavMain items={data.navHome} category="Summary" />
        <NavMain items={data.navChat} category="Chat" />
        <NavMain items={data.navLearn} category="Learn Now" />
        <NavMain items={data.navPractice} category="Practice" />


        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
      <SidebarGroupLabel>Profile</SidebarGroupLabel>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

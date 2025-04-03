"use client"

import { IconCircleCheckFilled ,type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import StatusBadge from "../ui/status-badge"

export function NavMain({
  items,
  category


}: {
  items: {
    title: string
    url: string
    icon?: Icon
    status?: "new" | "wip" | "down"
  }[]
  category?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{category}</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="">
          {items.map((item) => {
            const isActive = pathname === item.url
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  className={cn(
                    "flex items-center justify-between gap-2 text-base font-medium rounded-md border px-3 py-2 transition-all duration-200",
                    isActive 
                      ? "hover:text-orange-900 border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300" 
                      : "hover:text-orange-900 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  tooltip={item.title} 
                  onClick={() => router.push(item.url)}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className={cn("h-5 w-10", isActive && "text-orange-500")} />}
                    <span>{item.title}</span>
                  </div>
                  {item.status && <StatusBadge fStatus={item.status} />}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

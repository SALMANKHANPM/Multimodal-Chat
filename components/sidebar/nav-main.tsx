"use client"

import { IconCircleCheckFilled, type Icon } from "@tabler/icons-react"
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
    <SidebarGroup className="mb-4">
      <SidebarGroupLabel className="px-3 mb-2 text-sm font-medium text-muted-foreground">
        {category}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => router.push(item.url)}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />}
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
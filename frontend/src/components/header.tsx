"use client"

import { PanelLeft } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center border-b px-4">
      <SidebarTrigger className="-ml-1">
        <PanelLeft className="size-4" />
      </SidebarTrigger>
      <Separator orientation="vertical" className="mr-2 h-4" />
    </header>
  )
}

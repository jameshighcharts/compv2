"use client"

import { useTheme } from "next-themes"
import { IconSearch, IconSun, IconMoon } from "@tabler/icons-react"
import { PanelLeft } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1">
        <PanelLeft className="size-4" />
      </SidebarTrigger>
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex w-full justify-between">
        <Button
          variant="outline"
          className="relative h-9 w-fit justify-start gap-2 rounded-md px-3 text-sm text-muted-foreground"
        >
          <IconSearch className="size-4" />
          <span>Search</span>
          <kbd className="pointer-events-none ml-4 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <IconSun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <IconMoon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}

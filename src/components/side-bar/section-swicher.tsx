"use client";

import * as React from "react";
import {  Plus, Settings2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SectionSwitcher({
  items,
}: {
items: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const [activeTeam, setActiveTeam] = React.useState(items[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu className=" ">
      <SidebarMenuItem >
        <DropdownMenu >
          <DropdownMenuLabel> Sector</DropdownMenuLabel>
          <DropdownMenuTrigger asChild >

            <SidebarMenuButton size="lg" asChild>
              <a href="#" >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold"> {activeTeam.name}</span>
                  <span className="truncate text-xs">Plasticos Carmen</span>
                </div>
                <div className="ml-auto">
                <span onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => e.stopPropagation()} // Detenemos la propagación del foco

                    >
                <Settings2 className="opacity-80 size-4" />
                </span>
                
              </div>
              </a>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="center"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Sectores
            </DropdownMenuLabel>
            {items.map((item, index) => (
              <DropdownMenuItem
                key={item.name}
                onClick={() => setActiveTeam(item)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <item.logo className="size-4 shrink-0" />
                </div>
                {item.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add item</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

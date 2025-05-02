import {
  AlarmSmoke,
  AlignVerticalDistributeEnd,
  BaggageClaim,
  Bubbles,
  Command,
  CupSoda,
  Settings2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {ISector} from "@/utils/interfaces";
import {useContext, useEffect} from "react";
import {SectorContext} from "@/providers/sector-provider";

export function SectorSidebar({items}: {items: ISector[]}) {
  const {sector, setSector} = useContext(SectorContext);
  useEffect(() => {
    setSector(items[0]);
  }, []);

  const icon = (id: number) => {
    return (
      <>
        {id === 1 ? (
          <Bubbles className="size-4" />
        ) : id === 2 ? (
          <AlarmSmoke className="size-4" />
        ) : id === 3 ? (
          <AlignVerticalDistributeEnd className="size-4" />
        ) : id === 4 ? (
          <BaggageClaim className="size-4" />
        ) : id === 5 ? (
          <CupSoda className="size-4" />
        ) : (
          <Command className="size-4" />
        )}
      </>
    );
  };

  if (!sector) {
    return null;
  }

  return (
    <SidebarMenu className=" ">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuLabel className="text-sidebar-foreground/70"> Sector</DropdownMenuLabel>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {icon(sector.id as number)}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold"> {sector.name}</span>
                  <span className="truncate text-xs">Plasticos Carmen</span>
                </div>
                <div className="ml-auto">
                  <span
                    onClick={(e) => e.stopPropagation()}
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
            align="start"
            side="right"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Sectores
            </DropdownMenuLabel>
            {items.map((item, index) => (
              <DropdownMenuItem key={index} onClick={() => setSector(item)} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {icon(item.id as number)}
                </div>
                {item.name}
                <DropdownMenuShortcut>Id: {item.id}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

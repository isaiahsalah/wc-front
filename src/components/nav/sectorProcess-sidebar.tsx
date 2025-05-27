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
import {ISectorProcess} from "@/utils/interfaces";
import {useContext, useEffect} from "react";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";

export function SectorProcessSidebar({sectorProcesses}: {sectorProcesses: ISectorProcess[]}) {
  const {sectorProcess, setSectorProcess} = useContext(SectorProcessContext);
  useEffect(() => {
    const storedProcess = window.localStorage.getItem("process-app");
    if (storedProcess) {
      const parsedProcess = JSON.parse(storedProcess) as ISectorProcess;
      const foundProcess = sectorProcesses.find((item) => item.id === parsedProcess.id);
      if (foundProcess) {
        setSectorProcess(foundProcess);
        return;
      }
    }
    setSectorProcess(sectorProcesses[0]);
  }, []);

  const onChangeSectorProcess = (item: ISectorProcess) => {
    window.localStorage.setItem("process-app", JSON.stringify(item));

    setSectorProcess(item);
  };

  const icon = (id: number) => {
    return (
      <>
        {id === 1 ? (
          <Bubbles className="size-3" />
        ) : id === 2 ? (
          <AlarmSmoke className="size-3" />
        ) : id === 3 ? (
          <AlignVerticalDistributeEnd className="size-3" />
        ) : id === 4 ? (
          <BaggageClaim className="size-3" />
        ) : id === 5 ? (
          <CupSoda className="size-3" />
        ) : (
          <Command className="size-3" />
        )}
      </>
    );
  };

  if (!sectorProcess) {
    return null;
  }

  return (
    <SidebarMenu className=" ">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="default" asChild>
              <a href="#">
                <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  {icon(sectorProcess?.process?.id as number)}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold"> {sectorProcess?.process?.name}</span>
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
              Procesos
            </DropdownMenuLabel>
            {sectorProcesses.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => onChangeSectorProcess(item)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {icon(item.id as number)}
                </div>
                {item.process?.name}
                <DropdownMenuShortcut>Id: {item.id}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

import { ChartBarStacked, Minus, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { menuAdmin } from "@/utils/const";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import MenuOpr from "./menu-opr";

const data = {
  title: "PreWorkCorp",
  versions: ["0.0.1", "0.0.2", "0.0.3"],
};

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuItem className="flex items-center justify-between gap-2 m-2  ">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ChartBarStacked className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">{data.title}</span>
            <span className="">v{data.versions[0]}</span>
          </div>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{menuAdmin.title}</SidebarGroupLabel>

          <SidebarMenu className="pl-2 box-border">
            {menuAdmin.items.map((item, index) => (
              <Collapsible
                key={index}
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    asChild
                    className={` ${
                      !item.items.some((im) => im.isActive === true)
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    <SidebarMenuButton>
                      <item.icon />
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((it) => (
                          <SidebarMenuSubItem key={it.title}>
                            <SidebarMenuSubButton
                              className={` ${
                                !it.isActive
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              } `}
                              asChild
                              //isActive={!item.isActive}
                            >
                              <Link to={it.url}>{it.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <MenuOpr />
        
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="flex items-center justify-between">
                  Plástico Carmen
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}

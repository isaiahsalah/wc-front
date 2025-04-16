import { ChartBarStacked, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";

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
import { menuAdmin } from "@/utils/const";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
const NavAdm = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{menuAdmin.title}</SidebarGroupLabel>

      <SidebarMenu className="pl-2 box-border">
        {menuAdmin.items.map((item, i) => (
          <Collapsible
            key={i}
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
                  <ChevronDown className="ml-auto group-data-[state=open]/collapsible:hidden opacity-80"  />
                  <ChevronUp className="ml-auto group-data-[state=closed]/collapsible:hidden opacity-80" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items?.length ? (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((it,j) => (
                      <SidebarMenuSubItem key={j}>
                        <SidebarMenuSubButton
                          className={` ${
                            !it.isActive ? "pointer-events-none opacity-50" : ""
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
  );
};

export default NavAdm;

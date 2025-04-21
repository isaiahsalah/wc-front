import { ChevronDown, ChevronUp } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
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
const NavAdministrator = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{menuAdmin.title}</SidebarGroupLabel>

      <SidebarMenu className="pl-2 box-border">
        {menuAdmin.items.map((item, i) => ( 
              <SidebarMenuItem key={i}>
                <SidebarMenuButton
                  className={` ${
                    !item.isActive ? "pointer-events-none opacity-50" : ""
                  } `}
                  asChild
                  //isActive={!item.isActive}
                >
                  <Link to={item.url}>
                  <item.icon />
                  {item.title}{" "}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> 
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavAdministrator;

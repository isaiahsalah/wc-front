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
import { menuOper } from "@/utils/const";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
const MenuOpr = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{menuOper.title}</SidebarGroupLabel>

      <SidebarMenu className="pl-2">
        {menuOper.items.map((item, index) => (
          <Collapsible
            key={item.title}
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger
                asChild
                className={` ${
                  !item.isActive ? "pointer-events-none opacity-50" : ""
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
                    {item.items.map((itm,j) => (
                      <Collapsible
                        key={j}
                        defaultOpen={false}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger
                            asChild
                            className={` ${
                              !itm.items.some((im) => im.isActive === true)
                                ? "pointer-events-none opacity-50"
                                : ""
                            }`}
                          >
                            <SidebarMenuButton>
                              <item.icon />
                              {itm.title}{" "}
                              <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                              <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          {itm.items?.length ? (
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
                                            <Link to={it.url}>
                                              {it.title}
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      ))}</SidebarMenuSub>
                             
                            </CollapsibleContent>
                          ) : null}
                        </SidebarMenuItem>
                      </Collapsible>
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

export default MenuOpr;

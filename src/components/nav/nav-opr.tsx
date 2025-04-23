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
const NavOpr = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{menuOper.title}</SidebarGroupLabel>

      <SidebarMenu className="pl-2">
        {menuOper.items.map((itmi, i) => (
          <Collapsible
            key={i}
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger
                asChild
                className={` ${
                  !itmi.isActive ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <SidebarMenuButton>
                  <itmi.icon />
                  {itmi.title}{" "}
                  <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                  <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {itmi.items?.length ? (
                <CollapsibleContent >
                  <SidebarMenuSub className="">
                    {itmi.items.map((itmj,j) => (
                      <Collapsible
                        key={j}
                        defaultOpen={false}
                        className="group/child"
                      >
                        <SidebarMenuItem className="">
                          <CollapsibleTrigger
                            asChild
                            className={` ${
                              !itmj.items.some((im) => im.isActive === true)
                                ? "pointer-events-none opacity-50"
                                : ""
                            } `}
                          >
                            <SidebarMenuButton>
                              <itmj.icon />
                              {itmj.title}{" "}
                              <Plus className="ml-auto group-data-[state=open]/child:hidden" />
                              <Minus className="ml-auto group-data-[state=closed]/child:hidden" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          {itmj.items?.length ? (
                            <CollapsibleContent>
                                    <SidebarMenuSub>
                                      {itmj.items.map((itmk,k) => (
                                        <SidebarMenuSubItem key={k}>
                                          <SidebarMenuSubButton
                                            className={` ${
                                              !itmk.isActive
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                            } `}
                                            asChild
                                            //isActive={!item.isActive}
                                          >
                                            <Link to={itmk.url}>
                                              {itmk.title} 
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

export default NavOpr;

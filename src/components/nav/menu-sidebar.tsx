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
import {Link} from "react-router-dom";
import {IMenuItem} from "@/utils/const";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "../ui/collapsible";
import {ChevronRight} from "lucide-react";
import {useContext} from "react";
import {SesionContext} from "@/providers/sesionProvider";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
import {IPermission} from "@/utils/interfaces";
import {PageContext} from "@/providers/pageProvider";
import {motion} from "framer-motion";

const MenuSidebar = ({items, title}: {items: IMenuItem[]; title: string}) => {
  const {sesion} = useContext(SesionContext);

  const {sectorProcess} = useContext(SectorProcessContext);
  const {setPage} = useContext(PageContext);

  const permissions = (sesion?.sys_user.permissions as IPermission[]).filter(
    (per) => per.sector_process?.id_process === (sectorProcess?.process?.id as number)
  );

  return (
    <SidebarGroup className="">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu className=" box-border ">
        {items.map((item, i) =>
          !item.isActive ? null : (
            <Collapsible key={i} asChild defaultOpen={false} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.name}
                    className="text-sidebar-foreground/70 group-data-[state=open]/collapsible:text-foreground"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <motion.div
                    initial={{height: 0, opacity: 0}} // Estado inicial (cerrado).
                    animate={{height: "auto", opacity: 1}} // Al abrir (expandir).
                    exit={{height: 0, opacity: 0}} // Al cerrar (colapsar).
                    transition={{
                      height: {duration: 0.15, ease: "easeInOut"}, // Suavidad en altura.
                      opacity: {duration: 0.15, ease: "easeInOut"}, // Desvanecimiento rápido.
                    }}
                  >
                    <SidebarMenuSub className="ml-3.5">
                      {item.pages?.map((subItem) => {
                        const existPermission = permissions.find(
                          (per) => per.type_screen === subItem.id
                        );
                        if (existPermission)
                          return (
                            <SidebarMenuSubItem key={subItem.name}>
                              <SidebarMenuSubButton asChild className="text-muted-foreground/80">
                                <Link to={subItem.link} onClick={() => setPage(subItem)}>
                                  <span>{subItem.name}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        else return null;
                      })}
                    </SidebarMenuSub>
                  </motion.div>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default MenuSidebar;

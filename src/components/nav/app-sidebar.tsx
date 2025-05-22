import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import clsx from "clsx";
import {ProfileSidebar} from "./profile-sidebar";
import {SectorSidebar} from "./sector-sidebar";
import MenuSidebar from "./menu-sidebar";
import {useContext, useEffect, useState} from "react";
import {SesionContext} from "@/providers/sesionProvider";
import {IMenuItem, IModuleItem, typeModule} from "@/utils/const";
import {IPermission, ISector} from "@/utils/interfaces";

interface Props {
  className?: string; // Clase personalizada opcional
}

export const AppSidebar: React.FC<Props> = ({className}) => {
  const {sesion} = useContext(SesionContext);
  const [menu, setMenu] = useState<IMenuItem[]>();
  const [title, setTitle] = useState<string>("");

  const [sectors, setSectors] = useState<ISector[] | null>(null);

  const permisions = sesion?.user.permissions as IPermission[];

  useEffect(() => {
    const moduleId = permisions[0].type_module;
    const moduleSelected = typeModule.find((mod) => mod.id === moduleId) as IModuleItem;
    setTitle(moduleSelected.title);
    const tempMenu: IMenuItem[] = moduleSelected.menu.map((men) => {
      const isActive = men.pages.some((page) => permisions.some((per) => per.screen === page.id));
      return {...men, isActive}; // Devuelve un nuevo objeto con `isActive` actualizado
    });

    setMenu(tempMenu);
    const uniqueObjects: ISector[] = Array.from(
      new Map(permisions.map((item) => [item.id_sector, item.sector])).values()
    ) as ISector[];
    setSectors(uniqueObjects);
  }, [sesion]);

  if (!menu || !sectors) {
    return <></>;
  }

  return (
    <Sidebar className={clsx("animate-fadeIn", className)}>
      <SidebarHeader>
        <SidebarMenu className="flex ">
          <SidebarMenuItem></SidebarMenuItem>
          <SectorSidebar items={sectors} />
          {/* <SectorSidebar items={section} />
         <SidebarMenuItem className="">
            <ProcesoSwitcher items={sector} />
          </SidebarMenuItem>
         */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className=" m-0" />

      <SidebarContent className="scrollbar-thin">
        <MenuSidebar title={title} items={menu} />
      </SidebarContent>
      <SidebarSeparator className=" m-0" />
      <SidebarFooter>
        <ProfileSidebar />
      </SidebarFooter>
    </Sidebar>
  );
};

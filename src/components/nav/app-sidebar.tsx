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
import {SesionContext} from "@/providers/sesion-provider";
import {IMenu, typeModule} from "@/utils/const";
import {IPermission, ISector} from "@/utils/interfaces";

interface Props {
  className?: string; // Clase personalizada opcional
}

export const AppSidebar: React.FC<Props> = ({className}) => {
  const {sesion} = useContext(SesionContext);
  const [menu, setMenu] = useState<IMenu | null>(null);
  const [sectors, setSectors] = useState<ISector[] | null>(null);

  const permisions = sesion?.user.permissions as IPermission[];

  useEffect(() => {
    if (permisions[0].module === 1) setMenu(typeModule[0].menu);
    else if (permisions[0].module === 2) setMenu(typeModule[1].menu);
    else if (permisions[0].module === 3) setMenu(typeModule[2].menu);
    else if (permisions[0].module === 4) setMenu(typeModule[3].menu);
    else if (permisions[0].module === 5) setMenu(typeModule[4].menu);

    const uniqueObjects: ISector[] = Array.from(
      new Map(permisions.map((item) => [item.id_sector, item.sector])).values()
    ) as ISector[];
    setSectors(uniqueObjects);
  }, []);

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
        <MenuSidebar items={menu} />
      </SidebarContent>
      <SidebarSeparator className=" m-0" />
      <SidebarFooter>
        <ProfileSidebar />
      </SidebarFooter>
    </Sidebar>
  );
};

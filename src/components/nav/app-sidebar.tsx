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
import MenuSidebar from "./menu-sidebar";
import {useContext, useEffect, useState} from "react";
import {SesionContext} from "@/providers/sesionProvider";
import {IMenuItem, IModuleItem, typeModule} from "@/utils/const";
import {IPermission, ISectorProcess} from "@/utils/interfaces";
import {SectorProcessSidebar} from "./sectorProcess-sidebar";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";

interface Props {
  className?: string; // Clase personalizada opcional
}

export const AppSidebar: React.FC<Props> = ({className}) => {
  const {sesion} = useContext(SesionContext);
  const {sectorProcess} = useContext(SectorProcessContext);

  const [menu, setMenu] = useState<IMenuItem[]>();
  const [title, setTitle] = useState<string>("");

  const [sectorProcesses, setSectorProcesses] = useState<ISectorProcess[] | null>(null);

  const permisions = sesion?.user.permissions as IPermission[];
  console.log("🚩🚩", permisions);
  useEffect(() => {
    const moduleSelected = typeModule.find(
      (mod) => mod.id === permisions[0].type_module
    ) as IModuleItem;
    setTitle(moduleSelected.title);

    const tempMenu: IMenuItem[] = moduleSelected.menu.map((men) => {
      const isActive = men.pages.some((page) =>
        permisions.some(
          (per) =>
            per.type_screen === page.id && per.id_sector_process === sectorProcess?.process?.id
        )
      );
      return {...men, isActive}; // Devuelve un nuevo objeto con `isActive` actualizado
    });

    setMenu(tempMenu);
    const uniqueObjects: ISectorProcess[] = Array.from(
      new Map(permisions.map((item) => [item.id_sector_process, item.sector_process])).values()
    ) as ISectorProcess[];

    setSectorProcesses(uniqueObjects);
  }, [sesion, sectorProcess]);

  if (!menu || !sectorProcesses) {
    return <></>;
  }

  return (
    <Sidebar className={clsx("animate-fadeIn", className)}>
      {/*<SidebarHeader>
        <SidebarMenu className="flex ">
          <SidebarMenuItem></SidebarMenuItem>
          <SectorSidebar items={sectors} />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className=" m-0" />*/}
      <SidebarHeader>
        <SidebarMenu className="flex ">
          <SidebarMenuItem></SidebarMenuItem>

          <SectorProcessSidebar sectorProcesses={sectorProcesses} />
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

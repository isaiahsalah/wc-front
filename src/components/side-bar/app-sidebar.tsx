import {
  AudioWaveform, 
  Command, 
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter, 
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarSeparator,
} from "@/components/ui/sidebar";
 
import NavOpr from "./nav-opr";
import clsx from "clsx";
import { NavUser } from "./nav-user";
import NavAdm from "./nav-adm";
import {  SectionSwitcher } from "./section-swicher";
import { SectorSwitcher } from "./sector-swicher";

interface Props {
  className?: string; // Clase personalizada opcional
}

export const AppSidebar: React.FC<Props> = ({ className }) => {
  return (
    <Sidebar className={clsx("animate-fadeIn", className)}>
      <SidebarHeader>
        <SidebarMenu className="flex ">
          <SidebarMenuItem >
            <SectionSwitcher items={section} />  

          </SidebarMenuItem>
          <SidebarMenuItem  className=""> 
            <SectorSwitcher items={sector} /> 

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className=" m-0" />

      <SidebarContent className="scrollbar-thin">
        <NavAdm />
        <NavOpr />
      </SidebarContent>
      <SidebarSeparator className=" m-0" />
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

const user = {
  name: "Isaias",
  user: "45781245",
  avatar: "/avatars/shadcn.jpg",
};

const section = [
  {
    name: "Bolsas",
    logo: Command,
    plan: "Enterprise",
  },
  {
    name: "Extrucción",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Termoformado",
    logo: Command,
    plan: "Free",
  },
];

const sector = [
  {
    name: "Mezcla",
    logo: Command,
    plan: "Enterprise",
  },
  {
    name: "Extrución",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Corte",
    logo: Command,
    plan: "Free",
  },
];

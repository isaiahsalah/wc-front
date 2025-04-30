import {AudioWaveform, Command} from "lucide-react";

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
import {NavUser} from "./nav-user";
import {Switcher} from "./section-swicher";
import NavProductionInventory from "./navProductionInventory";

interface Props {
  className?: string; // Clase personalizada opcional
}

export const AppSidebar: React.FC<Props> = ({className}) => {
  return (
    <Sidebar className={clsx("animate-fadeIn", className)}>
      <SidebarHeader>
        <SidebarMenu className="flex ">
          <SidebarMenuItem>
            <Switcher items={section} />
          </SidebarMenuItem>
          {/*
         <SidebarMenuItem className="">
            <ProcesoSwitcher items={sector} />
          </SidebarMenuItem>
         */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className=" m-0" />

      <SidebarContent className="scrollbar-thin">
        <NavProductionInventory />
      </SidebarContent>
      <SidebarSeparator className=" m-0" />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

const section = [
  {
    name: "Todos",
    logo: Command,
    plan: "all",
  },
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

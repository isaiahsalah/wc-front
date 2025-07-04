import {LogOut, Settings, SquareAsterisk, UserPen} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import {useContext} from "react";
import {SesionContext} from "@/providers/sesionProvider";
import {useNavigate} from "react-router-dom";
import {EditPassDialog, EditProfileDialog} from "../dialog/profile/ProfileDialog";

export function ProfileSidebar() {
  const {isMobile} = useSidebar();

  const navigate = useNavigate(); // Obtienes la función navigate
  const {sesion, setSesion} = useContext(SesionContext);

  const onLogOut = () => {
    window.localStorage.removeItem("token-app");
    setSesion(null);
    navigate("/login"); // Redirige a la página de inicio de sesión
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={""} alt={sesion?.sys_user.name} />
                <AvatarFallback className="rounded-lg">PC</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{sesion?.sys_user.name}</span>
                <span className="truncate text-xs">{sesion?.sys_user.user}</span>
              </div>
              <Settings className="ml-auto size-4 opacity-80" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">PC</AvatarFallback>
                </Avatar>

                <div className="grid  flex-1 text-left text-sm leading-tight">
                  <span className="truncate  font-semibold">
                    {sesion?.sys_user.name} {sesion?.sys_user.lastname}
                  </span>
                  <span className="truncate text-xs">
                    {sesion?.sys_user.work_group?.name
                      ? "Grupo " + sesion?.sys_user.work_group?.name
                      : null}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <EditProfileDialog updateView={() => {}}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <UserPen />
                  Editar Información
                </DropdownMenuItem>
              </EditProfileDialog>
              <EditPassDialog updateView={() => {}}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <SquareAsterisk />
                  Cambiar Contraseña
                </DropdownMenuItem>
              </EditPassDialog>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogOut}>
              <LogOut />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

import {LogOut, ScanFace, Settings, SquareAsterisk, UserPen} from "lucide-react";

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
import {typeTurn} from "@/utils/const";
import {EditProfileDialog} from "../dialog/profile/ProfileDialog";

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
                <AvatarImage src={""} alt={sesion?.user.name} />
                <AvatarFallback className="rounded-lg">PC</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{sesion?.user.name}</span>
                <span className="truncate text-xs">{sesion?.user.user}</span>
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
                  <AvatarImage src={sesion?.user.image} alt={sesion?.user.name} />
                  <AvatarFallback className="rounded-lg">PC</AvatarFallback>
                </Avatar>

                <div className="grid  flex-1 text-left text-sm leading-tight">
                  <span className="truncate  font-semibold">
                    {sesion?.user.name} {sesion?.user.lastname}
                  </span>
                  <span className="truncate text-xs">
                    {sesion?.user.group?.name} -{" "}
                    {
                      typeTurn.find((turn) => turn.id === (sesion?.user.group?.type_turn as number))
                        ?.name
                    }
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

              <DropdownMenuItem>
                <SquareAsterisk />
                Cambiar Contraseña
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ScanFace />
                Actualizar Foto de Perfil
              </DropdownMenuItem>
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

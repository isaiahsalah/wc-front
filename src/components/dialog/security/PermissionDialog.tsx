import {Button} from "@/components/ui/button";

import {useContext, useEffect, useMemo, useState} from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingCircle from "@/components/LoadingCircle";
import {IPermission, ISystemUser} from "@/utils/interfaces";
import {getUserById, updateUserPermissions} from "@/api/security/user.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {IModuleItem, typeModule, typePermission} from "@/utils/const";
import {CardDescription} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {toast} from "sonner";
import {SesionContext} from "@/providers/sesionProvider";
import {checkToken, getModuleBySesion} from "@/utils/funtions";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";

interface PropsPermissionEdit {
  children: React.ReactNode;
  id: number;
  updateView: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const EditPermissionUserDialog: React.FC<PropsPermissionEdit> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);

  //const {sesion} = useContext(SesionContext);
  const {sectorProcess} = useContext(SectorProcessContext);
  const {sesion, setSesion} = useContext(SesionContext);

  const [permissions, setPermissions] = useState<IPermission[]>();
  const [module, setModule] = useState<IModuleItem>();

  // const [moduleId, setModuleId] = useState<number>();

  useEffect(() => {
    if (sesion) {
      setModule(getModuleBySesion({sesion: sesion}));
    }
  }, [sesion]);

  function onSubmit() {
    if (!permissions) return toast.warning("No hay permisos para guardar");
    if (!sectorProcess?.id) return toast.warning("No hay Sector ni Proceso");

    setLoadingSave(true);

    updateUserPermissions({
      userId: id,
      permissions: permissions,
      id_sector_process: sectorProcess?.id,
    })
      .then((updatedUser) => {
        console.log("Usuario actualizado:", updatedUser);
        if (sesion?.sys_user.id === id) checkToken({setSesion});
        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el usuario:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchUser = async () => {
    setLoadingInit(true);
    try {
      const userData: ISystemUser = await getUserById({
        id: id,
        id_sector_process: sectorProcess?.id,
        type_module: module?.id,
      });
      setPermissions(userData.permissions as IPermission[]);
      //setModuleId((userData.permissions as IPermission[])[0].type_module);
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  const memoizedSelectedValues = useMemo(() => {
    const map: Record<number, string> = {};
    permissions?.forEach((item) => {
      map[item.type_screen] = item.type_degree.toString();
    });
    return map;
  }, [permissions]);

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchUser}>
        {children}
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Permisos de Usuario</DialogTitle>
          <DialogDescription>Edite los datos del usuario.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <div className="grid  gap-4">
            <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
              {typeModule
                .find((mod) => mod.id === module?.id)
                ?.menu.map((menu, i) => {
                  return (
                    <div key={i} className="grid grid-cols-6 col-span-6 gap-2  ">
                      <CardDescription className="col-span-6  ">
                        Paginas de {menu.name}
                      </CardDescription>
                      <Separator className="col-span-6" />
                      {menu.pages.map((page, i) => {
                        return (
                          <div key={i} className="col-span-2 gap-2">
                            <CardDescription>{page.label}</CardDescription>
                            <Select
                              value={memoizedSelectedValues[page.id] || "0"}
                              onValueChange={(value) => {
                                let found = false; // Bandera para verificar si el objeto existe

                                const updatedArray: IPermission[] = (
                                  permissions as IPermission[]
                                ).map((item) => {
                                  if (item.type_screen === page.id) {
                                    found = true; // Marcar como encontrado
                                    return {...item, type_degree: Number(value)}; // Actualizar el objeto
                                  }
                                  return item; // Devolver el objeto sin cambios
                                });

                                // Si no se encontró, añadir el nuevo objeto al array
                                if (!found) {
                                  updatedArray.push({
                                    id_sector_process: sectorProcess?.id as number,
                                    id_sys_user: id as number,
                                    type_screen: page.id,
                                    type_degree: Number(value),
                                    type_module: module?.id as number,
                                  });
                                }

                                setPermissions(updatedArray);
                              }} // Convertir el valor a número
                            >
                              <SelectTrigger
                                className={`w-full ${
                                  memoizedSelectedValues[page.id] ? "" : "text-muted"
                                } `}
                              >
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {typePermission?.map((group) => (
                                  <SelectItem key={group.id} value={(group.id ?? "").toString()}>
                                    {group.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
            <DialogFooter className="grid grid-cols-6 ">
              <Button
                type="submit"
                className="col-span-3"
                disabled={loadingSave}
                onClick={onSubmit}
              >
                {loadingSave ? <LoadingCircle /> : "Guardar"}
              </Button>
              <DialogClose className="col-span-3" asChild>
                <Button type="button" variant="outline" className="w-full" disabled={loadingSave}>
                  Cerrar
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

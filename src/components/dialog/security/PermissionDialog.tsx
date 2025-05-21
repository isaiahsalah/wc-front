import {Button} from "@/components/ui/button";

import {useContext, useState} from "react";

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
import {IPermission, ISector, IUser} from "@/utils/interfaces";
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
import {SectorContext} from "@/providers/sectorProvider";
import {getSectors} from "@/api/params/sector.api";
import {toast} from "sonner";

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
  const {sector} = useContext(SectorContext);

  const [permissions, setPermissions] = useState<IPermission[]>();

  const [sectors, setSectors] = useState<ISector[]>();
  const [moduleId, setModuleId] = useState<number>();

  // const ()=useContext(mod)

  //const moduleId = (sesion?.user.permissions as IPermission[])[0].type_module;
  //const permissions = sesion?.user.permissions as IPermission[];

  function onSubmit() {
    if (!permissions) return toast.warning("No hay permisos para guardar");
    setLoadingSave(true);
    updateUserPermissions({userId: id, permissions: permissions})
      .then((updatedUser) => {
        console.log("Usuario actualizado:", updatedUser);
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
      const userData: IUser = await getUserById(id);
      console.log("Usuario:", userData);

      setPermissions(userData.permissions as IPermission[]);

      setModuleId((userData.permissions as IPermission[])[0].type_module);

      console.log("👌✖️🤞:", userData.permissions);

      const SectorsData = await getSectors({});

      setSectors(SectorsData);
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchUser}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Permisos de Usuario</DialogTitle>
          <DialogDescription>Edite los datos del usuario.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <div className="grid  gap-4">
            <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
              <div className="col-span-3">
                <CardDescription>Módulo</CardDescription>
                <div>
                  <Select
                    value={(permissions ?? [])[0].type_module.toString()} // Asegúrate de que el valor sea una cadena
                    //onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                  >
                    <SelectTrigger disabled className="w-full">
                      <SelectValue placeholder="Seleccionar Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeModule?.map((group: IModuleItem) => (
                        <SelectItem key={group.id} value={(group.id ?? "").toString()}>
                          {group.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="col-span-3">
                <CardDescription>Sector</CardDescription>
                <div>
                  <Select
                    value={sector?.id?.toString() ?? ""} // Asegúrate de que el valor sea una cadena
                    //onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                  >
                    <SelectTrigger disabled className="w-full">
                      <SelectValue placeholder="Seleccionar Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors?.map((group: ISector) => (
                        <SelectItem key={group.id} value={(group.id ?? "").toString()}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {typeModule
                .find((mod) => mod.id === moduleId)
                ?.menu.map((menu, i) => {
                  return (
                    <div key={i} className="grid grid-cols-6 col-span-6 gap-2  ">
                      <Separator className="col-span-6" />

                      <CardDescription className="col-span-6  ">
                        Paginas de {menu.title}
                      </CardDescription>
                      {menu.pages.map((page) => {
                        return (
                          <div className="col-span-2 gap-2">
                            <CardDescription>{page.label}</CardDescription>
                            <Select
                              value={permissions
                                ?.find((item) => {
                                  //console.log("item👌👌", item);
                                  return item.screen === page.id;
                                })
                                ?.degree.toString()} // Asegúrate de que el valor sea una cadena
                              onValueChange={(value) => {
                                let found = false; // Bandera para verificar si el objeto existe

                                const updatedArray: IPermission[] = (
                                  permissions as IPermission[]
                                ).map((item) => {
                                  if (item.id === page.id) {
                                    found = true; // Marcar como encontrado
                                    return {...item, degree: Number(value)}; // Actualizar el objeto
                                  }
                                  return item; // Devolver el objeto sin cambios
                                });

                                // Si no se encontró, añadir el nuevo objeto al array
                                if (!found) {
                                  updatedArray.push({
                                    id_sector: sector?.id as number,
                                    id_user: (permissions as IPermission[])[0].id_user as number,
                                    screen: page.id,
                                    degree: Number(value),
                                    type_module: moduleId as number,
                                  });
                                }

                                setPermissions(updatedArray);
                              }} // Convertir el valor a número
                            >
                              <SelectTrigger className="w-full">
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

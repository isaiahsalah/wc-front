import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
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
import {IWorkGroup, ISystemUser, SystemUserSchema} from "@/utils/interfaces";
import {
  createUser,
  hardDeleteUser,
  getUserById,
  recoverUser,
  softDeleteUser,
  updateUser,
} from "@/api/security/user.api";
import {getGroups} from "@/api/security/group.api";
import {DatePicker} from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Eye, EyeOff, Trash2} from "lucide-react";
import {SesionContext} from "@/providers/sesionProvider";
import {checkToken} from "@/utils/funtions";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define el tipo como una función que retorna void
}

export const CreateUserDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga
  const [loadingInit, setLoadingInit] = useState(false);
  const [groups, setGroups] = useState<IWorkGroup[]>();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ISystemUser>({
    resolver: zodResolver(SystemUserSchema),
  });

  function onSubmit(values: ISystemUser) {
    setLoadingSave(true); // Inicia la carga
    createUser({data: values})
      .then((updatedUser) => {
        console.log("Usuario creado:", updatedUser);
        updateView();
      })
      .catch((error) => {
        console.error("Error al crear el usuario:", error);
      })
      .finally(() => {
        setLoadingSave(false); // Finaliza la carga
      });
  }

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      const GroupsData = await getGroups({});

      setGroups(GroupsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={fetchData}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Usuario</DialogTitle>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))} className="grid   ">
              <div className="grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input placeholder="Nombre de Usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastname"
                  render={({field}) => (
                    <FormItem className="col-span-4">
                      <FormControl>
                        <Input placeholder="Apellidos del Usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <DatePicker
                          className="w-full"
                          value={
                            field.value && typeof field.value === "string"
                              ? new Date(field.value)
                              : field.value
                          }
                          onChange={(date) => {
                            if (date) {
                              field.onChange(date);
                            } else {
                              field.onChange(null);
                            }
                          }}
                          placeholder="Fecha de Nacimiento"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <Input placeholder="Telefono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <Input placeholder="Usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pass"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="text-center"
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            autoComplete="current-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant={"link"}
                            className="absolute right-0 top-1/2  -translate-y-1/2"
                            onMouseDown={() => setShowPassword(true)}
                            onMouseUp={() => setShowPassword(false)}
                            onTouchStart={() => setShowPassword(true)}
                            onTouchEnd={() => setShowPassword(false)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 opacity-50" />
                            ) : (
                              <Eye className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id_work_group"
                  render={({field}) => (
                    <FormItem className="col-span-6">
                      <FormControl>
                        <div className="flex gap-2">
                          <Select
                            value={field.value?.toString() ?? ""} // Asegúrate de que el valor sea una cadena
                            onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Grupo de Trabajo" />
                            </SelectTrigger>
                            <SelectContent>
                              {groups?.map((group: IWorkGroup) => (
                                <SelectItem key={group.id} value={(group.id ?? "").toString()}>
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant={"outline"}
                            type="button"
                            onClick={() => field.onChange(null)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="grid grid-cols-6 ">
                <Button
                  type="submit"
                  className="col-span-3"
                  disabled={!form.formState.isDirty || loadingSave}
                >
                  {loadingSave ? <LoadingCircle /> : "Guardar"}
                </Button>
                <DialogClose asChild className="col-span-3">
                  <Button type="button" variant="outline" className="w-full" disabled={loadingSave}>
                    Cerrar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface PropsEdit {
  children: React.ReactNode;
  id: number;
  updateView: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const EditUserDialog: React.FC<PropsEdit> = ({children, id, updateView, onOpenChange}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [groups, setGroups] = useState<IWorkGroup[]>();
  const {sesion, setSesion} = useContext(SesionContext);
  const form = useForm<ISystemUser>({
    resolver: zodResolver(SystemUserSchema),
  });

  function onSubmit(values: ISystemUser) {
    setLoadingSave(true);
    updateUser({data: values})
      .then((updatedUser) => {
        console.log("Usuario actualizado:", updatedUser);
        if (id === sesion?.sys_user.id) checkToken({setSesion: setSesion});
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
      const userData = await getUserById({id});
      console.log("Usuario:", userData);
      form.reset({
        ...userData,
        birthday: userData.birthday ? new Date(userData.birthday) : null,
        createdAt: null,
        deletedAt: null,
        updatedAt: null,
      });
      const GroupsData = await getGroups({});

      setGroups(GroupsData);
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
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))} className="grid  ">
              <div className="grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input placeholder="Nombre de Usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastname"
                  render={({field}) => (
                    <FormItem className="col-span-4">
                      <FormControl>
                        <Input placeholder="Apellidos del Usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <DatePicker
                          className="w-full"
                          value={
                            field.value && typeof field.value === "string"
                              ? new Date(field.value)
                              : field.value
                          }
                          onChange={(date) => {
                            if (date) {
                              field.onChange(date);
                            } else {
                              field.onChange(null);
                            }
                          }}
                          placeholder="Fecha de Nacimiento"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <Input placeholder="Telefono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <Input placeholder="Usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="id_work_group"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <div className="flex gap-2">
                          <Select
                            value={field.value?.toString() ?? ""} // Asegúrate de que el valor sea una cadena
                            onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Grupo de Trabajo" />
                            </SelectTrigger>
                            <SelectContent>
                              {groups?.map((group: IWorkGroup) => (
                                <SelectItem key={group.id} value={(group.id ?? "").toString()}>
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant={"outline"}
                            type="button"
                            onClick={() => field.onChange(null)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="grid grid-cols-6 ">
                <Button
                  type="submit"
                  className="col-span-3"
                  disabled={!form.formState.isDirty || loadingSave}
                >
                  {loadingSave ? <LoadingCircle /> : "Guardar"}
                </Button>
                <DialogClose className="col-span-3" asChild>
                  <Button type="button" variant="outline" className="w-full" disabled={loadingSave}>
                    Cerrar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface SoftPropsDelete {
  children: React.ReactNode;
  id: number;
  updateView: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const SoftDeleteUserDialog: React.FC<SoftPropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  function onDelete(): void {
    setLoadingDelete(true);
    softDeleteUser(id)
      .then((deletedUser) => {
        console.log("Usuario eliminado:", deletedUser);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el usuario:", error);
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar Usuario</DialogTitle>
          <DialogDescription>¿Está seguro de desactivar este Usuario?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="button"
            disabled={loadingDelete}
            className="col-span-3"
            variant={"destructive"}
            onClick={onDelete}
          >
            {loadingDelete ? <LoadingCircle /> : "Desactivar"}
          </Button>
          <DialogClose className="col-span-3" asChild>
            <Button type="button" variant="outline" className="w-full" disabled={loadingDelete}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface PropsHardDelete {
  children: React.ReactNode;
  id: number;
  updateView: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const HardDeleteUserDialog: React.FC<PropsHardDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  function onDelete(): void {
    setLoadingDelete(true);
    hardDeleteUser(id)
      .then((deletedUser) => {
        console.log("Usuario eliminado:", deletedUser);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el usuario:", error);
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Usuario</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar este Usuario?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="button"
            disabled={loadingDelete}
            className="col-span-3"
            variant={"destructive"}
            onClick={onDelete}
          >
            {loadingDelete ? <LoadingCircle /> : "Eliminar"}
          </Button>
          <DialogClose className="col-span-3" asChild>
            <Button type="button" variant="outline" className="w-full" disabled={loadingDelete}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface PropsRecover {
  children: React.ReactNode;
  id: number;
  updateView: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const RecoverUserDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingRecover, setLoadingRecover] = useState(false);

  function onRecover(): void {
    setLoadingRecover(true);
    recoverUser(id)
      .then((recoveredUser) => {
        console.log("Usuario recuperado:", recoveredUser);
        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar el usuario:", error);
      })
      .finally(() => {
        setLoadingRecover(false);
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reactivar usuario</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar este usuario?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="button"
            disabled={loadingRecover}
            className="col-span-3"
            onClick={onRecover}
          >
            {loadingRecover ? <LoadingCircle /> : "Reactivar"}
          </Button>
          <DialogClose className="col-span-3" asChild>
            <Button type="button" variant="outline" className="w-full" disabled={loadingRecover}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

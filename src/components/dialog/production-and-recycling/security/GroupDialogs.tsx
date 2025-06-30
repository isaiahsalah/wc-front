import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
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
import {IWorkGroup, WorkGroupSchema} from "@/utils/interfaces";
import {
  createGroup,
  hardDeleteGroup,
  getGroupById,
  recoverGroup,
  softDeleteGroup,
  updateGroup,
} from "@/api/production-and-recycling/security/group.api";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define el tipo como una función que no retorna nada
}

export const CreateGroupDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga

  const form = useForm<IWorkGroup>({
    resolver: zodResolver(WorkGroupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: IWorkGroup) {
    setLoadingSave(true); // Inicia la carga
    createGroup({data: values})
      .then((createdGroup) => {
        console.log("Grupo creado:", createdGroup);

        updateView();
      })
      .catch((error) => {
        console.error("Error al crear el grupo:", error);
      })
      .finally(() => {
        setLoadingSave(false); // Finaliza la carga
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Grupo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="grid grid-cols-6 gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem className="col-span-6">
                  <FormControl>
                    <Input placeholder="Nombre del Grupo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem className="col-span-6">
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="grid grid-cols-6 col-span-6">
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
      </DialogContent>
    </Dialog>
  );
};

interface PropsEdit {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define el tipo como una función que no retorna nada
  onOpenChange?: (open: boolean) => void;
}

export const EditGroupDialog: React.FC<PropsEdit> = ({children, id, updateView, onOpenChange}) => {
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga
  const [loadingInit, setLoadingInit] = useState(false); // Estado de carga

  const form = useForm<IWorkGroup>({
    resolver: zodResolver(WorkGroupSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
    },
  });

  function onSubmit(values: IWorkGroup) {
    setLoadingSave(true); // Inicia la carga
    updateGroup({data: values})
      .then((updatedGroup) => {
        console.log("Grupo actualizado:", updatedGroup);

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el grupo:", error);
      })
      .finally(() => {
        setLoadingSave(false); // Finaliza la carga
      });
  }

  const fetchGroup = async () => {
    setLoadingInit(true); // Inicia la carga
    try {
      const groupData = await getGroupById(id);
      console.log("Grupos:", groupData);
      form.reset({
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
      });
    } catch (error) {
      console.error("Error al cargar los grupos:", error);
    } finally {
      setLoadingInit(false); // Finaliza la carga
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchGroup}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar grupo</DialogTitle>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className="grid grid-cols-6 gap-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem className="col-span-6">
                    <FormControl>
                      <Input placeholder="Nombre del Grupo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                  <FormItem className="col-span-6">
                    <FormControl>
                      <Textarea
                        placeholder="Notas adicionales"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="grid grid-cols-6 col-span-6">
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
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define el tipo como una función que no retorna nada
  onOpenChange?: (open: boolean) => void;
}

export const SoftDeleteGroupDialog: React.FC<SoftPropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    softDeleteGroup(id) // Llamada a la función de eliminación para grupos
      .then((deleteGroup) => {
        console.log("Grupo eliminado:", deleteGroup);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el grupo:", error);
      })
      .finally(() => {
        setLoadingDelete(false); // Finaliza la carga
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar Grupo</DialogTitle>
          <DialogDescription>¿Está seguro de desactivar este Grupo?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="submit"
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
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define el tipo como una función que no retorna nada
  onOpenChange?: (open: boolean) => void;
}

export const HardDeleteGroupDialog: React.FC<PropsHardDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    hardDeleteGroup(id) // Llamada a la función de eliminación para grupos
      .then((deleteGroup) => {
        console.log("Grupo eliminado:", deleteGroup);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el grupo:", error);
      })
      .finally(() => {
        setLoadingDelete(false); // Finaliza la carga
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Grupo</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar este Grupo?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="submit"
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
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define el tipo como una función que no retorna nada
  onOpenChange?: (open: boolean) => void;
}

export const RecoverGroupDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingRecover, setLoadingRecover] = useState(false); // Estado de carga

  function onRecover(): void {
    setLoadingRecover(true); // Inicia la carga
    recoverGroup(id) // Llamada a la función de recuperación para grupos
      .then((recoverGroup) => {
        console.log("Grupo recuperado:", recoverGroup);
        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar el grupo:", error);
      })
      .finally(() => {
        setLoadingRecover(false); // Finaliza la carga
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reactivar grupo</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar este grupo?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="submit"
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

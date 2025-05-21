import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import {toast} from "sonner";
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
import {IGroup, GroupSchema} from "@/utils/interfaces";
import {
  createGroup,
  deleteGroup,
  getGroupById,
  recoverGroup,
  updateGroup,
} from "@/api/security/group.api";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define el tipo como una función que no retorna nada
}

export const CreateGroupDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga

  const form = useForm<IGroup>({
    resolver: zodResolver(GroupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: IGroup) {
    setLoadingSave(true); // Inicia la carga
    createGroup({data: values})
      .then((createdGroup) => {
        console.log("Grupo creado:", createdGroup);

        toast("El grupo se creó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al crear el grupo:", error);
        toast("Hubo un error al crear el grupo.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
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
          <DialogTitle>Gestión de grupo</DialogTitle>
          <DialogDescription>Creación de un nuevo grupo.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-6 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem className="col-span-6">
                  <FormDescription>Nombre</FormDescription>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
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
                  <FormDescription>Descripción</FormDescription>
                  <FormControl>
                    <Textarea placeholder="Notas adicionales" {...field} />
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
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga
  const [loadingInit, setLoadingInit] = useState(false); // Estado de carga

  const form = useForm<IGroup>({
    resolver: zodResolver(GroupSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
    },
  });

  function onSubmit(values: IGroup) {
    setLoadingSave(true); // Inicia la carga
    updateGroup({data: values})
      .then((updatedGroup) => {
        console.log("Grupo actualizado:", updatedGroup);

        toast("El grupo se actualizó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el grupo:", error);
        toast("Hubo un error al actualizar el grupo.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
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

  function onDelete(id: number): void {
    setLoadingDelete(true); // Inicia la carga
    deleteGroup(id)
      .then((deletedGroup) => {
        console.log("Grupo eliminado:", deletedGroup);

        toast("El grupo se eliminó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el grupo:", error);
        toast("Hubo un error al eliminar el grupo.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
      })
      .finally(() => {
        setLoadingDelete(false); // Finaliza la carga
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchGroup}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestión de grupo</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el grupo.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-6 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({field}) => (
                  <FormItem className={"col-span-2"}>
                    <FormDescription>Id</FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Id"
                        disabled
                        onChange={(event) => field.onChange(Number(event.target.value))}
                        defaultValue={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem className="col-span-4">
                    <FormDescription>Nombre</FormDescription>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
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
                    <FormDescription>Descripción</FormDescription>
                    <FormControl>
                      <Textarea placeholder="Notas adicionales" {...field} />
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
                <Button
                  type="button"
                  disabled={loadingDelete}
                  className="col-span-3"
                  variant={"destructive"}
                  onClick={() => onDelete(form.getValues().id ?? 0)}
                >
                  {loadingDelete ? <LoadingCircle /> : "Eliminar"}
                </Button>
                <DialogClose className="col-span-6" asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={loadingDelete || loadingSave}
                  >
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

interface PropsDelete {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define el tipo como una función que no retorna nada
  onOpenChange?: (open: boolean) => void;
}

export const DeleteGroupDialog: React.FC<PropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    deleteGroup(id) // Llamada a la función de eliminación para grupos
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
          <DialogTitle>Eliminar grupo</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar este grupo?</DialogDescription>
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
          <DialogTitle>Recuperar grupo</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar este grupo?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="submit"
            disabled={loadingRecover}
            className="col-span-3"
            onClick={onRecover}
          >
            {loadingRecover ? <LoadingCircle /> : "Recuperar"}
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

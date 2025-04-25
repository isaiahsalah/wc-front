 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
 
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl, 
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  createUnity,
  deleteUnity,
  getUnityById,
  updateUnity,
} from "@/api/product/unity.api";
import { toast } from "sonner";
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

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateUnityDialog: React.FC<PropsCreate> = ({
  children,
  updateView,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);

  const form = useForm<z.infer<typeof GeneralSchema>>({
    resolver: zodResolver(GeneralSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof GeneralSchema>) {
    setLoadingSave(true);
    createUnity({ data: values })
      .then((updatedUnity) => {
        console.log("Unity creada:", updatedUnity);

        toast("La unidad se creó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al crear la unidad:", error);
        toast("Hubo un error al crear la unidad.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestión de unidad</DialogTitle>
          <DialogDescription>
            Mostrando datos relacionados con la unidad.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" grid grid-cols-6 gap-4 "
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Nombre</FormLabel>
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
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas adicionales" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className=" grid grid-cols-6 col-span-6">
              <Button
                type="submit"
                className="col-span-3"
                disabled={!form.formState.isDirty || loadingSave}
              >
                {loadingSave ? <LoadingCircle /> : "Guardar"}
              </Button>
              <DialogClose asChild className="col-span-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={loadingSave}
                >
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
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

export const EditUnityDialog: React.FC<PropsEdit> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const form = useForm<z.infer<typeof GeneralSchema>>({
    resolver: zodResolver(GeneralSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof GeneralSchema>) {
    setLoadingSave(true);
    updateUnity({ data: values })
      .then((updatedUnity) => {
        console.log("Unidad actualizada:", updatedUnity);

        toast("La unidad se actualizó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar la unidad:", error);
        toast("Hubo un error al actualizar la unidad.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchUnity = async () => {
    setLoadingInit(true);
    try {
      const unityData = await getUnityById(id);
      console.log("Unidad:", unityData);
      form.reset({
        id: unityData.id,
        name: unityData.name,
        description: unityData.description,
      });
    } catch (error) {
      console.error("Error al cargar la unidad:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  function onDelete(id: number): void {
    setLoadingDelete(true);
    deleteUnity(id)
      .then((deletedUnity) => {
        console.log("Unidad eliminada:", deletedUnity);

        toast("La unidad se eliminó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la unidad:", error);
        toast("Hubo un error al eliminar la unidad.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchUnity}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestión de unidad</DialogTitle>
          <DialogDescription>
            Mostrando datos relacionados con la unidad.
          </DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" grid grid-cols-6 gap-4 "
            >
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className={"col-span-6"}>
                    <FormLabel>Id</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Id"
                        disabled
                        onChange={(event) =>
                          field.onChange(Number(event.target.value))
                        }
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
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Nombre</FormLabel>
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
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notas adicionales" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className=" grid grid-cols-6 col-span-6">
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
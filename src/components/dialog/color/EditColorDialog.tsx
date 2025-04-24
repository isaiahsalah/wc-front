import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { deleteColor, getColorById, updateColor } from "@/api/color.api";
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
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/LoadingCircle";

interface Props {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

const EditColorDialog: React.FC<Props> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  //const [data, setData] = useState<GeneralInterfaces | never>();
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  const [loadingInit, setLoadingInit] = useState(false); // Estado de carga

  const form = useForm<z.infer<typeof GeneralSchema>>({
    resolver: zodResolver(GeneralSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof GeneralSchema>) {
    setLoadingSave(true); // Inicia la carga
    updateColor({ data: values })
      .then((updatedColor) => {
        console.log("Color actualizado:", updatedColor);

        toast("El color se actualizó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el color:", error);
        toast("Hubo un error al actualizar el color.", {
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

  const fetchColor = async () => {
    setLoadingInit(true); // Inicia la carga
    try {
      const colorData = await getColorById(id);
      console.log("Colores:", colorData);
      //setData(colorData);
      form.reset({
        id: colorData.id,
        name: colorData.name,
        description: colorData.description,
      });
    } catch (error) {
      console.error("Error al cargar los colores:", error);
    } finally {
      setLoadingInit(false); // Finaliza la carga
    }
  };

  function onDelete(id: number): void {
    console.log("Color eliminado:");
    setLoadingDelete(true); // Inicia la carga
    deleteColor(id)
      .then((deleteColor) => {
        console.log("Color eliminado:", deleteColor);

        toast("El color se eliminó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el color:", error);
        toast("Hubo un error al eliminar el color.", {
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
      <DialogTrigger asChild onClick={fetchColor}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestión de color</DialogTitle>
          <DialogDescription>
            Mostrando datos relacionados con el color.
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
                        defaultValue={field.value}
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
                  onClick={() => onDelete(form.getValues().id)}
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

export default EditColorDialog;

/*
    <Sheet>
      <SheetTrigger asChild onClick={fetchColor}>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className=" flex flex-col p-4">
        <div className=" mb-17  flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          <SheetTitle>Gestión de color</SheetTitle>

          <SheetDescription>
            Mostrando datos relacionados con el color.
          </SheetDescription>

          <Separator />

          {loading ? null : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" grid grid-cols-6 gap-4 "
              >
                <FormField
                
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem  className={id?"col-span-6":"hidden"}   >
                      <FormLabel>Id</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Id" 
                          disabled
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          defaultValue={field.value}
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

                <div className="grid grid-cols-6 col-span-6 gap-2 absolute bottom-0 right-0 left-0 m-4 mb-6">
                  <Button
                    type="submit"
                    className="col-span-3"
                    disabled={!form.formState.isDirty || loading}
                  >
                    Guardar
                  </Button>

                  <Button
                    type="button"
                    className="col-span-3"
                    variant={"destructive"}
                    onClick={() => onDelete(form.getValues().id)}
                  >
                    Eliminar
                  </Button>
                  <SheetClose asChild className="col-span-6">
                    <Button type="button" variant="outline" className="w-full">
                      Cerrar
                    </Button>
                  </SheetClose>
                </div>
              </form>
            </Form>
          )}
        </div>
      </SheetContent>
    </Sheet>*/

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
import { useState } from "react";
import {
  createColor,
  deleteColor,
  getColorById,
  updateColor,
} from "@/api/product/color.api";
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

interface Props {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

const CreateColorDialog: React.FC<Props> = ({ children, updateView }) => {
  //const [data, setData] = useState<GeneralInterfaces | never>();
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga

  const form = useForm<z.infer<typeof GeneralSchema>>({
    resolver: zodResolver(GeneralSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof GeneralSchema>) {
    setLoadingSave(true); // Inicia la carga
    createColor({ data: values })
      .then((updatedColor) => {
        console.log("Color creado:", updatedColor);

        toast("El color se creó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al crear el color:", error);
        toast("Hubo un error al crear el color.", {
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
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Gestión de color</DialogTitle>
          <DialogDescription>
            Mostrando datos relacionados con el color.
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

export default CreateColorDialog;

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

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { getColorById, updateColor } from "@/api/color.api";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define the type as a function that returns void
}

const ColorViewer: React.FC<Props> = ({ children, id, updateView }) => {
  //const [data, setData] = useState<GeneralInterfaces | never>();
  const [loading, setLoading] = useState(false); // Estado de carga

  const form = useForm<z.infer<typeof GeneralSchema>>({
    resolver: zodResolver(GeneralSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof GeneralSchema>) {
    setLoading(true); // Inicia la carga
    updateColor({ data: values })
      .then((updatedColor) => {
        console.log("Color actualizado:", updatedColor);

        toast("El color se actualizó correctamente.", {
          id: "id-unico",
          onDismiss: () => {
            console.log("hola");
          },
          duration: 100000,
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
        setLoading(false); // Finaliza la carga
      });
  }

  const fetchColors = async () => {
    setLoading(true); // Inicia la carga
    try {
      const colorData = await getColorById(id);
      console.log("Colores:", colorData);
      //setData(colorData);
      form.reset({
        id: colorData.id,
        name: colorData.name,
        description: colorData.description,
        state: true,
      });
    } catch (error) {
      console.error("Error al cargar los colores:", error);
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild onClick={fetchColors}>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className=" flex flex-col p-4">
        <div className=" mb-17  flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          <SheetTitle>
            <div className="flex gap-2 font-medium leading-none">
              Gestión de color
            </div>
            <div className="text-muted-foreground">
              Mostrando datos relacionados con el color.
            </div>
          </SheetTitle>
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
                    <FormItem className="col-span-6">
                      <FormLabel>Id</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Id"
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
                  <Button type="submit" className="col-span-2" disabled={!form.formState.isDirty}>
                    Guardar
                  </Button>
                  <Button type="button" className="col-span-2"  >
                    Desactivar
                  </Button>
                  <Button type="button" className="col-span-2" variant={"destructive"}>
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
    </Sheet>
  );
};

export default ColorViewer;

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "El nombre del producto debe tener al menos 2 caracteres.",
  }),
  productionQuantity: z.number().min(1, {
    message: "La cantidad debe ser al menos 1.",
  }),
  productionDate: z.string().nonempty({
    message: "La fecha de producción es obligatoria.",
  }),
  shift: z.string().nonempty({
    message: "El turno es obligatorio.",
  }),
  comments: z.string().optional(),
});


const HomePage = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productionQuantity: 0,
      productionDate: "",
      shift: "",
      comments: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input placeholder="Ejemplo: Botella de plástico" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productionQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad Producida</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ejemplo: 500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productionDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Producción</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shift"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turno</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Mañana</SelectItem>
                    <SelectItem value="afternoon">Tarde</SelectItem>
                    <SelectItem value="night">Noche</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentarios</FormLabel>
              <FormControl>
                <Textarea placeholder="Notas adicionales" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary mt-4">
          Guardar Producción
        </Button>
      </form>
    </Form>
  );
};

export default HomePage;

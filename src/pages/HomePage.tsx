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
import TypographyH2 from "@/components/h2-text";
import { DatePicker } from "@/components/date-picker";

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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-12 space-y-4 space-x-4  mx-auto"
      >
        <TypographyH2 className="col-span-12">
          Registro de producción
        </TypographyH2>

        <FormField
          control={form.control}
          name="shift"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Turno</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger disabled className=" w-full">
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
          name="shift"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Operador</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger disabled className=" w-full">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">op 1</SelectItem>
                    <SelectItem value="afternoon">op 2</SelectItem>
                    <SelectItem value="night">op 3</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shift"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Ayudante</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className=" w-full">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">op 1</SelectItem>
                    <SelectItem value="afternoon">op 2</SelectItem>
                    <SelectItem value="night">op 3</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shift"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Maquina</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger disabled className="w-full">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">maq 1</SelectItem>
                    <SelectItem value="afternoon">maq 2</SelectItem>
                    <SelectItem value="night">maq 3</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shift"
          render={({ field }) => (
            <FormItem className="col-span-12">
              <FormLabel>Producción planeada</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Bolsa 1</SelectItem>
                    <SelectItem value="afternoon">Bolsa 2</SelectItem>
                    <SelectItem value="night">Bolsa 3</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       

        <FormField
          control={form.control}
          name="productionQuantity"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Cantidad Planeada</FormLabel>
              <FormControl>
                <Input disabled type="number" placeholder="Ejemplo: 500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productionQuantity"
          render={({ field }) => (
            <FormItem className="col-span-3">
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
            <FormItem className="col-span-3">
              <FormLabel>Hora de Inicio</FormLabel>
              <FormControl>
                <DatePicker
                  className="w-full"
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) =>
                    field.onChange(date?.toISOString() || null)
                  }
                  placeholder="Selecciona una fecha"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productionDate"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Hora de Finalización</FormLabel>
              <FormControl>
                <DatePicker
                  className="w-full"
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) =>
                    field.onChange(date?.toISOString() || null)
                  }
                  placeholder="Selecciona una fecha"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem className="col-span-12">
              <FormLabel>Comentarios</FormLabel>
              <FormControl>
                <Textarea placeholder="Notas adicionales" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary mt-4 col-span-12">
          Guardar Producción
        </Button>
      </form>
    </Form>
  );
};

export default HomePage;

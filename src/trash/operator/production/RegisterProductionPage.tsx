import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import TypographyH2 from "@/components/text/h2-text";
import { DatePicker } from "@/components/date-picker";
import { EditableDataTable } from "@/trash/editableData-table";
import { makeData } from "@/utils/examples";
import { TitleContext } from "@/providers/title-provider";

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

//Componente
const RegisterProductionPage = () => {
  
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

  const [data, setData] = useState(() => makeData(10));
  const { setTitle } = useContext(TitleContext);

    useEffect(() => {
      setTitle("Registrar Producción");
    }, [])

  const updateData = (rowIndex: number, columnId: string, value: unknown) => {
    setData((old) =>
      old.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-16 gap-4 mx-auto "
      > 

        <FormField
          control={form.control}
          name="shift"
          render={({ field }) => (
            <FormItem className="col-span-8 xl:col-span-4">
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
            <FormItem className="col-span-8 xl:col-span-4">
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
            <FormItem className="col-span-8 xl:col-span-4">
              <FormLabel>Sector</FormLabel>
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
            <FormItem className="col-span-8 xl:col-span-4">
              <FormLabel>Sección</FormLabel>
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
            <FormItem className="col-span-8 xl:col-span-4">
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
            <FormItem className="col-span-8 xl:col-span-4">
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
            <FormItem className="col-span-16 xl:col-span-8">
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
            <FormItem className="col-span-4  xl:col-span-2">
              <FormLabel>Cant. Planeada</FormLabel>
              <FormControl>
                <Input
                  disabled
                  type="number"
                  placeholder="Ejemplo: 500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productionQuantity"
          render={({ field }) => (
            <FormItem className="col-span-4 xl:col-span-2">
              <FormLabel>Total</FormLabel>
              <FormControl>
                <Input
                  disabled
                  type="number"
                  placeholder="Ejemplo: 500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productionQuantity"
          render={({ field }) => (
            <FormItem className="col-span-4 xl:col-span-2">
              <FormLabel>Cant. Producida</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ejemplo: 500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productionQuantity"
          render={({ field }) => (
            <FormItem className="col-span-4 xl:col-span-2">
              <FormLabel>Total</FormLabel>
              <FormControl>
                <Input
                  disabled
                  type="number"
                  placeholder="Ejemplo: 500"
                  {...field}
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
            <FormItem className="col-span-8 xl:col-span-4">
              <FormLabel>Fecha y Hora de Inicio</FormLabel>
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
            <FormItem className="col-span-8 xl:col-span-4">
              <FormLabel>Tiempo Estimado (Min)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ejemplo: 500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem className="col-span-16">
              <FormLabel>Comentarios</FormLabel>
              <FormControl>
                <Textarea placeholder="Notas adicionales" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-16 space-y-2">
          <FormLabel>Receta</FormLabel>
          <EditableDataTable data={data} updateData={updateData} />
        </div>

        <Button type="submit" className="w-full bg-primary mt-4 col-span-16">
          Guardar Producción
        </Button>
      </form>
    </Form>
  );
};

export default RegisterProductionPage;

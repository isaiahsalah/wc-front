import React, { use, useContext, useEffect } from "react";
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
import TypographyH2 from "@/components/h2-text";
import { DatePicker } from "@/components/date-picker";
import { EditableDataTable } from "@/components/editableData-table";
import { makeData } from "@/utils/examples";
import TypographyP from "@/components/p-text";
import { TitleContext } from "@/providers/title-provider";
import { EditableDataTable2 } from "@/components/editableData-table2";
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

const RegisterProductPage = () => {
  const { setTitle } = useContext(TitleContext);
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

  const [data, setData] = React.useState(() => makeData(10));

  useEffect(() => {
    setTitle("Registrar Producto");
  }, []);

  /*
  const columns = React.useMemo(
    () => [
      {
        header: "Name",
        columns: [
          { accessorKey: "firstName", header: "First Name" },
          { accessorKey: "lastName", header: "Last Name" },
        ],
      },
      {
        header: "Info",
        columns: [
          { accessorKey: "age", header: "Age" },
          { accessorKey: "visits", header: "Visits" },
        ],
      },
    ],
    []
  );*/

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
                    <SelectItem value="morning">Bolsas</SelectItem>
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
              <FormLabel>Proceso</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className=" w-full">
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
              <FormLabel>Categoria </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className=" w-full">
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
              <FormLabel> Modelo</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className=" w-full">
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
              <FormLabel>Unidad</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Medida" />
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
          name="productionQuantity"
          render={({ field }) => (
            <FormItem className="col-span-4  xl:col-span-2 ">
              <FormLabel> Equivalencia</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Cantidad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shift"
          render={({ field }) => (
            <FormItem className="col-span-4 xl:col-span-2 mt-auto">
              <FormLabel></FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Medida" />
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
          name="productionQuantity"
          render={({ field }) => (
            <FormItem className="col-span-8  xl:col-span-4 ">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Cantidad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shift"
          render={({ field }) => (
            <FormItem className="col-span-4 xl:col-span-2">
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Color" />
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
            <FormItem className="col-span-4 xl:col-span-2">
              <FormLabel>Largo</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Metros" />
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
          <EditableDataTable2 data={[data[0]]} />
        </div>
        <div className=" col-span-16 flex w-full  gap-4 mt-4">
          <Button variant="outline" type="submit" className="flex-1 bg-primary  col-span-16">
            Cancelar
          </Button>

          <Button type="submit" className="flex-1  bg-primary  col-span-16">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterProductPage;

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {ProductionSchema, IMachine, IProduction} from "@/utils/interfaces";
import {zodResolver} from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import {createProductions} from "@/api/production/production.api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {getMachines} from "@/api/params/machine.api";
import {typeQuality} from "@/utils/const";
import {z} from "zod";
import {generateQR, printTag} from "@/utils/printTag";
import {DateTimePicker} from "@/components/DateTimePicker";

const ProductionOrderSchema = z.object({
  production: ProductionSchema,
  amount: z.number(),
});
type ProductionIOrder = z.infer<typeof ProductionOrderSchema>;

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
  idOrderDetail: number;
}

export const CreateProductionOrderDialog: React.FC<PropsCreate> = ({
  children,
  updateView,
  idOrderDetail,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [machines, setMachines] = useState<IMachine[]>();

  const form = useForm<ProductionIOrder>({
    resolver: zodResolver(ProductionOrderSchema),
    defaultValues: {
      production: {
        id_order_detail: idOrderDetail,
        id_lote: 0,
        id_user: 1, //editarr
      },
    },
  });

  function onSubmit(values: ProductionIOrder) {
    setLoadingSave(true);

    const productions: IProduction[] = [];
    const duration: number = values.production.duration / values.amount;

    // Crear 7 objetos e insertarlos en el array
    for (let i = 0; i < values.amount; i++) {
      const newDate =
        i === 0
          ? new Date(values.production.date) // Para la primera iteración, usamos la fecha original
          : new Date(productions[i - 1].date); // Para las siguientes iteraciones, copiamos la fecha del elemento anterior

      newDate.setMinutes(newDate.getMinutes() + duration); // Sumamos la duración en minutos

      productions.push({
        description: values.production.description, // 'A', 'B', 'C', etc.
        date: newDate,
        duration: duration,
        id_machine: values.production.id_machine,
        id_lote: values.production.id_lote,
        id_order_detail: values.production.id_order_detail,
        id_user: values.production.id_user,
        quality: values.production.quality,
      });
    }

    createProductions({data: productions})
      .then((updatedProduction) => {
        console.log("Producciones creada:", updatedProduction);
        generateQR({productions: updatedProduction}).then((QRs) => {
          printTag({productions: updatedProduction, QRs: QRs});
        });
        updateView();
      })
      .catch((error) => {
        console.error("Error al crear las producciones:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      const MachinesData = await getMachines();
      //const LotesData = await getLotes();
      //const OrderDetailsData = await getOrderDetails();

      setMachines(MachinesData);
      //setLotes(LotesData);
      //setOrderDetails(OrderDetailsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoadingInit(false);
    }
  };
  /*@ts-expect-error: Ignoramos el error en esta línea */

  const onError = (errors) => {
    console.error("Errores de validación:", errors); // Mostrar errores en consola
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={fetchData}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registro de producción</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la producción.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className=" grid   gap-4 ">
              <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="production.description"
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
                <FormField
                  control={form.control}
                  name="production.id_machine"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Maquina</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {machines?.map((product: IMachine) => (
                              <SelectItem key={product.id} value={(product.id ?? "").toString()}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Cantidad Producidad</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Cantidad"
                          type="number"
                          {...field}
                          onChange={(event) => field.onChange(Number(event.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="production.date"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Fecha</FormDescription>
                      <FormControl>
                        <DateTimePicker
                          className="w-full"
                          value={
                            field.value && typeof field.value === "string"
                              ? new Date(field.value)
                              : field.value
                          }
                          onChange={(date) => {
                            if (date) {
                              console.log("🚩🚩🚩🚩🚩🚩🚩", date);
                              field.onChange(date);
                            } else {
                              field.onChange(null);
                            }
                          }}
                          placeholder="Selecciona una fecha"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="production.duration"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Duración(m)</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Duración"
                          type="number"
                          {...field}
                          onChange={(event) => field.onChange(Number(event.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="production.quality"
                  render={({field}) => (
                    <FormItem className="col-span-6 ">
                      <FormDescription>Calidad de Producción</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Calidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeQuality.map((type) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className=" grid grid-cols-6  ">
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
        )}
      </DialogContent>
    </Dialog>
  );
};

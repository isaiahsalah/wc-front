import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {IOrderDetail, IOrder, OrderSchema, IProduct} from "@/utils/interfaces";
import {zodResolver} from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {useContext, useMemo, useState} from "react";
import {createOrderWithDetail} from "@/api/production/order.api";
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
import {DatePicker} from "@/components/date-picker";
import {getProducts} from "@/api/product/product.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Plus, X} from "lucide-react";
import DataTable from "@/components/table/DataTable";
import {ColumnDef, Row} from "@tanstack/react-table";
import {SectorContext} from "@/providers/sector-provider";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateOrderDetailDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const [products, setProducts] = useState<IProduct[]>([]);

  const [productSelected, setProductSelected] = useState<IProduct>();
  const [orderDetailsSelected, setOrderDetailsSelected] = useState<IOrderDetail[]>([]);

  const [amount, setAmount] = useState<number>();

  const {sector} = useContext(SectorContext);

  const form = useForm<IOrder>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      id_user: 1,
    },
  });

  function onSubmit(values: IOrder) {
    if (orderDetailsSelected.length <= 0) return;
    setLoadingSave(true);

    createOrderWithDetail({order: values, orderDetails: orderDetailsSelected})
      .then((updatedOrder) => {
        console.log("Orden creada:", updatedOrder);
        updateView();
      })
      .catch((error) => {
        console.error("Error al crear la orden:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      const ProductsData = await getProducts({id_sector: sector?.id, paranoid: true});
      setProducts(ProductsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  const addProductSelected = () => {
    if (productSelected && productSelected.id && amount && amount > 0)
      setOrderDetailsSelected([
        ...orderDetailsSelected,
        {
          amount: amount,
          id_product: productSelected.id,
          product: productSelected,
          id_order: 0,
        },
      ]);
  };

  const deleteProductSelected = (index: number) => {
    // Filtra la lista para excluir el producto seleccionado
    setOrderDetailsSelected(orderDetailsSelected.filter((_item, idx) => idx !== index));
  };

  // Generar columnas dinámicamente
  const columnsOrderDetailsSelected: ColumnDef<IOrderDetail>[] =
    /*@ts-expect-error: Ignoramos el error en esta línea */

    useMemo(() => {
      if (orderDetailsSelected.length === 0) return [];
      return [
        {
          accessorKey: "id_product",
          header: "Id de producto",
          cell: (info) => info.getValue(),
        },
        {
          accessorKey: "product",
          header: "Nombre de producto",
          cell: (info) => {
            /*@ts-expect-error: Ignoramos el error en esta línea */

            const product: IProduct = info.getValue();
            return product.name;
          },
        },
        {
          accessorKey: "amount",
          header: "Cantidad",
          cell: (info) => info.getValue(),
        },
        {
          id: "actions",
          header: "",
          enableHiding: false,
          cell: ({row}: {row: Row<IProduct>}) => {
            return (
              <div className="flex gap-2  justify-end  ">
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => deleteProductSelected(row.index)}
                >
                  <X />
                </Button>
              </div>
            );
          },
        },
      ];
    }, [orderDetailsSelected]);

  return (
    <Dialog>
      <DialogTrigger asChild onClick={fetchData}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar orden</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la orden.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" grid  gap-4 ">
              <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="init_date"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Inicio</FormDescription>
                      <FormControl>
                        <DatePicker
                          className="w-full"
                          value={
                            field.value && typeof field.value === "string"
                              ? new Date(field.value)
                              : field.value
                          }
                          onChange={(date) => {
                            const endDate = form.getValues("end_date");
                            if (endDate && date && new Date(date) > new Date(endDate)) {
                              console.log(
                                "La fecha de inicio no puede ser posterior a la fecha de fin."
                              );
                              return;
                            }
                            if (date) {
                              const adjustedDate = new Date(date);
                              adjustedDate.setHours(0, 0, 0, 0);
                              field.onChange(adjustedDate);
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
                  name="end_date"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>fin</FormDescription>
                      <FormControl>
                        <DatePicker
                          className="w-full"
                          value={
                            field.value && typeof field.value === "string"
                              ? new Date(field.value)
                              : field.value
                          }
                          onChange={(date) => {
                            const startDate = form.getValues("init_date");
                            if (startDate && date && new Date(date) < new Date(startDate)) {
                              console.log(
                                "La fecha de fin no puede ser anterior a la fecha de inicio."
                              );
                              return;
                            }

                            if (date) {
                              const adjustedDate = new Date(date);
                              adjustedDate.setHours(23, 59, 59, 999);
                              field.onChange(adjustedDate);
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
                <div className="w-full col-span-4 grid gap-2">
                  <FormDescription>Producto</FormDescription>
                  <Select
                    onValueChange={(value) => {
                      const selectedProduct = products?.find(
                        (product: IProduct) => product.id?.toString() === value
                      );
                      setProductSelected(selectedProduct); // Guarda el objeto completo
                    }} // Convertir el valor a número
                  >
                    <SelectTrigger className="w-full  ">
                      <SelectValue placeholder="Seleccionar Producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((process: IProduct) => (
                        <SelectItem key={process.id} value={(process.id ?? "").toString()}>
                          {process.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full col-span-1 grid gap-2">
                  <FormDescription>Cant.</FormDescription>
                  <Input
                    placeholder="Cantidad"
                    type="number"
                    onChange={(event) => setAmount(Number(event.target.value))}
                  />
                </div>
                <div className="w-full col-span-1 grid gap-2">
                  <FormDescription>Añadir</FormDescription>
                  <Button type="button" variant={"outline"} onClick={addProductSelected}>
                    <Plus />
                  </Button>
                </div>
                <div className="w-full col-span-6 grid gap-2">
                  <FormDescription>Añadir</FormDescription>
                  <DataTable
                    hasOptions={false}
                    hasPaginated={false}
                    actions={<></>}
                    columns={columnsOrderDetailsSelected}
                    data={orderDetailsSelected}
                  />
                </div>
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

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {IOrder, IOrderDetail, IProduct, IProduction, OrderSchema} from "@/utils/interfaces";
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
import {
  createOrderWithDetail,
  deleteOrder,
  getOrderById,
  recoverOrder,
  updateOrder,
} from "@/api/production/order.api";
import {toast} from "sonner";
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
import {DateTimePicker} from "@/components/DateTimePicker";
import {SectorContext} from "@/providers/sectorProvider";
import {getProducts} from "@/api/product/product.api";
import {ColumnDef, Row} from "@tanstack/react-table";
import {Plus, Trash2, X} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/table/DataTable";
import {SesionContext} from "@/providers/sesionProvider";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateOrderDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const [products, setProducts] = useState<IProduct[]>([]);

  const [productSelected, setProductSelected] = useState<IProduct>();
  const [orderDetailsSelected, setOrderDetailsSelected] = useState<IOrderDetail[]>([]);

  const [amount, setAmount] = useState<number>();

  const {sector} = useContext(SectorContext);
  const {sesion} = useContext(SesionContext);

  const form = useForm<IOrder>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      id_user: sesion?.user.id as number,
    },
  });

  function onSubmit(values: IOrder) {
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
  const columnsOrderDetailsSelected: ColumnDef<IOrderDetail>[] = useMemo(() => {
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
        cell: (info) => (info.getValue() as IProduct).name,
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
        cell: ({row}: {row: Row<IOrderDetail>}) => {
          return (
            <div className="flex gap-2  justify-end  ">
              <Button
                variant={"outline"}
                type="button"
                onClick={() => deleteProductSelected(row.index)}
                className="   text-red-600 dark:text-red-400"
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
                        <DateTimePicker
                          className="w-full"
                          value={
                            field.value && typeof field.value === "string"
                              ? new Date(field.value)
                              : field.value
                          }
                          onChange={(date) => {
                            if (date) {
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
                  name="end_date"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>fin</FormDescription>
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

interface PropsEdit {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

export const EditOrderDialog: React.FC<PropsEdit> = ({children, id, updateView, onOpenChange}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const [productSelected, setProductSelected] = useState<IProduct>();
  //const [orderDetailsSelected, setOrderDetailsSelected] = useState<IOrderDetail[]>();
  const [amount, setAmount] = useState<number>();
  const [products, setProducts] = useState<IProduct[]>([]);

  const {sector} = useContext(SectorContext);

  const form = useForm<IOrder>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {},
  });
  const orderDetails = form.watch("order_details");

  function onSubmit(values: IOrder) {
    setLoadingSave(true);
    //values.order_details = orderDetailsSelected;
    updateOrder({order: values})
      .then((updatedOrder) => {
        console.log("Orden actualizada:", updatedOrder);

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar la orden:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchOrder = async () => {
    setLoadingInit(true);
    try {
      const orderData: IOrder = await getOrderById(id);
      console.log("Órdenes:", orderData);
      form.reset({
        id: orderData.id,
        init_date: new Date(orderData.init_date),
        end_date: new Date(orderData.end_date),
        id_user: orderData.id_user,
        order_details: orderData.order_details,
      });
      const ProductsData = await getProducts({id_sector: sector?.id, paranoid: true});
      console.log("✖️✖️✖️", orderData);

      //setOrderDetailsSelected(orderData.order_details as IOrderDetail[]);
      setProducts(ProductsData);
    } catch (error) {
      console.error("Error al cargar las órdenes:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  function onDelete(id: number): void {
    setLoadingDelete(true);
    deleteOrder(id)
      .then((deletedOrder) => {
        console.log("Orden eliminada:", deletedOrder);

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la orden:", error);
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  }
  /*
  const addProductSelected = () => {
    if (productSelected && productSelected.id && amount && amount > 0) {
      const orderDetailTemp = form.getValues().order_details;

      form.reset({
        ...form.getValues(),
        order_details: [
          ...(orderDetailTemp ?? []),
          {
            amount: amount,
            id_product: productSelected.id,
            product: productSelected,
            id_order: 0,
          },
        ],
      });
    }
  };*/

  const deleteProductSelected = (index: number) => {
    // Filtra la lista para excluir el producto seleccionado
    //setOrderDetailsSelected(orderDetailsSelected?.filter((_item, idx) => idx !== index));
    form.reset({
      ...form.getValues(),
      order_details: orderDetails?.filter((_item, idx) => idx !== index),
    });
  };

  // Generar columnas dinámicamente
  const columnsOrderDetailsSelected: ColumnDef<IOrderDetail>[] = useMemo(() => {
    if (!orderDetails) return [];
    return [
      {
        accessorKey: "id",
        header: "Id",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "product",
        header: "Nombre de producto",
        cell: (info) => (info.getValue() as IProduct).name,
      },
      {
        accessorKey: "amount",
        header: "Cantidad",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "productionsGod",
        header: "Cant. Buena",
        cell: ({row}: {row: Row<IOrderDetail>}) =>
          row.original.productions
            ? (row.original.productions as IProduction[]).filter((obj) => obj.type_quality === 1)
                .length
            : "",
      },
      {
        accessorKey: "productionsBad",
        header: "Cant. Mala",
        cell: ({row}: {row: Row<IOrderDetail>}) =>
          row.original.productions
            ? (row.original.productions as IProduction[]).filter((obj) => obj.type_quality !== 1)
                .length
            : "",
      },
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({row}: {row: Row<IOrderDetail>}) => {
          return (
            <div className="flex gap-2  justify-end  ">
              <Button
                variant={"outline"}
                type="button"
                onClick={() => deleteProductSelected(row.index)}
                className="   text-red-600 dark:text-red-400"
              >
                <Trash2 />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [orderDetails]);

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchOrder}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar orden</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la orden.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" grid   gap-4 ">
              <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="id"
                  render={({field}) => (
                    <FormItem className={"col-span-6"}>
                      <FormDescription>Id</FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Id"
                          disabled
                          onChange={(event) => field.onChange(Number(event.target.value))}
                          defaultValue={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="init_date"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Inicio</FormDescription>
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
                  name="end_date"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>fin</FormDescription>
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
                <div className="w-full col-span-2 flex gap-2">
                  <div className="w-full col-span-full grid gap-2">
                    <FormDescription>Cant.</FormDescription>
                    <Input
                      placeholder="Cantidad"
                      type="number"
                      onChange={(event) => setAmount(Number(event.target.value))}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="order_details"
                    render={({field}) => (
                      <FormItem className="">
                        <FormDescription>Añadir</FormDescription>
                        <FormControl>
                          <Button
                            type="button"
                            variant={"outline"}
                            onClick={() => {
                              if (productSelected && productSelected.id && amount && amount > 0) {
                                const orderDetailTemp = field.value;

                                field.onChange([
                                  ...(orderDetailTemp ?? []),
                                  {
                                    amount: amount,
                                    id_product: productSelected.id,
                                    product: productSelected,
                                    id_order: 0,
                                  },
                                ]);
                              }
                            }}
                          >
                            <Plus />
                          </Button>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full col-span-6 grid gap-2   ">
                  <FormDescription>Orden Detalle</FormDescription>
                  <DataTable
                    hasOptions={false}
                    hasPaginated={false}
                    actions={<></>}
                    columns={columnsOrderDetailsSelected}
                    data={orderDetails ?? []}
                  />
                </div>
              </div>
              <DialogFooter className=" grid grid-cols-6  ">
                <Button type="submit" className="col-span-3" disabled={loadingSave}>
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

interface PropsDelete {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define el tipo como una función que retorna void
  onOpenChange?: (open: boolean) => void;
}

// Componente para eliminar una orden
export const DeleteOrderDialog: React.FC<PropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    deleteOrder(id)
      .then((deletedOrder) => {
        console.log("Orden eliminada:", deletedOrder);
        toast("La orden se eliminó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la orden:", error);
        toast("Hubo un error al eliminar la orden.", {
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar orden</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar esta orden?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="submit"
            disabled={loadingDelete}
            className="col-span-3"
            variant={"destructive"}
            onClick={onDelete}
          >
            {loadingDelete ? <LoadingCircle /> : "Eliminar"}
          </Button>
          <DialogClose className="col-span-3" asChild>
            <Button type="button" variant="outline" className="w-full" disabled={loadingDelete}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface PropsRecover {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define el tipo como una función que retorna void
  onOpenChange?: (open: boolean) => void;
}

// Componente para recuperar una orden
export const RecoverOrderDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingRecover, setLoadingRecover] = useState(false); // Estado de carga

  function onRecover(): void {
    setLoadingRecover(true); // Inicia la carga
    recoverOrder(id)
      .then((recoveredOrder) => {
        console.log("Orden recuperada:", recoveredOrder);
        toast("La orden se recuperó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar la orden:", error);
        toast("Hubo un error al recuperar la orden.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
      })
      .finally(() => {
        setLoadingRecover(false); // Finaliza la carga
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recuperar orden</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar esta orden?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="submit"
            disabled={loadingRecover}
            className="col-span-3"
            onClick={onRecover}
          >
            {loadingRecover ? <LoadingCircle /> : "Recuperar"}
          </Button>
          <DialogClose className="col-span-3" asChild>
            <Button type="button" variant="outline" className="w-full" disabled={loadingRecover}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

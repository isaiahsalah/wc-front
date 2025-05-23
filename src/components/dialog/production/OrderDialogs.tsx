import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {
  IGroup,
  IMachine,
  IOrder,
  IOrderDetail,
  IProcess,
  IProduct,
  IProduction,
  OrderSchema,
} from "@/utils/interfaces";
import {zodResolver} from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {useContext, useEffect, useMemo, useState} from "react";
import {
  createOrderWithDetails,
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
import {getProducts} from "@/api/product/product.api";
import {ColumnDef, Row} from "@tanstack/react-table";
import {ChevronsDown, Trash2} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/table/DataTable";
import {SesionContext} from "@/providers/sesionProvider";
import {getMachines} from "@/api/params/machine.api";
import {getProcesses} from "@/api/params/process.api";
import {getGroups} from "@/api/security/group.api";
import {typeTurn} from "@/utils/const";
import {ParamsContext} from "@/providers/processProvider";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateOrderDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [machines, setMachines] = useState<IMachine[]>([]);
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);

  const [productSelected, setProductSelected] = useState<IProduct>();
  const [machineSelected, setMachineSelected] = useState<IMachine>();
  const [processSelected, setProcessSelected] = useState<IProcess>();

  const [orderDetailsSelected, setOrderDetailsSelected] = useState<IOrderDetail[]>([]);

  const [amount, setAmount] = useState<number>();

  const {process} = useContext(ProcessContext);
  const {sesion} = useContext(SesionContext);

  const form = useForm<IOrder>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      id_user: sesion?.user.id as number,
    },
  });

  function onSubmit(values: IOrder) {
    setLoadingSave(true);

    createOrderWithDetails({order: values, orderDetails: orderDetailsSelected})
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
  useEffect(() => {
    getProcesses({}).then((ProcessesData) => setProcesses(ProcessesData));
    getGroups({}).then((GroupsData) => setGroups(GroupsData));
  }, []);

  useEffect(() => {
    fetchData();
  }, [processSelected]);

  const fetchData = async () => {
    try {
      const ProductsData = await getProducts({
        id_sector: params?.sector?.id,
        id_process: processSelected?.id,
      });
      const MachinesData = await getMachines({
        id_sector: params?.sector?.id,
        id_process: processSelected?.id,
      });

      setProducts(ProductsData);
      setMachines(MachinesData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const addProductSelected = () => {
    if (
      productSelected &&
      productSelected.id &&
      machineSelected &&
      machineSelected.id &&
      amount &&
      amount > 0
    )
      setOrderDetailsSelected([
        {
          amount: amount,
          id_product: productSelected.id,
          product: productSelected,
          id_order: 0,
          id_machine: machineSelected.id,
          machine: machineSelected,
        },
        ...orderDetailsSelected,
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
        accessorKey: "product",
        header: "Nombre de producto",
        cell: (info) => (info.getValue() as IProduct).name,
      },
      {
        accessorKey: "machine",
        header: "Maquina",
        cell: (info) => (info.getValue() as IMachine).name,
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
                <Trash2 />
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
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar orden</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la orden.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className=" grid  gap-4 "
          >
            <div className=" grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm">
              <FormField
                control={form.control}
                name="id_group"
                render={({field}) => (
                  <FormItem className="col-span-3">
                    <FormDescription>Grupo de trabajo</FormDescription>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar Grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups?.map((group: IGroup) => (
                            <SelectItem key={group.id} value={(group.id ?? "").toString()}>
                              {group.name}
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
                name="type_turn"
                render={({field}) => (
                  <FormItem className="col-span-3">
                    <FormDescription>Turno de trabajo</FormDescription>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar Turno" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeTurn?.map((turn) => (
                            <SelectItem key={turn.id} value={(turn.id ?? "").toString()}>
                              {turn.name}
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

              <div className="w-full col-span-6 grid grid-cols-6 gap-2 rounded-lg border shadow-sm p-4 bg-muted/30">
                <div className="w-full col-span-6 grid gap-2">
                  <FormDescription>Proceso</FormDescription>
                  <Select
                    onValueChange={(value) => {
                      const processProduct = processes?.find(
                        (process: IProcess) => process.id?.toString() === value
                      );
                      setProcessSelected(processProduct); // Guarda el objeto completo
                    }} // Convertir el valor a número
                  >
                    <SelectTrigger className="w-full  ">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {processes?.map((process: IProcess) => (
                        <SelectItem key={process.id} value={(process.id ?? "").toString()}>
                          {process.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full col-span-3 grid gap-2">
                  <FormDescription>Producto a ordear</FormDescription>
                  <Select
                    disabled={!processSelected}
                    onValueChange={(value) => {
                      const selectedProduct = products?.find(
                        (product: IProduct) => product.id?.toString() === value
                      );
                      setProductSelected(selectedProduct); // Guarda el objeto completo
                    }} // Convertir el valor a número
                  >
                    <SelectTrigger className="w-full  ">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product: IProduct) => (
                        <SelectItem key={product.id} value={(product.id ?? "").toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full col-span-2 grid gap-2">
                  <FormDescription>Máquina</FormDescription>
                  <Select
                    disabled={!processSelected}
                    onValueChange={(value) => {
                      const selectedMachine = machines?.find(
                        (machine: IMachine) => machine.id?.toString() === value
                      );
                      setMachineSelected(selectedMachine); // Guarda el objeto completo
                    }} // Convertir el valor a número
                  >
                    <SelectTrigger className="w-full  ">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines?.map((machine: IMachine) => (
                        <SelectItem key={machine.id} value={(machine.id ?? "").toString()}>
                          {machine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full col-span-1 grid gap-2">
                  <FormDescription>Cant.</FormDescription>
                  <Input
                    disabled={!processSelected}
                    placeholder="Cantidad"
                    type="number"
                    onChange={(event) => setAmount(Number(event.target.value))}
                  />
                </div>
                <div className="w-full col-span-6 grid gap-2">
                  <Button type="button" variant={"outline"} onClick={addProductSelected}>
                    <ChevronsDown />
                  </Button>
                </div>
              </div>
              <div className="w-full col-span-6 grid gap-2">
                <FormDescription>Productos Ordenados</FormDescription>
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
  const [machineSelected, setMachineSelected] = useState<IMachine>();
  const [processSelected, setProcessSelected] = useState<IProcess>();

  const [amount, setAmount] = useState<number>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [machines, setMachines] = useState<IMachine[]>([]);
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);

  const {process} = useContext(ProcessContext);
  const form = useForm<IOrder>({
    resolver: zodResolver(OrderSchema),
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

  useEffect(() => {
    getProcesses({}).then((ProcessesData) => setProcesses(ProcessesData));
    getGroups({}).then((GroupsData) => setGroups(GroupsData));
  }, []);

  useEffect(() => {
    fetchOrder();
  }, [processSelected]);

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
        id_group: orderData.id_group,
        type_turn: orderData.type_turn,

        order_details: orderData.order_details,
      });
      console.log("🤑🤑🤑", orderData.order_details);

      const ProductsData = await getProducts({
        id_sector: params?.sector?.id,
        id_process: processSelected?.id,
      });
      const MachinesData = await getMachines({
        id_sector: params?.sector?.id,
        id_process: processSelected?.id,
      });

      setProducts(ProductsData);
      setMachines(MachinesData);
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

  const addProductSelected = () => {
    if (productSelected && productSelected.id && amount && amount > 0) {
      const orderDetailTemp = form.getValues().order_details;

      form.reset({
        ...form.getValues(),
        order_details: [
          {
            amount: amount,
            id_product: productSelected.id,
            product: productSelected,
            id_machine: machineSelected?.id,
            machine: machineSelected,
            id_order: 0,
          },
          ...(orderDetailTemp ?? []),
        ],
      });
    }
  };

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
        cell: (info) => (info.getValue() as IProduct).name ?? "",
      },
      {
        accessorKey: "machine",
        header: "Nombre de máquina",
        cell: (info) => (info.getValue() as IMachine).name ?? "",
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
                disabled={
                  row.original.productions && row.original.productions.length > 0 ? true : false
                }
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
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar orden</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la orden.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" grid   gap-4 ">
            <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
              <FormField
                control={form.control}
                name="id_group"
                render={({field}) => (
                  <FormItem className="col-span-3">
                    <FormDescription>Grupo de trabajo</FormDescription>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar Grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups?.map((group: IGroup) => (
                            <SelectItem key={group.id} value={(group.id ?? "").toString()}>
                              {group.name}
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
                name="type_turn"
                render={({field}) => (
                  <FormItem className="col-span-3">
                    <FormDescription>Turno de trabajo</FormDescription>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar Turno" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeTurn?.map((turn) => (
                            <SelectItem key={turn.id} value={(turn.id ?? "").toString()}>
                              {turn.name}
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

              <div className="w-full col-span-6 grid grid-cols-6 gap-2 rounded-lg border shadow-sm p-4 bg-muted/30">
                <div className="w-full col-span-6 grid gap-2">
                  <FormDescription>Proceso</FormDescription>
                  <Select
                    onValueChange={(value) => {
                      const processProduct = processes?.find(
                        (process: IProcess) => process.id?.toString() === value
                      );
                      setProcessSelected(processProduct); // Guarda el objeto completo
                    }} // Convertir el valor a número
                  >
                    <SelectTrigger className="w-full  ">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {processes?.map((process: IProcess) => (
                        <SelectItem key={process.id} value={(process.id ?? "").toString()}>
                          {process.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full col-span-3 grid gap-2">
                  <FormDescription>Producto a ordear</FormDescription>
                  <Select
                    disabled={!processSelected}
                    onValueChange={(value) => {
                      const selectedProduct = products?.find(
                        (product: IProduct) => product.id?.toString() === value
                      );
                      setProductSelected(selectedProduct); // Guarda el objeto completo
                    }} // Convertir el valor a número
                  >
                    <SelectTrigger className="w-full  ">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product: IProduct) => (
                        <SelectItem key={product.id} value={(product.id ?? "").toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full col-span-2 grid gap-2">
                  <FormDescription>Máquina</FormDescription>
                  <Select
                    disabled={!processSelected}
                    onValueChange={(value) => {
                      const selectedMachine = machines?.find(
                        (machine: IMachine) => machine.id?.toString() === value
                      );
                      setMachineSelected(selectedMachine); // Guarda el objeto completo
                    }} // Convertir el valor a número
                  >
                    <SelectTrigger className="w-full  ">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines?.map((machine: IMachine) => (
                        <SelectItem key={machine.id} value={(machine.id ?? "").toString()}>
                          {machine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full col-span-1 grid gap-2">
                  <FormDescription>Cant.</FormDescription>
                  <Input
                    disabled={!processSelected}
                    placeholder="Cantidad"
                    type="number"
                    onChange={(event) => setAmount(Number(event.target.value))}
                  />
                </div>
                <div className="w-full col-span-6 grid gap-2">
                  <Button type="button" variant={"outline"} onClick={addProductSelected}>
                    <ChevronsDown />
                  </Button>
                </div>
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
              <Button type="submit" className="col-span-3" disabled={loadingSave || loadingInit}>
                {loadingSave ? <LoadingCircle /> : "Guardar"}
              </Button>
              <Button
                type="button"
                disabled={loadingDelete || loadingInit}
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
                  disabled={loadingDelete || loadingSave || loadingInit}
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

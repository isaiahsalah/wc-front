import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {
  IWorkGroup,
  IMachine,
  IProductionOrder,
  IProductionOrderDetail,
  IProduct,
  IProduction,
  ProductionOrderSchema,
} from "@/utils/interfaces";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useContext, useEffect, useMemo, useState} from "react";
import {
  createOrderWithDetails,
  hardDeleteOrder,
  getOrderById,
  recoverOrder,
  softDeleteOrder,
  updateOrder,
} from "@/api/production/order.api";
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
import {ChevronsDown, Edit, Trash2} from "lucide-react";
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
import {getGroups} from "@/api/security/group.api";
import {typeTurn} from "@/utils/const";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
import {toast} from "sonner";
import {Separator} from "@/components/ui/separator";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateOrderDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [machines, setMachines] = useState<IMachine[]>([]);
  const [groups, setGroups] = useState<IWorkGroup[]>([]);

  const [productSelected, setProductSelected] = useState<IProduct>();
  const [machineSelected, setMachineSelected] = useState<IMachine>();

  const [orderDetailsSelected, setOrderDetailsSelected] = useState<IProductionOrderDetail[]>([]);

  const [amount, setAmount] = useState<number>();

  const {sectorProcess} = useContext(SectorProcessContext);
  const {sesion} = useContext(SesionContext);

  useEffect(() => {
    if (sesion) {
      getGroups({}).then((GroupsData) => setGroups(GroupsData));
    }
  }, [sesion]);

  useEffect(() => {
    fetchData();
  }, [sectorProcess]);

  const form = useForm<IProductionOrder>({
    resolver: zodResolver(ProductionOrderSchema),
    defaultValues: {
      id_sys_user: sesion?.sys_user.id as number,
    },
  });

  function onSubmit(values: IProductionOrder) {
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
  const fetchData = async () => {
    try {
      const ProductsData = await getProducts({
        id_sector_process: sectorProcess?.id,
      });
      const MachinesData = await getMachines({
        id_sector_process: sectorProcess?.id,
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
          id_production_order: 0,
          id_machine: machineSelected.id,
          machine: machineSelected,
        },
        ...orderDetailsSelected,
      ]);
    else toast.warning("Selcciona el producto, máquina y cantidad");
  };

  const deleteProductSelected = (index: number) => {
    // Filtra la lista para excluir el producto seleccionado
    setOrderDetailsSelected(orderDetailsSelected.filter((_item, idx) => idx !== index));
  };

  // Generar columnas dinámicamente
  const columnsOrderDetailsSelected: ColumnDef<IProductionOrderDetail>[] = useMemo(() => {
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
        cell: ({row}: {row: Row<IProductionOrderDetail>}) => {
          return (
            <div className="flex gap-2  justify-end  ">
              <Button
                variant={"outline"}
                size={"sm"}
                type="button"
                onClick={() => deleteProductSelected(row.index)}
                className=" h-6 my-0.5 bg-red-500/20 hover:bg-red-500/70 hover:text-white dark:bg-red-500/20 dark:hover:bg-red-500/70 dark:hover:text-black"
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
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="grid gap-2"
          >
            <div className=" grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm">
              <FormField
                control={form.control}
                name="id_work_group"
                render={({field}) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                      >
                        <SelectTrigger className="w-full" size="sm">
                          <SelectValue placeholder="Grupo de trabajo" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups?.map((group: IWorkGroup) => (
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
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                      >
                        <SelectTrigger className="w-full" size="sm">
                          <SelectValue placeholder="Turno de trabajo" />
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
                        placeholder="Fecha de Inicio"
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
                        placeholder="Fecha de fin"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="col-span-6" />

              <div className="w-full col-span-3 grid gap-2">
                <Select
                  onValueChange={(value) => {
                    const selectedProduct = products?.find(
                      (product: IProduct) => product.id?.toString() === value
                    );
                    setProductSelected(selectedProduct); // Guarda el objeto completo
                  }} // Convertir el valor a número
                >
                  <SelectTrigger className="w-full  " size="sm">
                    <SelectValue placeholder="Producto a ordear" />
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
                <Select
                  onValueChange={(value) => {
                    const selectedMachine = machines?.find(
                      (machine: IMachine) => machine.id?.toString() === value
                    );
                    setMachineSelected(selectedMachine); // Guarda el objeto completo
                  }} // Convertir el valor a número
                >
                  <SelectTrigger className="w-full  " size="sm">
                    <SelectValue placeholder="Máquina" />
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
                <Input
                  placeholder="Cantidad"
                  type="number"
                  onChange={(event) => {
                    const value = event.target.value;
                    setAmount(value === "" ? undefined : Number(value));
                  }}
                />
              </div>
              <div className="w-full col-span-6 grid gap-2">
                <Button
                  type="button"
                  variant={"default"}
                  size={"sm"}
                  //className="  bg-green-600/20 hover:bg-green-600/70  hover:text-white dark:bg-green-600/20 dark:hover:bg-green-600/70  dark:hover:text-black"
                  onClick={addProductSelected}
                >
                  <ChevronsDown />
                  Añadir Orden
                  <ChevronsDown />
                </Button>
              </div>
              <div className="w-full col-span-6 grid gap-2">
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
  const [loadingInit, setLoadingInit] = useState(false);
  /*
  const [productSelected, setProductSelected] = useState<IProduct>();
  const [machineSelected, setMachineSelected] = useState<IMachine>();
  const [amount, setAmount] = useState<number>();*/

  const [orderDetailSelected, setOrderDetailSelected] = useState<IProductionOrderDetail>();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [machines, setMachines] = useState<IMachine[]>([]);
  const [groups, setGroups] = useState<IWorkGroup[]>([]);

  const {sesion} = useContext(SesionContext);

  const {sectorProcess} = useContext(SectorProcessContext);
  const form = useForm<IProductionOrder>({
    resolver: zodResolver(ProductionOrderSchema),
  });
  const orderDetails = form.watch("production_order_details");

  useEffect(() => {
    if (sesion) {
      getGroups({}).then((GroupsData) => setGroups(GroupsData));
    }
  }, [sesion]);

  useEffect(() => {
    fetchOrder();
  }, [sectorProcess]);

  function onSubmit(values: IProductionOrder) {
    setLoadingSave(true);
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
      const orderData: IProductionOrder = await getOrderById(id);
      console.log("Órdenes:", orderData);
      form.reset({
        id: orderData.id,
        init_date: new Date(orderData.init_date),
        end_date: new Date(orderData.end_date),
        id_sys_user: orderData.id_sys_user,
        id_work_group: orderData.id_work_group,
        type_turn: orderData.type_turn,

        production_order_details: orderData.production_order_details,
      });

      const ProductsData = await getProducts({
        id_sector_process: sectorProcess?.id,
      });
      const MachinesData = await getMachines({
        id_sector_process: sectorProcess?.id,
      });

      setProducts(ProductsData);
      setMachines(MachinesData);
    } catch (error) {
      console.error("Error al cargar las órdenes:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  const addProductSelected = () => {
    if (
      orderDetailSelected &&
      orderDetailSelected.id_machine &&
      orderDetailSelected.id_product &&
      orderDetailSelected.amount > 0
    ) {
      const orderDetailTemp: IProductionOrderDetail[] = form.getValues()
        .production_order_details as unknown as IProductionOrderDetail[];
      let newOrderDetails: IProductionOrderDetail[];
      if (orderDetailSelected.id) {
        newOrderDetails =
          orderDetailTemp.map((pod: IProductionOrderDetail) =>
            pod.id === orderDetailSelected.id ? orderDetailSelected : pod
          ) || [];
      } else {
        newOrderDetails = [
          {
            amount: orderDetailSelected.amount,
            id_product: orderDetailSelected.id_product,
            id_machine: orderDetailSelected.id_machine,
            machine: orderDetailSelected.machine,
            product: orderDetailSelected.product,
            id_production_order: id,
          },
          ...(orderDetailTemp ?? []),
        ];
      }

      form.reset({
        ...form.getValues(),
        production_order_details: newOrderDetails,
      });
    } else toast.warning("Selcciona el producto, máquina y cantidad");

    setOrderDetailSelected(undefined);
  };

  const deleteProductSelected = (index: number) => {
    // Filtra la lista para excluir el producto seleccionado
    //setOrderDetailsSelected(orderDetailsSelected?.filter((_item, idx) => idx !== index));
    form.reset({
      ...form.getValues(),
      production_order_details: orderDetails?.filter((_item, idx) => idx !== index),
    });
  };

  // Generar columnas dinámicamente
  const columnsOrderDetailsSelected: ColumnDef<IProductionOrderDetail>[] = useMemo(() => {
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
        cell: ({row}: {row: Row<IProductionOrderDetail>}) =>
          row.original.productions
            ? (row.original.productions as IProduction[]).filter((obj) => obj.type_quality === 1)
                .length
            : "",
      },
      {
        accessorKey: "productionsBad",
        header: "Cant. Mala",
        cell: ({row}: {row: Row<IProductionOrderDetail>}) =>
          row.original.productions
            ? (row.original.productions as IProduction[]).filter((obj) => obj.type_quality !== 1)
                .length
            : "",
      },
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({row}: {row: Row<IProductionOrderDetail>}) => {
          return (
            <div className="flex gap-2  justify-end  ">
              <Button
                variant={"outline"}
                size={"sm"}
                type="button"
                className=" h-6 my-0.5"
                onClick={() => {
                  setOrderDetailSelected(row.original);
                }}
              >
                <Edit />
              </Button>
              <Button
                disabled={
                  row.original.productions && row.original.productions.length > 0 ? true : false
                }
                size={"sm"}
                variant={"outline"}
                type="button"
                onClick={() => deleteProductSelected(row.index)}
                className="h-6 my-0.5 bg-red-500/20 hover:bg-red-500/70 hover:text-white dark:bg-red-500/20 dark:hover:bg-red-500/70 dark:hover:text-black"
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
      <DialogContent className="md:max-w-2xl ">
        <DialogHeader>
          <DialogTitle>Editar orden</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la orden.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className=" grid   gap-2 "
          >
            <div className="grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm">
              <FormField
                control={form.control}
                name="id_work_group"
                render={({field}) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger className="w-full" size="sm">
                          <SelectValue placeholder="Grupo de Trabajo" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups?.map((group: IWorkGroup) => (
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
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger className="w-full" size="sm">
                          <SelectValue placeholder="Turno de Trabajo" />
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
                        placeholder="Fecha de Inicio"
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
                        placeholder="Fecha de Fin"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="col-span-6" />

              <div className="w-full col-span-3 grid gap-2">
                <Select
                  value={orderDetailSelected?.id_product.toString()}
                  onValueChange={(value) => {
                    const selectedProduct = products?.find(
                      (product: IProduct) => product.id?.toString() === value
                    );
                    //setProductSelected(selectedProduct); // Guarda el objeto completo
                    setOrderDetailSelected(
                      orderDetailSelected
                        ? {
                            ...orderDetailSelected,
                            product: selectedProduct,
                            id_product: selectedProduct?.id ?? 0,
                          }
                        : selectedProduct
                        ? {
                            amount: 1,
                            id_product: selectedProduct.id ?? 0,
                            id_production_order: id,
                            id_machine: machines[0].id ?? 0,
                            machine: machines[0],
                            product: selectedProduct,
                          }
                        : undefined
                    );
                  }} // Convertir el valor a número
                >
                  <SelectTrigger className="w-full  " size="sm">
                    <SelectValue placeholder="Producto a Ordear" />
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
                <Select
                  value={orderDetailSelected?.id_machine.toString()}
                  onValueChange={(value) => {
                    const selectedMachine = machines?.find(
                      (machine: IMachine) => machine.id?.toString() === value
                    );
                    //setMachineSelected(selectedMachine); // Guarda el objeto completo
                    setOrderDetailSelected(
                      orderDetailSelected
                        ? {
                            ...orderDetailSelected,
                            machine: selectedMachine,
                            id_machine: selectedMachine?.id ?? 0,
                          }
                        : selectedMachine
                        ? {
                            amount: 1,
                            id_machine: selectedMachine.id ?? 0,
                            id_production_order: id,
                            id_product: products[0].id ?? 0,
                            product: products[0],
                            machine: selectedMachine,
                          }
                        : undefined
                    );
                  }} // Convertir el valor a número
                >
                  <SelectTrigger className="w-full  ">
                    <SelectValue placeholder="Máquina" />
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
                <Input
                  placeholder="Cantidad"
                  type="number"
                  value={orderDetailSelected?.amount}
                  onChange={(event) =>
                    setOrderDetailSelected(
                      orderDetailSelected
                        ? {
                            ...orderDetailSelected,
                            amount: Number(event.target.value),
                          }
                        : undefined
                    )
                  }
                />
              </div>
              <div className="w-full col-span-6 grid gap-2">
                <Button
                  type="button"
                  variant={"default"}
                  size={"sm"}
                  //className="  bg-green-600/20 hover:bg-green-600/70  hover:text-white dark:bg-green-600/20 dark:hover:bg-green-600/70  dark:hover:text-black"
                  onClick={addProductSelected}
                >
                  <ChevronsDown />
                  Añadir Orden
                  <ChevronsDown />
                </Button>
              </div>

              <div className="w-full col-span-6 grid gap-2   ">
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

              <DialogClose className="col-span-3" asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={loadingSave || loadingInit}
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

interface SoftPropsDelete {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define el tipo como una función que retorna void
  onOpenChange?: (open: boolean) => void;
}

export const SoftDeleteOrderDialog: React.FC<SoftPropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    softDeleteOrder(id)
      .then((deletedOrder) => {
        console.log("Orden eliminada:", deletedOrder);

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la orden:", error);
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
          <DialogTitle>Desactivar Orden</DialogTitle>
          <DialogDescription>¿Está seguro de desactivar esta Orden?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="submit"
            disabled={loadingDelete}
            className="col-span-3"
            variant={"destructive"}
            onClick={onDelete}
          >
            {loadingDelete ? <LoadingCircle /> : "Desactivar"}
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

interface PropsHardDelete {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define el tipo como una función que retorna void
  onOpenChange?: (open: boolean) => void;
}

export const HardDeleteOrderDialog: React.FC<PropsHardDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    hardDeleteOrder(id)
      .then((deletedOrder) => {
        console.log("Orden eliminada:", deletedOrder);

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la orden:", error);
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

        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar la orden:", error);
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
          <DialogTitle>Reactivar orden</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar esta orden?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-6 col-span-6">
          <Button
            type="submit"
            disabled={loadingRecover}
            className="col-span-3"
            onClick={onRecover}
          >
            {loadingRecover ? <LoadingCircle /> : "Reactivar"}
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

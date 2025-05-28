import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {
  ProductionSchema,
  IProduction,
  IProductionOrderDetail,
  IUnity,
  ISystemUser,
  IProductionUser,
} from "@/utils/interfaces";
import {addMinutes, format} from "date-fns";

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
import {useContext, useMemo, useState} from "react";
import {
  createProductions,
  deleteProduction,
  getProductionById,
  recoverProduction,
  updateProduction,
} from "@/api/production/production.api";
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
import {typeQuality, typeSize, typeTicket} from "@/utils/const";
import {DateTimePicker} from "@/components/DateTimePicker";
import {generateQR, printTag} from "@/utils/printTag";
import {getUnities} from "@/api/product/unity.api";
import {ChevronsDown, Trash2, X} from "lucide-react";
import TicketView from "@/components/TicketView";
import {toast} from "sonner";
import {getUsers} from "@/api/security/user.api";
import {SesionContext} from "@/providers/sesionProvider";
import DataTable from "@/components/table/DataTable";
import {ColumnDef, Row} from "@tanstack/react-table";
import {CardDescription} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

interface PropsCreates {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
  orderDetail: IProductionOrderDetail;
  type_screen: number;
}

export const CreateProductionsDialog: React.FC<PropsCreates> = ({
  children,
  updateView,
  orderDetail,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [baseUnities, setBaseUnities] = useState<IUnity[]>();
  const [baseUsers, setBaseUsers] = useState<ISystemUser[]>();

  //const [micronage, setMicronage] = useState<number>(orderDetail.product?.micronage ?? 0);
  //const [micronages, setMicronages] = useState<number[]>();
  const [selectTicket, setSelectTicket] = useState<number>(1);
  const [open, setOpen] = useState(false);

  const [productions, setProductions] = useState<IProduction[]>([]);
  const {sesion} = useContext(SesionContext);

  const form = useForm<IProduction>({
    resolver: zodResolver(ProductionSchema),
  });

  // Función personalizada para manejar el cambio de estado
  const handleOpenChange = (isOpen: boolean) => {
    setProductions([]);
    form.reset();
    setOpen(isOpen);
  };

  function addProduction() {
    if (orderDetail.product?.micronage && (form.getValues().micronage ?? []).length === 0)
      return toast.error("El micronaje no puede estar vacío");
    if (form.getValues().production_users?.length === 0)
      return toast.error("Seleciona al menos un operario");
    setProductions([
      ...(productions ?? []),
      {
        description: form.getValues().description,
        date: form.getValues().date,
        duration: form.getValues().duration,
        id_machine: form.getValues().id_machine,
        id_production_order_detail: form.getValues().id_production_order_detail,
        id_unit: form.getValues().id_unit,
        id_equivalent_unit: form.getValues().id_equivalent_unit,
        equivalent_amount: form.getValues().equivalent_amount,
        weight: form.getValues().weight,
        type_quality: form.getValues().type_quality,
        type_size: form.getValues().type_size,
        micronage: form.getValues().micronage,
        production_users: form.getValues().production_users,
      },
    ]);

    form.reset({
      ...form.getValues(),
      date: addMinutes(form.getValues().date, form.getValues().duration),
    });
  }

  function onSubmit() {
    if (!productions || productions?.length === 0) return toast.error("Introduzca producciones");

    setLoadingSave(true);
    createProductions({productions: productions})
      .then((updatedProduction) => {
        console.log("Producciones creada:", updatedProduction);
        generateQR({productions: updatedProduction}).then((QRs) => {
          printTag({
            productions: updatedProduction,
            QRs: QRs,
            ticketFormat: typeTicket.find((ticket) => ticket.id == selectTicket)
              ?.colums as string[],
          });
        });
        updateView();
      })
      .catch((error) => {
        console.error("Error al crear las producciones:", error);
      })
      .finally(() => {
        setOpen(false);
        setLoadingSave(false);
      });
  }

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      const BaseUnitiesData = await getUnities({});
      const BaseUsersData: ISystemUser[] = await getUsers({
        id_work_group: orderDetail.production_order?.id_work_group,
        //id_sector_process: sectorProcess?.id,
        //type_screen: type_screen,
        //type_module: getModuleBySesion({sesion: sesion as ISesion})?.id,
      });

      setBaseUnities(BaseUnitiesData);

      setBaseUsers(BaseUsersData);

      form.reset({
        date: new Date(),
        id_production_order_detail: orderDetail.id as number,
        id_machine: orderDetail.id_machine as number,
        id_unit: orderDetail.product?.id_unit,
        id_equivalent_unit: orderDetail.product?.id_equivalent_unit,
        equivalent_amount: Number(orderDetail.product?.equivalent_amount),
        weight: Number(orderDetail.product?.weight),
        production_users: [
          {
            id_sys_user: BaseUsersData.find((BaseUser) => BaseUser.id === sesion?.sys_user.id)?.id,
            sys_user: BaseUsersData.find((BaseUser) => BaseUser.id === sesion?.sys_user.id),
          },
        ] as IProductionUser[],
      });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  // Generar columnas dinámicamente
  const columnsProductions: ColumnDef<IProduction>[] = useMemo(() => {
    if (productions?.length === 0) return [];
    const columns: (ColumnDef<IProduction> | null)[] = [
      {
        accessorKey: "date",
        header: "Fecha",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {format(info.getValue() as Date, "dd/MM/yyyy HH:mm")}
          </Badge>
        ),
      },
      {
        accessorKey: "type_quality",
        header: "Calidad",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {typeQuality.find((item) => item.id === info.getValue())?.name}
          </Badge>
        ),
      },
      {
        accessorFn: (row) =>
          ` ${baseUnities?.find((unit) => unit.id === row.id_unit)?.name}`.trim(),
        accessorKey: "production_unit",
        header: "Unidad",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },
      {
        accessorFn: (row: IProduction) =>
          `${row.equivalent_amount} ${
            baseUnities?.find((unit) => unit.id === row.id_equivalent_unit)?.shortname
          }`.trim(),
        accessorKey: "production_equivalent_unit",
        header: "Equivalente",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },
      {
        accessorFn: (row) => `${row.weight} kg`.trim(),
        accessorKey: "weight",
        header: "Peso",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },
      orderDetail.product?.micronage
        ? {
            accessorKey: "micronage",
            header: "Micronaje",
            cell: (info) => (
              <Badge variant={"secondary"} className="text-muted-foreground">
                {(info.getValue() as []) ? (info.getValue() as []).join(" - ") : " - "}
              </Badge>
            ),
          }
        : null,
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({row}: {row: Row<IProduction>}) => {
          return (
            <div className="flex gap-2  justify-end  ">
              <Button
                variant={"outline"}
                type="button"
                onClick={() => {
                  const newValues = productions?.filter((_, i) => i !== row.index);
                  setProductions(newValues);
                }}
                className="bg-red-500/20 hover:bg-red-500/70 hover:text-white dark:bg-red-500/20 dark:hover:bg-red-500/70 dark:hover:text-black"
              >
                <Trash2 />
              </Button>
            </div>
          );
        },
      },
    ];
    return columns.filter((col): col is ColumnDef<IProduction> => col !== null);
  }, [productions]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={fetchData}>
        {children}
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registro de producción</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la producción.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(addProduction, (e) => console.log(e))}
              className=" grid   gap-2"
            >
              <div className="grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm max-h-[60vh] overflow-scroll">
                <FormField
                  control={form.control}
                  name="date"
                  render={({field}) => (
                    <FormItem className="col-span-2">
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
                              field.onChange(date);
                            } else {
                              field.onChange(null);
                            }
                          }}
                          placeholder="Selecciona"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({field}) => (
                    <FormItem className="col-span-1">
                      <FormDescription>Duración</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="min."
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
                  name="weight"
                  render={({field}) => (
                    <FormItem className="col-span-1">
                      <FormDescription>Peso(kg)</FormDescription>
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
                  name="id_unit"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormDescription>Unidad</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                          disabled
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Unidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {baseUnities?.map((product: IUnity) => (
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
                <div className="col-span-2 grid grid-cols-3 gap-2">
                  <FormDescription className="col-span-3">Cantidad Equivalente</FormDescription>

                  <FormField
                    control={form.control}
                    name="id_equivalent_unit"
                    render={({field}) => (
                      <FormItem className="col-span-2 ">
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                            defaultValue={field.value.toString()}
                            disabled
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar Unidad" />
                            </SelectTrigger>
                            <SelectContent>
                              {baseUnities?.map((product: IUnity, i) => (
                                <SelectItem key={i} value={(product.id ?? "").toString()}>
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
                    name="equivalent_amount"
                    render={({field}) => (
                      <FormItem className="col-span-1">
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
                </div>
                <FormField
                  control={form.control}
                  name="type_size"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormDescription>Tamaño</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeSize.map((type) => (
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

                <FormField
                  control={form.control}
                  name="type_quality"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormDescription>Calidad</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona" />
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

                {orderDetail.product?.micronage ? (
                  <FormField
                    control={form.control}
                    name="micronage"
                    render={({field}) => (
                      <FormItem className="col-span-3 flex flex-col gap-2">
                        <FormDescription className="col-span-3">Micronaje</FormDescription>

                        <Input
                          disabled={orderDetail.product?.micronage ? false : true}
                          type="number"
                          defaultValue={orderDetail.product?.micronage?.toString() ?? ""}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              const target = event.target as HTMLInputElement;
                              const numberValue = Number(target.value);
                              if (!isNaN(numberValue)) {
                                field.onChange([...(field.value ?? []), numberValue]);
                                target.value = "";
                              }
                            }
                          }}
                        />

                        <div className="grid grid-cols-3 gap-1  rounded-lg border p-3 ">
                          {field.value?.map((micro, index) => (
                            <Button
                              className="col-span-1"
                              size={"sm"}
                              variant={"destructive"}
                              type="submit"
                              onClick={() => {
                                const newValues = field.value?.filter((_, i) => i !== index);
                                field.onChange(newValues);
                              }}
                            >
                              {micro}
                            </Button>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                ) : null}

                <FormField
                  control={form.control}
                  name="production_users"
                  render={({field}) => (
                    <FormItem
                      className={`${orderDetail.product?.micronage ? "col-span-3" : "col-span-6"}`}
                    >
                      <FormDescription>Operadores</FormDescription>
                      <FormControl>
                        <div>
                          <Select
                            value={""}
                            onValueChange={(value) => {
                              const user = baseUsers?.find(
                                (baseUser) =>
                                  baseUser.id === Number(value) &&
                                  !field.value?.some(
                                    (productionUser: IProductionUser) =>
                                      productionUser.sys_user?.id === Number(value)
                                  )
                              );
                              if (user)
                                field.onChange([
                                  ...(field.value ?? []),
                                  {id_sys_user: user.id, sys_user: user},
                                ] as IProductionUser[]);
                            }}
                          >
                            <SelectTrigger className="w-full   ">
                              <SelectValue placeholder="Seleccionar Operador" />
                            </SelectTrigger>
                            <SelectContent>
                              {baseUsers?.map((user, i) => (
                                <SelectItem key={i} value={(user.id as number).toString()}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="grid grid-cols-2 gap-1  rounded-lg border p-3">
                            {field.value?.map((productionUser: IProductionUser, index) => (
                              <Button
                                className={`${
                                  orderDetail.product?.micronage ? "col-span-2" : "col-span-1 "
                                }`}
                                size={"sm"}
                                variant={"secondary"}
                                type="button"
                                onClick={() => {
                                  const newValues = field.value?.filter((_, i) => i !== index);

                                  field.onChange(newValues);
                                }}
                              >
                                {productionUser.sys_user?.name} {productionUser.sys_user?.lastname}{" "}
                                <X />
                              </Button>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({field}) => (
                    <FormItem className="col-span-6">
                      <FormDescription>Descripción</FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Notas adicionales"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full  grid gap-2">
                <Button
                  disabled={loadingSave}
                  type="submit"
                  variant={"outline"}
                  className="  bg-green-600/20 hover:bg-green-600/70  hover:text-white dark:bg-green-600/20 dark:hover:bg-green-600/70  dark:hover:text-black"
                >
                  <ChevronsDown />
                </Button>
              </div>
              <div className="w-full   grid gap-2">
                <FormDescription>Productos Producidos</FormDescription>
                <DataTable
                  hasOptions={false}
                  hasPaginated={false}
                  actions={<></>}
                  columns={columnsProductions}
                  data={productions}
                />
              </div>
              <div className="grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm max-h-[60vh] overflow-scroll">
                <div className="col-span-6 grid gap-2">
                  <CardDescription>Formato de Ticket</CardDescription>
                  <Select
                    onValueChange={(value) => setSelectTicket(Number(value))} // Convertir el valor a número
                    value={selectTicket.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar Calidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeTicket.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-6">
                  <div className="flex rounded-lg border p-3 shadow-sm">
                    <TicketView
                      ticketFormat={
                        typeTicket.find((ticket) => ticket.id === selectTicket)?.example as string[]
                      }
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
        )}
        <DialogFooter className=" grid grid-cols-6  ">
          <Button
            type="button"
            className="col-span-3"
            disabled={productions.length === 0 || loadingSave}
            onClick={onSubmit}
          >
            {loadingSave ? <LoadingCircle /> : "Guardar"}
          </Button>
          <DialogClose asChild className="col-span-3">
            <Button type="button" variant="outline" className="w-full" disabled={loadingSave}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
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

export const EditProductionDialog: React.FC<PropsEdit> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [baseUnities, setBaseUnities] = useState<IUnity[]>();

  const form = useForm<IProduction>({
    resolver: zodResolver(ProductionSchema),
  });

  function onSubmit(values: IProduction) {
    setLoadingSave(true);
    updateProduction({data: values})
      .then((updatedProduction) => {
        console.log("Producción actualizada:", updatedProduction);

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar la producción:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchProduction = async () => {
    setLoadingInit(true);
    try {
      const productionData: IProduction = await getProductionById(id);
      const BaseUnitiesData = await getUnities({});

      setBaseUnities(BaseUnitiesData);
      form.reset({
        ...productionData,
        micronage: productionData.micronage?.map((value) => parseFloat(value.toString())),
        equivalent_amount: parseFloat(productionData.equivalent_amount.toString()),
        weight: parseFloat(productionData.weight.toString()),
        date: new Date(productionData.date),
        createdAt: null,
        updatedAt: null,
      });
    } catch (error) {
      console.error("Error al cargar las producciones:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  function onDelete(id: number): void {
    setLoadingDelete(true);
    deleteProduction(id)
      .then((deletedProduction) => {
        console.log("Producción eliminada:", deletedProduction);

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la producción:", error);
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchProduction}>
        {children}
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestión de producción</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la producción.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className=" grid   gap-4 "
            >
              <div className="grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="lote"
                  render={({field}) => (
                    <FormItem className={"col-span-6"}>
                      <FormDescription>Lote</FormDescription>
                      <FormControl>
                        <Input disabled defaultValue={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({field}) => (
                    <FormItem className="col-span-6">
                      <FormDescription>Descripción</FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Notas adicionales"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormDescription>Fecha</FormDescription>
                      <FormControl>
                        <DateTimePicker
                          className="w-full"
                          value={new Date(field.value)}
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
                  name="duration"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormDescription>Duración(m)</FormDescription>
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
                  name="weight"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormDescription>Peso(kg)</FormDescription>
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
                  name="id_unit"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormDescription>Unidad</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                          disabled
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Unidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {baseUnities?.map((product: IUnity) => (
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
                <div className="col-span-2 grid grid-cols-3 gap-2">
                  <FormDescription className="col-span-3">Cantidad Equivalente</FormDescription>

                  <FormField
                    control={form.control}
                    name="id_equivalent_unit"
                    render={({field}) => (
                      <FormItem className="col-span-2 ">
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                            defaultValue={field.value.toString()}
                            disabled
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar Unidad" />
                            </SelectTrigger>
                            <SelectContent>
                              {baseUnities?.map((product: IUnity) => (
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
                    name="equivalent_amount"
                    render={({field}) => (
                      <FormItem className="col-span-1">
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
                </div>

                <FormField
                  control={form.control}
                  name="type_quality"
                  render={({field}) => (
                    <FormItem className="col-span-2 ">
                      <FormDescription>Calidad</FormDescription>
                      <FormControl>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Tipo" />
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

// Componente para eliminar una producción
export const DeleteProductionDialog: React.FC<PropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    deleteProduction(id)
      .then((deletedProduction) => {
        console.log("Producción eliminada:", deletedProduction);

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la producción:", error);
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
          <DialogTitle>Eliminar producción</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar esta producción?</DialogDescription>
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

// Componente para recuperar una producción
export const RecoverProductionDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingRecover, setLoadingRecover] = useState(false); // Estado de carga

  function onRecover(): void {
    setLoadingRecover(true); // Inicia la carga
    recoverProduction(id)
      .then((recoveredProduction) => {
        console.log("Producción recuperada:", recoveredProduction);

        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar la producción:", error);
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
          <DialogTitle>Recuperar producción</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar esta producción?</DialogDescription>
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

interface PropsPrintQR {
  children: React.ReactNode; // Define el tipo de children
  production: IProduction;
}

export const PrintQRDialog: React.FC<PropsPrintQR> = ({children, production}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [selectTicket, setSelectTicket] = useState<number>(1);

  function onPrint() {
    setLoadingSave(true);

    generateQR({productions: [production]})
      .then((QRs) => {
        printTag({
          productions: [production],
          QRs: QRs,
          ticketFormat: typeTicket.find((ticket) => ticket.id == selectTicket)?.colums as string[],
        });
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR de producción</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la producción.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
          <div className="col-span-3">
            <div>Formato de Ticket</div>
            <Select
              onValueChange={(value) => setSelectTicket(Number(value))} // Convertir el valor a número
              value={selectTicket.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar Calidad" />
              </SelectTrigger>
              <SelectContent>
                {typeTicket.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-6">
            <div className="flex rounded-lg border p-3 shadow-sm">
              <TicketView
                ticketFormat={
                  typeTicket.find((ticket) => ticket.id === selectTicket)?.example as string[]
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter className=" grid grid-cols-6  ">
          <Button onClick={onPrint} className="col-span-3">
            {loadingSave ? <LoadingCircle /> : "Imprimir"}
          </Button>
          <DialogClose asChild className="col-span-3">
            <Button type="button" variant="outline" className="w-full" disabled={loadingSave}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

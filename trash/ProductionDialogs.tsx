import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {ProductionSchema, IProduction, IMachine, ILote, IOrderDetail} from "@/utils/interfaces";
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
import {
  createProduction,
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
import {DatePicker} from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {getMachines} from "@/api/params/machine.api";
import {getLotes} from "@/api/inventory/lote.api";
import {getOrderDetails} from "@/api/production/orderDetail.api";
import {typeQuality} from "@/utils/const";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateProductionDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [machines, setMachines] = useState<IMachine[]>();
  const [lotes, setLotes] = useState<ILote[]>();
  const [orderDetails, setOrderDetails] = useState<IOrderDetail[]>();

  const form = useForm<IProduction>({
    resolver: zodResolver(ProductionSchema),
    defaultValues: {},
  });

  function onSubmit(values: IProduction) {
    setLoadingSave(true);
    createProduction({data: values})
      .then((updatedProduction) => {
        console.log("Producción creada:", updatedProduction);

        updateView();
      })
      .catch((error) => {
        console.error("Error al crear la producción:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      const MachinesData = await getMachines();
      const LotesData = await getLotes();
      const OrderDetailsData = await getOrderDetails();

      setMachines(MachinesData);
      setLotes(LotesData);
      setOrderDetails(OrderDetailsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoadingInit(false);
    }
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
            <form onSubmit={form.handleSubmit(onSubmit)} className=" grid   gap-4 ">
              <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="description"
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
                  name="amount"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Cantidad</FormDescription>
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
                  name="date"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Fecha</FormDescription>
                      <FormControl>
                        <DatePicker
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
                  name="duration"
                  render={({field}) => (
                    <FormItem className="col-span-3">
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
                  name="quality"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Calidad</FormDescription>
                      <FormControl>
                        <Select
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

                <FormField
                  control={form.control}
                  name="id_machine"
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
                  name="id_lote"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Lote</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {lotes?.map((product: ILote) => (
                              <SelectItem key={product.id} value={(product.id ?? "").toString()}>
                                {product.id}
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
                  name="id_order_detail"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Orden Detalle</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {orderDetails?.map((product: IOrderDetail) => (
                              <SelectItem key={product.id} value={(product.id ?? "").toString()}>
                                {product.id}
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

  const [machines, setMachines] = useState<IMachine[]>();
  const [lotes, setLotes] = useState<ILote[]>();
  const [orderDetails, setOrderDetails] = useState<IOrderDetail[]>();

  const form = useForm<IProduction>({
    resolver: zodResolver(ProductionSchema),
    defaultValues: {
      id: 0,
      description: "",
    },
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
      console.log("Producciones:", productionData);
      const MachinesData = await getMachines();
      const LotesData = await getLotes();
      const OrderDetailsData = await getOrderDetails();

      setMachines(MachinesData);
      setLotes(LotesData);
      setOrderDetails(OrderDetailsData);
      form.reset({
        id: productionData.id,
        description: productionData.description,
        amount: productionData.amount,
        date: productionData.date,
        duration: productionData.duration,
        quality: productionData.quality,
        id_lote: productionData.id_lote,
        id_machine: productionData.id_machine,
        id_order_detail: productionData.id_order_detail,
        id_user: productionData.id_user,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestión de producción</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la producción.</DialogDescription>
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
                  name="description"
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
                  name="amount"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Cantidad</FormDescription>
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
                  name="date"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Fecha</FormDescription>
                      <FormControl>
                        <DatePicker
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
                  name="duration"
                  render={({field}) => (
                    <FormItem className="col-span-3">
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
                  name="quality"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Calidad</FormDescription>
                      <FormControl>
                        <Select
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

                <FormField
                  control={form.control}
                  name="id_machine"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Maquina</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
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
                  name="id_lote"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Lote</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {lotes?.map((product: ILote) => (
                              <SelectItem key={product.id} value={(product.id ?? "").toString()}>
                                {product.id}
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
                  name="id_order_detail"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Orden Detalle</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {orderDetails?.map((product: IOrderDetail) => (
                              <SelectItem key={product.id} value={(product.id ?? "").toString()}>
                                {product.id}
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

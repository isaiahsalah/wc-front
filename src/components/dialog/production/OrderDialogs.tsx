import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { OrderInterfaces, OrderSchema } from "@/utils/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  recoverOrder,
  updateOrder,
} from "@/api/production/order.api";
import { toast } from "sonner";
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
import { DatePicker } from "@/components/date-picker";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateOrderDialog: React.FC<PropsCreate> = ({
  children,
  updateView,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);

  const form = useForm<OrderInterfaces>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      id_user: 1,
    },
  });

  function onSubmit(values: OrderInterfaces) {
    setLoadingSave(true);
    createOrder({ data: values })
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

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar orden</DialogTitle>
          <DialogDescription>
            Mostrando datos relacionados con la orden.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" grid  gap-4 "
          >
            <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
              <FormField
                control={form.control}
                name="init_date"
                render={({ field }) => (
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
                            console.log("La fecha de inicio no puede ser posterior a la fecha de fin.");
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
                render={({ field }) => (
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
                          if (
                            startDate &&
                            date &&
                            new Date(date) < new Date(startDate)
                          ) {
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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={loadingSave}
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

interface PropsEdit {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

export const EditOrderDialog: React.FC<PropsEdit> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const form = useForm<OrderInterfaces>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {},
  });

  function onSubmit(values: OrderInterfaces) {
    setLoadingSave(true);
    updateOrder({ data: values })
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
      const orderData: OrderInterfaces = await getOrderById(id);
      console.log("Órdenes:", orderData);
      form.reset({
        id: orderData.id,
        init_date: orderData.init_date,
        end_date: orderData.end_date,
        id_user: orderData.id_user,
      });
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
        setLoadingDelete(false);
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchOrder}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar orden</DialogTitle>
          <DialogDescription>
            Mostrando datos relacionados con la orden.
          </DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" grid   gap-4 "
            >
              <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem className={"col-span-6"}>
                      <FormDescription>Id</FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Id"
                          disabled
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
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
                render={({ field }) => (
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
                            console.log("La fecha de inicio no puede ser posterior a la fecha de fin.");
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
                render={({ field }) => (
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
                          if (
                            startDate &&
                            date &&
                            new Date(date) < new Date(startDate)
                          ) {
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
          <DialogDescription>
            ¿Está seguro de eliminar esta orden?
          </DialogDescription>
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
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loadingDelete}
            >
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
          <DialogDescription>
            ¿Está seguro de recuperar esta orden?
          </DialogDescription>
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
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loadingRecover}
            >
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

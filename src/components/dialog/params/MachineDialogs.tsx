import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {IMachine, MachineSchema, IProcess, ISector} from "@/utils/interfaces";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {useContext, useState} from "react";
import {
  createMachine,
  deleteMachine,
  getMachineById,
  recoverMachine,
  updateMachine,
} from "@/api/params/machine.api";
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
import {getProcesses} from "@/api/params/process.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {getSectors} from "@/api/params/sector.api";
import {SectorContext} from "@/providers/sectorProvider";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateMachineDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const [processes, setProcesses] = useState<IProcess[]>();
  const [sectors, setSectors] = useState<ISector[]>();

  const {sector} = useContext(SectorContext);

  const form = useForm<IMachine>({
    resolver: zodResolver(MachineSchema),
    defaultValues: {
      name: "",
      id_sector: sector?.id as number,
    },
  });

  function onSubmit(values: IMachine) {
    setLoadingSave(true);
    createMachine({data: values})
      .then((updatedMachine) => {
        console.log("Maquina creado:", updatedMachine);
        updateView();
      })
      .catch((error) => {
        console.error("Error al crear el Machineo:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      const ProcessesData = await getProcesses({});
      const SectorData = await getSectors({});

      setProcesses(ProcessesData);
      setSectors(SectorData);
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
          <DialogTitle>Registro de Machineo</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el Machineo.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (ex) => {
                console.log(ex);
              })}
              className=" grid  gap-4 "
            >
              <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem className="col-span-6">
                      <FormDescription>Nombre</FormDescription>
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
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
                  name="id_process"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Sector</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={(sector?.id as number).toString()}
                        >
                          <SelectTrigger disabled className="w-full">
                            <SelectValue placeholder="Seleccionar Sector" />
                          </SelectTrigger>
                          <SelectContent>
                            {sectors?.map((sector: IProcess) => (
                              <SelectItem key={sector.id} value={(sector.id ?? "").toString()}>
                                {sector.name}
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
                  name="id_process"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Proceso</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Proceso" />
                          </SelectTrigger>
                          <SelectContent>
                            {processes?.map((process: IProcess) => (
                              <SelectItem key={process.id} value={(process.id ?? "").toString()}>
                                {process.name}
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

export const EditMachineDialog: React.FC<PropsEdit> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const [processes, setProcesses] = useState<IProcess[]>();
  const [sectors, setSectors] = useState<ISector[]>();

  const form = useForm<IMachine>({
    resolver: zodResolver(MachineSchema),
  });

  function onSubmit(values: IMachine) {
    setLoadingSave(true);
    updateMachine({data: values})
      .then((updatedMachine) => {
        console.log("Machineo actualizado:", updatedMachine);

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el Machineo:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchMachine = async () => {
    setLoadingInit(true);
    try {
      const MachineData: IMachine = await getMachineById(id);

      const ProcessesData = await getProcesses({});
      const SectorData = await getSectors({});

      setProcesses(ProcessesData);
      setSectors(SectorData);
      form.reset({
        id: MachineData.id,
        name: MachineData.name,
        description: MachineData.description,
        id_process: MachineData.id_process,
        id_sector: MachineData.id_sector,
        active: MachineData.active,
      });
    } catch (error) {
      console.error("Error al cargar los Machineos:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  function onDelete(id: number): void {
    setLoadingDelete(true);
    deleteMachine(id)
      .then((deletedMachine) => {
        console.log("Machineo eliminado:", deletedMachine);

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el Machineo:", error);
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchMachine}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestión de Machineo</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el Machineo.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" grid   gap-4 ">
              <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="id"
                  render={({field}) => (
                    <FormItem className={"col-span-2"}>
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
                  name="name"
                  render={({field}) => (
                    <FormItem className="col-span-4">
                      <FormDescription>Nombre</FormDescription>
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
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
                  name="id_process"
                  render={({field}) => (
                    <FormItem className="col-span-6 ">
                      <FormDescription>Sector</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger disabled className="w-full">
                            <SelectValue placeholder="Seleccionar Sector" />
                          </SelectTrigger>
                          <SelectContent>
                            {sectors?.map((sector: IProcess) => (
                              <SelectItem key={sector.id} value={(sector.id ?? "").toString()}>
                                {sector.name}
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
                  name="id_process"
                  render={({field}) => (
                    <FormItem className="col-span-6 ">
                      <FormDescription>Proceso</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Proceso" />
                          </SelectTrigger>
                          <SelectContent>
                            {processes?.map((process: IProcess) => (
                              <SelectItem key={process.id} value={(process.id ?? "").toString()}>
                                {process.name}
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

// Componente para eliminar un Machineo
export const DeleteMachineDialog: React.FC<PropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    deleteMachine(id)
      .then((deletedMachine) => {
        console.log("Machineo eliminado:", deletedMachine);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el Machineo:", error);
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
          <DialogTitle>Eliminar Machineo</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar este Machineo?</DialogDescription>
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

// Componente para recuperar un Machineo
export const RecoverMachineDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingRecover, setLoadingRecover] = useState(false); // Estado de carga

  function onRecover(): void {
    setLoadingRecover(true); // Inicia la carga
    recoverMachine(id)
      .then((recoveredMachine) => {
        console.log("Machineo recuperado:", recoveredMachine);
        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar el Machineo:", error);
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
          <DialogTitle>Recuperar Machineo</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar este Machineo?</DialogDescription>
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

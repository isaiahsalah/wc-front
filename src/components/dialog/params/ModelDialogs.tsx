import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {IModel, ModelSchema, IProcess, ISector} from "@/utils/interfaces";
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
import {useContext, useEffect, useState} from "react";
import {
  createModel,
  deleteModel,
  getModelById,
  recoverModel,
  updateModel,
} from "@/api/params/model.api";
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
import {getSectors} from "@/api/params/sector.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {SesionContext} from "@/providers/sesionProvider";
import {getSectorBySesion} from "@/utils/funtions";
import {ProcessContext} from "@/providers/processProvider";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateModelDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [processes, setProcesses] = useState<IProcess[]>();
  const [sectors, setSectors] = useState<ISector[]>();

  const [sector, setSector] = useState<ISector>();
  const {process} = useContext(ProcessContext);

  const {sesion} = useContext(SesionContext);

  useEffect(() => {
    if (sesion) getSectorBySesion({sesion: sesion}).then((sec) => setSector(sec));
  }, []);

  useEffect(() => {
    form.reset({...form.getValues(), id_process: process?.id as number});
  }, [process]);

  const form = useForm<IModel>({
    resolver: zodResolver(ModelSchema),
    defaultValues: {
      name: "",
      id_sector: sector?.id as number,
      id_process: process?.id as number,
    },
  });

  function onSubmit(values: IModel) {
    setLoadingSave(true);
    createModel({data: values})
      .then((updatedModel) => {
        console.log("Modelo creado:", updatedModel);
        updateView();
      })
      .catch((error) => {
        console.error("Error al crear el modelo:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      const ProcessesData = await getProcesses({});
      const SectorsData = await getSectors({});

      setProcesses(ProcessesData);
      setSectors(SectorsData);
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
          <DialogTitle>Registro de modelo</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el modelo.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" grid  gap-4 ">
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
                  name="id_sector"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Sector</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          value={sector?.id?.toString() as string}
                        >
                          <SelectTrigger className="w-full" disabled>
                            <SelectValue placeholder="Seleccionar Sector" />
                          </SelectTrigger>
                          <SelectContent>
                            {sectors?.map((product: ISector) => (
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
                  name="id_process"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Proceso</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                          disabled
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

export const EditModelDialog: React.FC<PropsEdit> = ({children, id, updateView, onOpenChange}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const [processes, setProcesses] = useState<IProcess[]>();
  const [sectors, setSectors] = useState<ISector[]>();

  const form = useForm<IModel>({
    resolver: zodResolver(ModelSchema),
  });

  function onSubmit(values: IModel) {
    setLoadingSave(true);
    updateModel({data: values})
      .then((updatedModel) => {
        console.log("Modelo actualizado:", updatedModel);

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el modelo:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchModel = async () => {
    setLoadingInit(true);
    try {
      const modelData: IModel = await getModelById(id);
      console.log("Modelos:", modelData);

      const ProcessesData = await getProcesses({});
      const SectorsData = await getSectors({});

      setProcesses(ProcessesData);
      setSectors(SectorsData);
      form.reset({
        id: modelData.id,
        name: modelData.name,
        description: modelData.description,
        id_process: modelData.id_process,
        id_sector: modelData.id_sector,
      });
    } catch (error) {
      console.error("Error al cargar los modelos:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  function onDelete(id: number): void {
    setLoadingDelete(true);
    deleteModel(id)
      .then((deletedModel) => {
        console.log("Modelo eliminado:", deletedModel);

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el modelo:", error);
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchModel}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestión de modelo</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el modelo.</DialogDescription>
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
                    <FormItem className="col-span-3 ">
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

                <FormField
                  control={form.control}
                  name="id_sector"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Sector</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full" disabled>
                            <SelectValue placeholder="Seleccionar Sector" />
                          </SelectTrigger>
                          <SelectContent>
                            {sectors?.map((product: ISector) => (
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

// Componente para eliminar un modelo
export const DeleteModelDialog: React.FC<PropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    deleteModel(id)
      .then((deletedModel) => {
        console.log("Modelo eliminado:", deletedModel);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el modelo:", error);
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
          <DialogTitle>Eliminar modelo</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar este modelo?</DialogDescription>
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

// Componente para recuperar un modelo
export const RecoverModelDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingRecover, setLoadingRecover] = useState(false); // Estado de carga

  function onRecover(): void {
    setLoadingRecover(true); // Inicia la carga
    recoverModel(id)
      .then((recoveredModel) => {
        console.log("Modelo recuperado:", recoveredModel);
        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar el modelo:", error);
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
          <DialogTitle>Recuperar modelo</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar este modelo?</DialogDescription>
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

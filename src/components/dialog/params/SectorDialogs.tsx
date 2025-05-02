import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {ISector, SectorSchema} from "@/utils/interfaces";
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
import {useState} from "react";
import {
  createSector,
  deleteSector,
  getSectorById,
  recoverSector,
  updateSector,
} from "@/api/params/sector.api";
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

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateSectorDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false);

  const form = useForm<ISector>({
    resolver: zodResolver(SectorSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: ISector) {
    setLoadingSave(true);
    createSector({data: values})
      .then((updatedSector) => {
        console.log("Sectoro creado:", updatedSector);
        updateView();
      })
      .catch((error) => {
        console.error("Error al crear el Sectoro:", error);
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
          <DialogTitle>Registro de Sectoro</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el Sectoro.</DialogDescription>
        </DialogHeader>
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

export const EditSectorDialog: React.FC<PropsEdit> = ({children, id, updateView, onOpenChange}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const form = useForm<ISector>({
    resolver: zodResolver(SectorSchema),
  });

  function onSubmit(values: ISector) {
    setLoadingSave(true);
    updateSector({data: values})
      .then((updatedSector) => {
        console.log("Sectoro actualizado:", updatedSector);

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el Sectoro:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchSector = async () => {
    setLoadingInit(true);
    try {
      const SectorData: ISector = await getSectorById(id);
      console.log("Sectoros:", SectorData);

      form.reset({
        id: SectorData.id,
        name: SectorData.name,
        description: SectorData.description,
      });
    } catch (error) {
      console.error("Error al cargar los Sectoros:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  function onDelete(id: number): void {
    setLoadingDelete(true);
    deleteSector(id)
      .then((deletedSector) => {
        console.log("Sectoro eliminado:", deletedSector);

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el Sectoro:", error);
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchSector}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestión de Sectoro</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el Sectoro.</DialogDescription>
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

// Componente para eliminar un Sectoro
export const DeleteSectorDialog: React.FC<PropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    deleteSector(id)
      .then((deletedSector) => {
        console.log("Sectoro eliminado:", deletedSector);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el Sectoro:", error);
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
          <DialogTitle>Eliminar Sectoro</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar este Sectoro?</DialogDescription>
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

// Componente para recuperar un Sectoro
export const RecoverSectorDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingRecover, setLoadingRecover] = useState(false); // Estado de carga

  function onRecover(): void {
    setLoadingRecover(true); // Inicia la carga
    recoverSector(id)
      .then((recoveredSector) => {
        console.log("Sectoro recuperado:", recoveredSector);
        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar el Sectoro:", error);
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
          <DialogTitle>Recuperar Sectoro</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar este Sectoro?</DialogDescription>
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

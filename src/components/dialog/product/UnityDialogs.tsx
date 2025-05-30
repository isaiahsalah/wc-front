import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {z} from "zod";
import {UnitySchema} from "@/utils/interfaces";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useState} from "react";
import {
  createUnity,
  hardDeleteUnit,
  getUnityById,
  recoverUnity,
  softDeleteUnit,
  updateUnity,
} from "@/api/product/unity.api";
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

export const CreateUnityDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false);

  const form = useForm<z.infer<typeof UnitySchema>>({
    resolver: zodResolver(UnitySchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof UnitySchema>) {
    setLoadingSave(true);
    createUnity({data: values})
      .then((updatedUnity) => {
        console.log("Unity creada:", updatedUnity);
        form.reset();
        updateView();
      })
      .catch((error) => {
        console.error("Error al crear la unidad:", error);
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
          <DialogTitle>Gestión de unidad</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la unidad.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className=" grid grid-cols-6 gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem className="col-span-3">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortname"
              render={({field}) => (
                <FormItem className="col-span-3">
                  <FormLabel>Abreviación</FormLabel>
                  <FormControl>
                    <Input placeholder="Abreviación" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className=" grid grid-cols-6 col-span-6">
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

export const EditUnityDialog: React.FC<PropsEdit> = ({children, id, updateView, onOpenChange}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const form = useForm<z.infer<typeof UnitySchema>>({
    resolver: zodResolver(UnitySchema),
    defaultValues: {
      id: 0,
      name: "",
      shortname: "",
    },
  });

  function onSubmit(values: z.infer<typeof UnitySchema>) {
    setLoadingSave(true);
    updateUnity({data: values})
      .then((updatedUnity) => {
        console.log("Unidad actualizada:", updatedUnity);

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar la unidad:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchUnity = async () => {
    setLoadingInit(true);
    try {
      const unityData = await getUnityById(id);
      console.log("Unidad:", unityData);
      form.reset({
        id: unityData.id,
        name: unityData.name,
        shortname: unityData.shortname,
      });
    } catch (error) {
      console.error("Error al cargar la unidad:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchUnity}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestión de unidad</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la unidad.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className=" grid grid-cols-6 gap-4 "
            >
              <FormField
                control={form.control}
                name="id"
                render={({field}) => (
                  <FormItem className={"col-span-6"}>
                    <FormLabel>Id</FormLabel>
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
                  <FormItem className="col-span-3">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortname"
                render={({field}) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Abreviación</FormLabel>
                    <FormControl>
                      <Input placeholder="Abreviación" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className=" grid grid-cols-6 col-span-6">
                <Button
                  type="submit"
                  className="col-span-3"
                  disabled={!form.formState.isDirty || loadingSave}
                >
                  {loadingSave ? <LoadingCircle /> : "Guardar"}
                </Button>

                <DialogClose className="col-span-6" asChild>
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

interface SoftPropsDelete {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define el tipo como una función que retorna void
  onOpenChange?: (open: boolean) => void;
}

export const SoftDeleteUnityDialog: React.FC<SoftPropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    softDeleteUnit(id)
      .then((deletedUnity) => {
        console.log("Unidad eliminada:", deletedUnity);

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la unidad:", error);
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
          <DialogTitle>Desactivar Unidad</DialogTitle>
          <DialogDescription>¿Está seguro de desactivar esta Unidad?</DialogDescription>
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

export const HardDeleteUnityDialog: React.FC<PropsHardDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    hardDeleteUnit(id)
      .then((deletedUnity) => {
        console.log("Unidad eliminada:", deletedUnity);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la unidad:", error);
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
          <DialogTitle>Eliminar Unidad</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar esta Unidad?</DialogDescription>
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

// Componente para recuperar una unidad
export const RecoverUnityDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingRecover, setLoadingRecover] = useState(false); // Estado de carga

  function onRecover(): void {
    setLoadingRecover(true); // Inicia la carga
    recoverUnity(id)
      .then((recoveredUnity) => {
        console.log("Unidad recuperada:", recoveredUnity);

        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar la unidad:", error);
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
          <DialogTitle>Recuperar unidad</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar esta unidad?</DialogDescription>
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

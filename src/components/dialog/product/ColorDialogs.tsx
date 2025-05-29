import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
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
  createColor,
  getColorById,
  hardDeleteColor,
  recoverColor,
  softDeleteColor,
  updateColor,
} from "@/api/product/color.api";
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
import {IColor, ColorSchema} from "@/utils/interfaces";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateColorDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  //const [data, setData] = useState<IGeneral | never>();
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga

  const form = useForm<IColor>({
    resolver: zodResolver(ColorSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: IColor) {
    setLoadingSave(true); // Inicia la carga
    createColor({data: values})
      .then((updatedColor) => {
        console.log("Color creado:", updatedColor);

        updateView();
      })
      .catch((error) => {
        console.error("Error al crear el color:", error);
      })
      .finally(() => {
        setLoadingSave(false); // Finaliza la carga
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestión de color</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el color.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className=" grid grid-cols-6 gap-2 "
          >
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

export const EditColorDialog: React.FC<PropsEdit> = ({children, id, updateView, onOpenChange}) => {
  //const [data, setData] = useState<IGeneral | never>();
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  const [loadingInit, setLoadingInit] = useState(false); // Estado de carga

  const form = useForm<IColor>({
    resolver: zodResolver(ColorSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
    },
  });

  function onSubmit(values: IColor) {
    setLoadingSave(true); // Inicia la carga
    updateColor({data: values})
      .then((updatedColor) => {
        console.log("Color actualizado:", updatedColor);

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el color:", error);
      })
      .finally(() => {
        setLoadingSave(false); // Finaliza la carga
      });
  }

  const fetchColor = async () => {
    setLoadingInit(true); // Inicia la carga
    try {
      const colorData = await getColorById(id);
      console.log("Colores:", colorData);
      //setData(colorData);
      form.reset({
        id: colorData.id,
        name: colorData.name,
        description: colorData.description,
      });
    } catch (error) {
      console.error("Error al cargar los colores:", error);
    } finally {
      setLoadingInit(false); // Finaliza la carga
    }
  };

  function onDelete(id: number): void {
    console.log("Color eliminado:");
    setLoadingDelete(true); // Inicia la carga
    softDeleteColor(id)
      .then((deleteColor) => {
        console.log("Color eliminado:", deleteColor);

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el color:", error);
      })
      .finally(() => {
        setLoadingDelete(false); // Finaliza la carga
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchColor}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestión de color</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el color.</DialogDescription>
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

              <DialogFooter className=" grid grid-cols-6 col-span-6">
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

interface SoftPropsDelete {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

export const SoftDeleteColorDialog: React.FC<SoftPropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  //const [data, setData] = useState<IGeneral | never>();
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    softDeleteColor(id)
      .then((deleteColor) => {
        console.log("Color eliminado:", deleteColor);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el color:", error);
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
          <DialogTitle>Eliminar color</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar este color?</DialogDescription>
        </DialogHeader>

        <DialogFooter className=" grid grid-cols-6 col-span-6">
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

interface HardPropsDelete {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

export const HardDeleteColorDialog: React.FC<HardPropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  //const [data, setData] = useState<IGeneral | never>();
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    hardDeleteColor(id)
      .then((deleteColor) => {
        console.log("Color eliminado:", deleteColor);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el color:", error);
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
          <DialogTitle>Eliminar color</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar este color?</DialogDescription>
        </DialogHeader>

        <DialogFooter className=" grid grid-cols-6 col-span-6">
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
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

export const RecoverColorDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  //const [data, setData] = useState<IGeneral | never>();
  const [loadingRecover, setLoadingRecover] = useState(false); // Estado de carga

  function onRecover(): void {
    setLoadingRecover(true); // Inicia la carga
    recoverColor(id)
      .then((recoverColor) => {
        console.log("Color eliminado:", recoverColor);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el color:", error);
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
          <DialogTitle>Recuperar color</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar este color?</DialogDescription>
        </DialogHeader>

        <DialogFooter className=" grid grid-cols-6 col-span-6">
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

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormulaSchema } from "@/utils/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  createFormula,
  deleteFormula,
  getFormulaById,
  recoverFormula,
  updateFormula,
} from "@/api/product/formula.api";
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

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateFormulaDialog: React.FC<PropsCreate> = ({ children, updateView }) => {
  const [loadingSave, setLoadingSave] = useState(false);

  const form = useForm<z.infer<typeof FormulaSchema>>({
    resolver: zodResolver(FormulaSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormulaSchema>) {
    setLoadingSave(true);
    createFormula({ data: values })
      .then((updatedFormula) => {
        console.log("Fórmula creada:", updatedFormula);

        toast("La fórmula se creó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al crear la fórmula:", error);
        toast("Hubo un error al crear la fórmula.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestión de fórmula</DialogTitle>
          <DialogDescription>
            Mostrando datos relacionados con la fórmula.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" grid grid-cols-6 gap-4 "
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-6">
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
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas adicionales" {...field} />
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

export const EditFormulaDialog: React.FC<PropsEdit> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const form = useForm<z.infer<typeof FormulaSchema>>({
    resolver: zodResolver(FormulaSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormulaSchema>) {
    setLoadingSave(true);
    updateFormula({ data: values })
      .then((updatedFormula) => {
        console.log("Fórmula actualizada:", updatedFormula);

        toast("La fórmula se actualizó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar la fórmula:", error);
        toast("Hubo un error al actualizar la fórmula.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchFormula = async () => {
    setLoadingInit(true);
    try {
      const formulaData = await getFormulaById(id);
      console.log("Fórmulas:", formulaData);
      form.reset({
        id: formulaData.id,
        name: formulaData.name,
        description: formulaData.description,
      });
    } catch (error) {
      console.error("Error al cargar las fórmulas:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  function onDelete(id: number): void {
    setLoadingDelete(true);
    deleteFormula(id)
      .then((deletedFormula) => {
        console.log("Fórmula eliminada:", deletedFormula);

        toast("La fórmula se eliminó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la fórmula:", error);
        toast("Hubo un error al eliminar la fórmula.", {
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
      <DialogTrigger asChild onClick={fetchFormula}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestión de fórmula</DialogTitle>
          <DialogDescription>
            Mostrando datos relacionados con la fórmula.
          </DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" grid grid-cols-6 gap-4 "
            >
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className={"col-span-6"}>
                    <FormLabel>Id</FormLabel>
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
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-6">
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
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notas adicionales" {...field} />
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


interface PropsDelete {
  children: React.ReactNode; // Define el tipo de children
  id: number; // Clase personalizada opcional
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

// Componente para eliminar una fórmula
export const DeleteFormulaDialog: React.FC<PropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    deleteFormula(id)
      .then((deletedFormula) => {
        console.log("Fórmula eliminada:", deletedFormula);
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar la fórmula:", error);
      })
      .finally(() => {
        setLoadingDelete(false); // Finaliza la carga
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar fórmula</DialogTitle>
          <DialogDescription>
            ¿Está seguro de eliminar esta fórmula?
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
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}


// Componente para recuperar una fórmula
export const RecoverFormulaDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingRecover, setLoadingRecover] = useState(false); // Estado de carga

  function onRecover(): void {
    setLoadingRecover(true); // Inicia la carga
    recoverFormula(id)
      .then((recoveredFormula) => {
        console.log("Fórmula recuperada:", recoveredFormula);
        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar la fórmula:", error);
      })
      .finally(() => {
        setLoadingRecover(false); // Finaliza la carga
      });
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recuperar fórmula</DialogTitle>
          <DialogDescription>
            ¿Está seguro de recuperar esta fórmula?
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
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {IFormula, FormulaSchema, IProduct, IFormulaDetail} from "@/utils/interfaces";
import {zodResolver} from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {useContext, useEffect, useMemo, useState} from "react";
import {
  createFormula,
  hardDeleteFormula,
  getFormulaById,
  recoverFormula,
  softDeleteFormula,
  updateFormula,
} from "@/api/production-and-recycling/product/formula.api";
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
import {Switch} from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {getProducts} from "@/api/production-and-recycling/product/product.api";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
import {ChevronsDown, Trash2} from "lucide-react";
import DataTable from "@/components/table/DataTable";
import {toast} from "sonner";
import {ColumnDef, Row} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  idProduct: number;
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateFormulaDialog: React.FC<PropsCreate> = ({children, updateView, idProduct}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [products, setProducts] = useState<IProduct[]>();
  const {sectorProcess} = useContext(SectorProcessContext);
  // const [productsSelected, setProductsSelected] = useState<IProduction[]>([]);

  const [productSelected, setProductSelected] = useState<IProduct>();

  const [formulaDetailsSelected, setFormulaDetailsSelected] = useState<IFormulaDetail[]>([]);

  const [amount, setAmount] = useState<number>();

  const form = useForm<IFormula>({
    resolver: zodResolver(FormulaSchema),
  });
  useEffect(() => {
    form.reset({
      active: false,
      id_product: idProduct,
    });
  }, [idProduct]);

  const addProductSelected = () => {
    console.log(form.getValues());

    if (productSelected && productSelected.id && amount && amount > 0)
      setFormulaDetailsSelected([
        {
          amount: amount,
          id_product: productSelected.id,
          product: productSelected,
          id_formula: 0,
        },
        ...formulaDetailsSelected,
      ]);
    else toast.warning("Selcciona el producto y cantidad");
  };

  function onSubmit(values: IFormula) {
    setLoadingSave(true);
    const newFormula: IFormula = {formula_costs: formulaDetailsSelected, ...values};
    createFormula({data: newFormula})
      .then((updatedFormula) => {
        console.log("Fórmula creada:", updatedFormula);
        updateView();
      })
      .catch((error) => {
        console.error("Error al crear la fórmula:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      const ProductsData = await getProducts({id_sector_process: sectorProcess?.id});
      setProducts(ProductsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  // Generar columnas dinámicamente
  const columnsProductsSelected: ColumnDef<IFormulaDetail>[] = useMemo(() => {
    if (formulaDetailsSelected?.length === 0) return [];
    const columns: (ColumnDef<IFormulaDetail> | null)[] = [
      {
        accessorFn: (row) => `${row.product?.name} kg`.trim(),
        header: "Material",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },
      {
        accessorFn: (row) => `${row.amount}/${row.product?.equivalent_amount}`.trim(),
        header: "Cantidad",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },

      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({row}: {row: Row<IFormulaDetail>}) => {
          return (
            <div className="flex gap-2  justify-end  ">
              <Button
                variant={"outline"}
                size={"sm"}
                type="button"
                onClick={() => {
                  const newValues = formulaDetailsSelected?.filter((_, i) => i !== row.index);
                  setFormulaDetailsSelected(newValues);
                }}
                className="my-0.5 h-6 bg-red-500/20 hover:bg-red-500/70 hover:text-white dark:bg-red-500/20 dark:hover:bg-red-500/70 dark:hover:text-black"
              >
                <Trash2 />
              </Button>
            </div>
          );
        },
      },
    ];
    return columns.filter((col): col is ColumnDef<IFormulaDetail> => col !== null);
  }, [formulaDetailsSelected]);

  return (
    <Dialog>
      <DialogTrigger asChild onClick={fetchData}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registro de fórmula</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la fórmula.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className="grid gap-2"
            >
              <div className="grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem className="col-span-6">
                      <FormDescription>Nombre de fórmula</FormDescription>
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="col-span-6" />

                <FormItem className="col-span-4 ">
                  <FormDescription> Material</FormDescription>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        setProductSelected(products?.find((pr) => pr.id === Number(value)))
                      } // Convertir el valor a número
                      defaultValue={productSelected?.id?.toString()}
                    >
                      <SelectTrigger className="w-full" size="sm">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map((product: IProduct) => (
                          <SelectItem key={product.id} value={(product.id ?? "").toString()}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormItem className="col-span-2">
                  <FormDescription>Cantidad</FormDescription>
                  <FormControl>
                    <Input
                      className="h-8"
                      placeholder="Cantidad"
                      type="number"
                      onChange={(event) => {
                        const value = event.target.value;
                        setAmount(value === "" ? undefined : Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <div className="w-full col-span-6 grid gap-2">
                  <Button
                    type="button"
                    variant={"default"}
                    size={"sm"}
                    //className="  bg-green-600/20 hover:bg-green-600/70  hover:text-white dark:bg-green-600/20 dark:hover:bg-green-600/70  dark:hover:text-black"
                    onClick={addProductSelected}
                  >
                    <ChevronsDown />
                    Añadir Producto
                    <ChevronsDown />
                  </Button>
                </div>
                <div className="w-full col-span-6 grid gap-2">
                  <DataTable
                    hasOptions={false}
                    hasPaginated={false}
                    actions={<></>}
                    columns={columnsProductsSelected}
                    data={formulaDetailsSelected}
                  />
                </div>
              </div>
              <DialogFooter className=" grid grid-cols-6 ">
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

export const EditFormulaDialog: React.FC<PropsEdit> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [products, setProducts] = useState<IProduct[]>();

  const {sectorProcess} = useContext(SectorProcessContext);

  const form = useForm<IFormula>({
    resolver: zodResolver(FormulaSchema),
    defaultValues: {
      id: 0,
      name: "",
      active: true,
      id_product: 0,
    },
  });

  function onSubmit(values: IFormula) {
    setLoadingSave(true);
    updateFormula({data: values})
      .then((updatedFormula) => {
        console.log("Fórmula actualizada:", updatedFormula);

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar la fórmula:", error);
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
      const ProductsData = await getProducts({id_sector_process: sectorProcess?.id});
      setProducts(ProductsData);
      form.reset({
        id: formulaData.id,
        name: formulaData.name,
        active: formulaData.active,
        id_product: formulaData.id_product,
      });
    } catch (error) {
      console.error("Error al cargar las fórmulas:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={fetchFormula}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edición de fórmula</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con la fórmula.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))} className=" grid  ">
              <div className="grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm">
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
                    <FormItem className="col-span-4 ">
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
                  name="active"
                  render={({field}) => (
                    <FormItem className="col-span-2  ">
                      <FormDescription>Activa</FormDescription>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="w-full h-8"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="id_product"
                  render={({field}) => (
                    <FormItem className="col-span-4 ">
                      <FormDescription>Producto</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full" size="sm">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {products?.map((product: IProduct) => (
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

              <DialogFooter className="grid grid-cols-6 ">
                <Button
                  type="submit"
                  className="col-span-3"
                  disabled={!form.formState.isDirty || loadingSave}
                >
                  {loadingSave ? <LoadingCircle /> : "Guardar"}
                </Button>

                <DialogClose className="col-span-3" asChild>
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
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

// Componente para eliminar una fórmula
export const SoftDeleteFormulaDialog: React.FC<SoftPropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    softDeleteFormula(id)
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar Fórmula</DialogTitle>
          <DialogDescription>¿Está seguro de desactivar esta Fórmula?</DialogDescription>
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
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

// Componente para eliminar una fórmula
export const HardDeleteFormulaDialog: React.FC<PropsHardDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    hardDeleteFormula(id)
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar fórmula</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar esta fórmula?</DialogDescription>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reactivar fórmula</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar esta fórmula?</DialogDescription>
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

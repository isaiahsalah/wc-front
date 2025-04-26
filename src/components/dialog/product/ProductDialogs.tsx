import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ColorInterfaces,
  ModelInterfaces,
  ProductInterfaces,
  ProductSchema,
  UnityInterfaces,
} from "@/utils/interfaces";
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
  createProduct,
  deleteProduct,
  getProductById,
  recoverProduct,
  updateProduct,
} from "@/api/product/product.api";
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
import { getColors } from "@/api/product/color.api";
import { getModels } from "@/api/product/model.api";
import { getUnities } from "@/api/product/unity.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateProductDialog: React.FC<PropsCreate> = ({
  children,
  updateView,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [colors, setColors] = useState<ColorInterfaces[]>();
  const [models, setModels] = useState<ModelInterfaces[]>();
  const [unities, setUnities] = useState<UnityInterfaces[]>();

  const form = useForm<ProductInterfaces>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      id_color: 0,
      id_model: 0,
      id_unity: 0,
      price: 0,
      cost: 0,
    },
  });

  function onSubmit(values: ProductInterfaces) {
    setLoadingSave(true);
    createProduct({ data: values })
      .then((updatedProduct) => {
        console.log("Producto creado:", updatedProduct);

        toast("El producto se creó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al crear el producto:", error);
        toast("Hubo un error al crear el producto.", {
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

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      const ColorsData = await getColors();
      const ModelsData = await getModels();
      const UnitiesData = await getUnities();

      setColors(ColorsData);
      setModels(ModelsData);
      setUnities(UnitiesData);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registro de producto</DialogTitle>
          <DialogDescription>
            Mostrando datos relacionados con el producto.
          </DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" grid  gap-4 "
            >
              <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
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
                  render={({ field }) => (
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
                  name="id_color"
                  render={({ field }) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Color</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          } // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {colors?.map((product: ColorInterfaces) => (
                              <SelectItem
                                key={product.id}
                                value={(product.id ?? "").toString()}
                              >
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
                  name="id_model"
                  render={({ field }) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Modelo</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          } // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {models?.map((product: ModelInterfaces) => (
                              <SelectItem
                                key={product.id}
                                value={(product.id ?? "").toString()}
                              >
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
                  name="id_unity"
                  render={({ field }) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Unidad</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          } // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {unities?.map((product: UnityInterfaces) => (
                              <SelectItem
                                key={product.id}
                                value={(product.id ?? "").toString()}
                              >
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Cantidad</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Cantidad"
                          type="number"
                          {...field}   onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Costo</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Costo" type="number"
                          {...field}   onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Precio</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Precio" type="number"
                          {...field}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          } // Convertir el valor a número
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

export const EditProductDialog: React.FC<PropsEdit> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);

  const form = useForm<ProductInterfaces>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
    },
  });

  function onSubmit(values: ProductInterfaces) {
    setLoadingSave(true);
    updateProduct({ data: values })
      .then((updatedProduct) => {
        console.log("Producto actualizado:", updatedProduct);

        toast("El producto se actualizó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
        toast("Hubo un error al actualizar el producto.", {
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

  const fetchProduct = async () => {
    setLoadingInit(true);
    try {
      const productData = await getProductById(id);
      console.log("Productos:", productData);
      form.reset({
        id: productData.id,
        name: productData.name,
        description: productData.description,
      });
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  function onDelete(id: number): void {
    setLoadingDelete(true);
    deleteProduct(id)
      .then((deletedProduct) => {
        console.log("Producto eliminado:", deletedProduct);

        toast("El producto se eliminó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
        toast("Hubo un error al eliminar el producto.", {
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
      <DialogTrigger asChild onClick={fetchProduct}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestión de producto</DialogTitle>
          <DialogDescription>
            Mostrando datos relacionados con el producto.
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
  updateView: () => void; // Define el tipo como una función que retorna void
  onOpenChange?: (open: boolean) => void;
}

// Componente para eliminar un producto
export const DeleteProductDialog: React.FC<PropsDelete> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga

  function onDelete(): void {
    setLoadingDelete(true); // Inicia la carga
    deleteProduct(id)
      .then((deletedProduct) => {
        console.log("Producto eliminado:", deletedProduct);
        toast("El producto se eliminó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
        toast("Hubo un error al eliminar el producto.", {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar producto</DialogTitle>
          <DialogDescription>
            ¿Está seguro de eliminar este producto?
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

// Componente para recuperar un producto
export const RecoverProductDialog: React.FC<PropsRecover> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingRecover, setLoadingRecover] = useState(false); // Estado de carga

  function onRecover(): void {
    setLoadingRecover(true); // Inicia la carga
    recoverProduct(id)
      .then((recoveredProduct) => {
        console.log("Producto recuperado:", recoveredProduct);
        toast("El producto se recuperó correctamente.", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar el producto:", error);
        toast("Hubo un error al recuperar el producto.", {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recuperar producto</DialogTitle>
          <DialogDescription>
            ¿Está seguro de recuperar este producto?
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

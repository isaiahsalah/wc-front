import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {IColor, IModel, IProduct, ProductSchema, IUnity, ISector} from "@/utils/interfaces";
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
  createProduct,
  deleteProduct,
  getProductById,
  recoverProduct,
  updateProduct,
} from "@/api/product/product.api";
import {toast} from "sonner";
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
import {getColors} from "@/api/product/color.api";
import {getModels} from "@/api/params/model.api";
import {getUnities} from "@/api/product/unity.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {typeProduct} from "@/utils/const";
import {SesionContext} from "@/providers/sesionProvider";

interface PropsCreate {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const CreateProductDialog: React.FC<PropsCreate> = ({children, updateView}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [colors, setColors] = useState<IColor[]>();
  const [models, setModels] = useState<IModel[]>();
  const [unities, setUnities] = useState<IUnity[]>();
  const [open, setOpen] = useState(false);
  const [sector, setSector] = useState<ISector>();
  const {sesion} = useContext(SesionContext);

  const form = useForm<IProduct>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      id_color: 0,
      id_model: 0,
      id_unit: 0,
      id_equivalent_unit: 0,
    },
  });

  function onSubmit(values: IProduct) {
    if (form.getValues().id_equivalent_unit === form.getValues().id_unit)
      return toast.error("La unidad y el equivalente no pueden ser iguales");

    setLoadingSave(true);
    createProduct({data: values})
      .then((updatedProduct) => {
        console.log("Producto creado:", updatedProduct);
        updateView();
      })
      .catch((error) => {
        console.error("Error al crear el producto:", error);
      })
      .finally(() => {
        setOpen(false);
        setLoadingSave(false);
      });
  }

  // Función personalizada para manejar el cambio de estado
  const handleOpenChange = (isOpen: boolean) => {
    form.reset();
    setOpen(isOpen);
  };

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      const ColorsData = await getColors({});
      const ModelsData = await getModels({id_sector: sector?.id});
      const UnitiesData = await getUnities({});

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={fetchData}>
        {children}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Registro de producto</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el producto.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
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
                  name="id_color"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Color</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {colors?.map((product: IColor) => (
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
                  name="id_model"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Modelo</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Modelo" />
                          </SelectTrigger>
                          <SelectContent>
                            {models?.map((product: IModel) => (
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
                  name="type_product"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Tipo</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeProduct?.map((type_prod) => (
                              <SelectItem
                                key={type_prod.id}
                                value={(type_prod.id ?? "").toString()}
                              >
                                {type_prod.name}
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
                  name="id_unit"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Unidad</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Unidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {unities?.map((product: IUnity) => (
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
                  name="id_equivalent_unit"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Equivalente</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Equivalente" />
                          </SelectTrigger>
                          <SelectContent>
                            {unities?.map((product: IUnity) => (
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
                  name="equivalent_amount"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Cantidad Equivalente</FormDescription>
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
                  name="weight"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Peso</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Peso"
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
                  name="micronage"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Micronaje</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Micronaje"
                          type="number"
                          {...field}
                          onChange={(event) => field.onChange(Number(event.target.value))}
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

export const EditProductDialog: React.FC<PropsEdit> = ({
  children,
  id,
  updateView,
  onOpenChange,
}) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [colors, setColors] = useState<IColor[]>();
  const [models, setModels] = useState<IModel[]>();
  const [unities, setUnities] = useState<IUnity[]>();

  const [sector, setSector] = useState<ISector>();
  const {sesion} = useContext(SesionContext);

  const form = useForm<IProduct>({
    resolver: zodResolver(ProductSchema),
  });

  function onSubmit(values: IProduct) {
    setLoadingSave(true);
    updateProduct({data: values})
      .then((updatedProduct) => {
        console.log("Producto actualizado:", updatedProduct);

        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }

  const fetchProduct = async () => {
    setLoadingInit(true);
    try {
      const productData: IProduct = await getProductById(id);
      console.log("Productos:", productData);
      const ColorsData = await getColors({});
      const ModelsData = await getModels({id_sector: sector?.id});
      const UnitiesData = await getUnities({});

      setColors(ColorsData);
      setModels(ModelsData);
      setUnities(UnitiesData);
      form.reset({
        id: productData.id,
        name: productData.name,
        description: productData.description,
        equivalent_amount: parseFloat(productData.equivalent_amount.toString()),
        weight: parseFloat(productData.weight.toString()),
        micronage: parseFloat((productData.micronage ?? 0).toString()),
        id_color: productData.id_color,
        id_model: productData.id_model,
        id_unit: productData.id_unit,
        id_equivalent_unit: productData.id_equivalent_unit,
        type_product: productData.type_product,
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

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el producto.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className=" grid  gap-4 "
            >
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
                  name="id_color"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Color</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {colors?.map((product: IColor) => (
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
                  name="id_model"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Modelo</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {models?.map((product: IModel) => (
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
                  name="id_unit"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Unidad</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {unities?.map((product: IUnity) => (
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
                  name="type_product"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Tipo</FormDescription>
                      <FormControl>
                        <Select
                          defaultValue={field.value.toString()}
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeProduct?.map((type_prod) => (
                              <SelectItem
                                key={type_prod.id}
                                value={(type_prod.id ?? "").toString()}
                              >
                                {type_prod.name}
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
                  name="id_equivalent_unit"
                  render={({field}) => (
                    <FormItem className="col-span-3 ">
                      <FormDescription>Equivalente</FormDescription>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convertir el valor a número
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar Equivalente" />
                          </SelectTrigger>
                          <SelectContent>
                            {unities?.map((product: IUnity) => (
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
                  name="equivalent_amount"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Cantidad Equivalente</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Cantidad"
                          type="number"
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
                  name="weight"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Peso</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="peso"
                          type="number"
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
                  name="micronage"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormDescription>Micronaje</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Micronaje"
                          type="number"
                          onChange={(event) => field.onChange(Number(event.target.value))}
                          defaultValue={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className=" grid grid-cols-6">
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

        updateView();
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
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
          <DialogTitle>Eliminar producto</DialogTitle>
          <DialogDescription>¿Está seguro de eliminar este producto?</DialogDescription>
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

        updateView();
      })
      .catch((error) => {
        console.error("Error al recuperar el producto:", error);
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
          <DialogTitle>Recuperar producto</DialogTitle>
          <DialogDescription>¿Está seguro de recuperar este producto?</DialogDescription>
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

import {IFormula, IProduct} from "@/utils/interfaces";
import {
  CreateFormulaDialog,
  DeleteFormulaDialog,
  EditFormulaDialog,
  RecoverFormulaDialog,
} from "@/components/dialog/product/FormulaDialogs";
import {Button} from "@/components/ui/button";
import {
  ArchiveRestore,
  Check,
  Delete,
  Edit,
  MoreVerticalIcon,
  PlusIcon,
  Tally5,
  TrendingUpIcon,
  X,
} from "lucide-react";
import DataTable from "@/components/table/DataTable";
import {useContext, useEffect, useMemo, useState} from "react";
import {ColumnDef, Row} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {getFormulas} from "@/api/product/formula.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {countCurrentMonth} from "@/utils/funtions";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {SectorContext} from "@/providers/sector-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {getProducts} from "@/api/product/product.api";

const FormulaPage = () => {
  const [formulas, setFormulas] = useState<IFormula[] | null>(null);
  const {sector} = useContext(SectorContext);
  const [products, setProducts] = useState<IProduct[]>();
  const [idProduct, setIdProduct] = useState<number>();

  useEffect(() => {
    updateView();
    fetchFilter();
  }, [sector]);

  const fetchFilter = async () => {
    try {
      const ProductData = await getProducts({id_sector: sector?.id, paranoid: true});

      setProducts(ProductData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const updateView = async () => {
    try {
      const FormulasData = await getFormulas({id_sector: sector?.id, id_product: idProduct});
      setFormulas(FormulasData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Generar columnas dinámicamente
  const columnsFormula: ColumnDef<IFormula>[] = useMemo(() => {
    if (!formulas) return [];
    return [
      {
        accessorKey: "id",
        header: "Id",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "name",
        header: "Nombre",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Descripción",
        cell: (info) => info.getValue(),
      },

      {
        accessorKey: "product",
        header: "Producto",
        cell: (info) => (
          <Badge variant={"outline"} className="text-muted-foreground">
            {(info.getValue() as IProduct).name}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Creado",
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
            return format(new Date(value), "dd/MM/yyyy hh:mm");
          }
          return "No disponible";
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Editado",
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
            return format(new Date(value), "dd/MM/yyyy hh:mm");
          }
          return "No disponible";
        },
      },

      {
        accessorKey: "deletedAt",
        header: "Eliminado",
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
            return format(new Date(value), "dd/MM/yyyy hh:mm");
          }
          return "-";
        },
      },
      {
        accessorKey: "active",
        header: "Activa",
        cell: (info) =>
          info.getValue() ? (
            <Badge className=" text-green-600 dark:text-green-400 " variant={"outline"}>
              <Check />
            </Badge>
          ) : (
            <Badge className=" text-red-600 dark:text-red-400" variant={"outline"}>
              <X />
            </Badge>
          ),
      },
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({row}: {row: Row<IFormula>}) => {
          return (
            <div className="flex gap-2  justify-end  ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                    size="icon"
                  >
                    {" "}
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  {!row.original.deletedAt ? (
                    <>
                      <EditFormulaDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditFormulaDialog>
                      <DropdownMenuSeparator />
                      <DeleteFormulaDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Delete /> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteFormulaDialog>
                    </>
                  ) : (
                    <RecoverFormulaDialog id={row.original.id ?? 0} updateView={updateView}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <ArchiveRestore /> Recuperar{" "}
                      </DropdownMenuItem>
                    </RecoverFormulaDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [formulas]);
  return (
    <div className="flex flex-col gap-2">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardContent className=" flex flex-col gap-2">
          <CardDescription>Selecciona el producto</CardDescription>
          <div className="grid grid-cols-6 gap-2">
            <Select
              onValueChange={(value) => setIdProduct(Number(value))} // Convertir el valor a número
            >
              <SelectTrigger className="w-full col-span-6">
                <SelectValue placeholder="Producto" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((sector) => (
                  <SelectItem key={sector.id} value={(sector.id ?? "").toString()}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader className="relative">
          <CardDescription>Formulas registradas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formulas ? formulas.length : 0} Formulas
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />+{countCurrentMonth(formulas ? formulas : [])}{" "}
              este mes
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total acumulado en el sistema
            <Tally5 className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Mantén actualizada esta cantidad para un registro preciso.
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Formulas</CardTitle>
          <CardDescription>Formulas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            actions={
              <CreateFormulaDialog
                updateView={updateView}
                children={
                  <Button
                    variant="outline"
                    size="sm"
                    onSelect={(event) => {
                      event.preventDefault(); // Evita el cierre automático
                    }}
                  >
                    <PlusIcon />
                    <span className="ml-2 hidden lg:inline">Agregar</span>
                  </Button>
                }
              />
            }
            columns={columnsFormula}
            data={formulas}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FormulaPage;
//      <FormulaTable data={data} updateView={updateView} />

import {IFormula, IProduct} from "@/utils/interfaces";
import {
  CreateFormulaDialog,
  DeleteFormulaDialog,
  EditFormulaDialog,
  RecoverFormulaDialog,
} from "@/components/dialog/product/FormulaDialogs";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, Check, Edit, List, PlusIcon, Trash2, X} from "lucide-react";
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
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {getProducts} from "@/api/product/product.api";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
interface Props {
  degree: number;
}
const FormulaPage: React.FC<Props> = ({degree}) => {
  const [formulas, setFormulas] = useState<IFormula[] | null>(null);
  const {sectorProcess} = useContext(SectorProcessContext);

  const [products, setProducts] = useState<IProduct[]>();

  const [idProduct, setIdProduct] = useState<number>();

  useEffect(() => {
    updateView();
    fetchFilter();
  }, []);

  const fetchFilter = async () => {
    try {
      const ProductData = await getProducts({id_sector_process: sectorProcess?.id});

      setProducts(ProductData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const updateView = async () => {
    try {
      const FormulasData = await getFormulas({
        id_sector: sectorProcess?.sector?.id,
        id_product: idProduct,
        all: true,
      });
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
        accessorFn: (row) => row.id?.toString().trim(),
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
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <Badge variant={"outline"} className="text-muted-foreground">
              {"Sin descripción"}
            </Badge>
          ),
      },

      {
        accessorFn: (row) => row.product?.name.trim(),
        accessorKey: "product",
        header: "Producto",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
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
        accessorFn: (row) => format(new Date(row.createdAt as Date), "dd/MM/yyyy HH:mm").trim(),
        accessorKey: "createdAt",
        header: "Creado",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => format(new Date(row.updatedAt as Date), "dd/MM/yyyy HH:mm").trim(),
        accessorKey: "updatedAt",
        header: "Editado",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },

      {
        accessorKey: "deletedAt",
        header: "Eliminado",
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
            return format(new Date(value), "dd/MM/yyyy HH:mm");
          }
          return "-";
        },
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
                    variant="link"
                    className="flex size-8 text-muted-foreground data-[state=open]:text-accent-foreground cursor-pointer hover:text-accent-foreground   "
                    size="icon"
                  >
                    {" "}
                    <List />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  {!row.original.deletedAt ? (
                    <>
                      <EditFormulaDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 3 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditFormulaDialog>
                      <DropdownMenuSeparator />
                      <DeleteFormulaDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteFormulaDialog>
                    </>
                  ) : (
                    <RecoverFormulaDialog id={row.original.id ?? 0} updateView={updateView}>
                      <DropdownMenuItem
                        disabled={degree < 4 ? true : false}
                        onSelect={(e) => e.preventDefault()}
                      >
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
                    disabled={degree < 2 ? true : false}
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

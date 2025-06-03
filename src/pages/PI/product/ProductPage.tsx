import {IProduct} from "@/utils/interfaces";
import DataTable from "@/components/table/DataTable";
import {
  CreateProductDialog,
  EditProductDialog,
  HardDeleteProductDialog,
  RecoverProductDialog,
  SoftDeleteProductDialog,
} from "@/components/dialog/product/ProductDialogs";
import {ArchiveRestore, Edit, List, PlusIcon, Trash2} from "lucide-react";
import {ColumnDef, Row} from "@tanstack/react-table";
import {useContext, useEffect, useMemo, useState} from "react";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {getProducts} from "@/api/product/product.api";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {typeProduct} from "@/utils/const";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
import {SesionContext} from "@/providers/sesionProvider";

interface Props {
  degree: number;
}

const ProductPage: React.FC<Props> = ({degree}) => {
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const {sectorProcess} = useContext(SectorProcessContext);
  const {sesion} = useContext(SesionContext);

  useEffect(() => {
    updateView();
  }, [sesion, sectorProcess]);

  const updateView = async () => {
    if (sesion && sectorProcess) {
      try {
        const ProductionsData = await getProducts({
          id_sector_process: sectorProcess?.id,
          all: true,
        });
        setProducts(ProductionsData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    }
  };

  // Generar columnas dinámicamente
  const columnsProducts: ColumnDef<IProduct>[] = useMemo(() => {
    if (!products) return [];
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
        accessorFn: (row) => typeProduct.find((obj) => obj.id === row.type_product)?.name.trim(),
        accessorKey: "type_product",
        header: "Tipo de Producto",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => `${row.product_unit?.name}`.trim(),
        accessorKey: "unit",
        header: "Unidad",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },

      {
        accessorFn: (row) =>
          `${row.equivalent_amount} ${row.product_equivalent_unit?.shortname}`.trim(),
        accessorKey: "equivalent_unit",
        header: "Equivalente",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },
      {
        accessorFn: (row) => `${row.weight} kg`.trim(),
        accessorKey: "weight",
        header: "Peso",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },
      {
        accessorFn: (row) => `${row.micronage}`.trim(),
        accessorKey: "micronage",
        header: "Micronaje",
        cell: (info) =>
          info.getValue() != "null" ? (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          ) : (
            <Badge variant={"outline"} className="text-muted-foreground">
              N/A
            </Badge>
          ),
      },
      {
        accessorFn: (row) => `${row.color?.name}`.trim(),
        accessorKey: "color",
        header: "Color",
        cell: (info) =>
          info.getValue() != "null" && info.getValue() != "undefined" ? (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          ) : (
            <Badge variant={"outline"} className="text-muted-foreground">
              N/A
            </Badge>
          ),
      },

      {
        accessorFn: (row) => row.product_model?.name.trim(),
        accessorKey: "product_model",
        header: "Modelo",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
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
        cell: ({row}: {row: Row<IProduct>}) => {
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
                      <EditProductDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 3 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditProductDialog>
                      <DropdownMenuSeparator />
                      <SoftDeleteProductDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Desactivar{" "}
                        </DropdownMenuItem>
                      </SoftDeleteProductDialog>
                    </>
                  ) : (
                    <>
                      <RecoverProductDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <ArchiveRestore /> Reactivar{" "}
                        </DropdownMenuItem>
                      </RecoverProductDialog>
                      <HardDeleteProductDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Eliminar{" "}
                        </DropdownMenuItem>
                      </HardDeleteProductDialog>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [products]);
  return (
    <div className="flex flex-col gap-2">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Producción</CardTitle>
          <CardDescription>Producción registrada</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            actions={
              <CreateProductDialog
                updateView={updateView}
                children={
                  <Button
                    disabled={degree < 2 ? true : false}
                    size="sm"
                    onSelect={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <PlusIcon />
                  </Button>
                }
              />
            }
            columns={columnsProducts}
            data={products}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPage;

//<ProductTable data={data} updateView={updateView} />

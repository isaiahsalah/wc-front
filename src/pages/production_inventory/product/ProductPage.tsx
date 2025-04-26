 import { z } from "zod";
import { GeneralSchema, ProductInterfaces, ProductSchema } from "@/utils/interfaces";
import ProductCards from "@/components/cards/product/ProductCards";
import ProductTable from "@/components/tables/product/ProductTable";
import DataTable from "@/components/table/DataTable";
import { CreateProductDialog, DeleteProductDialog, EditProductDialog, RecoverProductDialog } from "@/components/dialog/product/ProductDialogs";
 import { ArchiveRestoreIcon, Delete, Edit, MoreVerticalIcon, PlusIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { useContext, useEffect, useMemo } from "react";
import { TitleContext } from "@/providers/title-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface Props {
  data: ProductInterfaces[];
  updateView: () => void;
}

const ProductPage: React.FC<Props> =  (({ data, updateView }) => {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Productos");
  }, []);

  // Generar columnas dinámicamente
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return [
      
      ...Object.keys(data[0]).map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        cell: (info: any) => info.getValue(),
      })),
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }: { row: Row<ProductInterfaces> }) => {
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
                      <EditProductDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          Editar{" "}
                        </DropdownMenuItem>
                      </EditProductDialog>
                      <DropdownMenuSeparator />
                      <DeleteProductDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteProductDialog>
                    </>
                  ) : (
                    <RecoverProductDialog
                      id={row.original.id ?? 0}
                      updateView={updateView}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Recuperar{" "}
                      </DropdownMenuItem>
                    </RecoverProductDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [data]);
  return (
    <div className="flex flex-col gap-4">
      <ProductCards initialData={data} />
      <DataTable
        actions={
          <CreateProductDialog
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
        columns={columns}
        data={data}
      />
      

    </div>
  );
});

export default ProductPage;

//<ProductTable data={data} updateView={updateView} />
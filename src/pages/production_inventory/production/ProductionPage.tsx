import { z } from "zod";
import {  ProductionInterfaces } from "@/utils/interfaces";
import ProductionTable from "@/components/tables/production/ProductionTable";
import ProductionCards from "@/components/cards/production/ProductionCards";
import { CellContext, Row } from "@tanstack/react-table";
import { useContext, useEffect, useMemo } from "react";
import { TitleContext } from "@/providers/title-provider";
import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { ArchiveRestore , Delete, Edit, MoreVerticalIcon, PlusIcon } from "lucide-react";
import { CreateProductionDialog, DeleteProductionDialog, EditProductionDialog, RecoverProductionDialog } from "@/components/dialog/production/ProductionDialogs";
import {
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  data: ProductionInterfaces[];
  updateView: () => void;
}

const ProductionPage: React.FC<Props> =  (({ data, updateView }) => {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Unidades");
  }, []);

  // Generar columnas dinámicamente
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return [
       
      ...Object.keys(data[0]).map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        cell: (info: CellContext<ProductionInterfaces, unknown>) => info.getValue(),
      })),
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }: { row: Row<ProductionInterfaces> }) => {
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
                      <EditProductionDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                         <Edit/> Editar{" "}
                        </DropdownMenuItem>
                      </EditProductionDialog>
                      <DropdownMenuSeparator />
                      <DeleteProductionDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                         <Delete/> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteProductionDialog>
                    </>
                  ) : (
                    <RecoverProductionDialog
                      id={row.original.id ?? 0}
                      updateView={updateView}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                       <ArchiveRestore/> Recuperar{" "}
                      </DropdownMenuItem>
                    </RecoverProductionDialog>
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
      <ProductionCards initialData={data} />
      <DataTable
        actions={
          <CreateProductionDialog
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

export default ProductionPage;
// <ProductionTable data={data} updateView={updateView} />
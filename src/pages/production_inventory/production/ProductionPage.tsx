import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import ProductionTable from "@/components/tables/production/ProductionTable";
import ProductionCards from "@/components/cards/production/ProductionCards";
import { Row } from "@tanstack/react-table";
import { useContext, useEffect, useMemo } from "react";
import { TitleContext } from "@/providers/title-provider";
import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { ArchiveRestoreIcon, Delete, Edit, PlusIcon } from "lucide-react";
import { CreateProductionDialog, DeleteProductionDialog, EditProductionDialog, RecoverProductionDialog } from "@/components/dialog/production/ProductionDialogs";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
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
      {
        accessorKey: "actions",
        header: "",
        cell: ({ row }: { row: Row<any> }) => {
          if (row.original.deletedAt) {
            return (
              <div className="flex    ">
                <RecoverProductionDialog
                  id={row.original.id}
                  updateView={updateView}
                  children={
                    <Button variant={"outline"} className="w-full">
                      <ArchiveRestoreIcon />
                    </Button>
                  }
                />
              </div>
            );
          }

          return (
            <div className="flex gap-2   ">
              <EditProductionDialog
                id={row.original.id}
                updateView={updateView}
                children={
                  <Button variant={"outline"}>
                    <Edit />
                  </Button>
                }
              />
              <DeleteProductionDialog
                id={row.original.id}
                updateView={updateView}
                children={
                  <Button variant={"outline"}>
                    <Delete />
                  </Button>
                }
              />
            </div>
          );
        },
      },
      ...Object.keys(data[0]).map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        cell: (info: any) => info.getValue(),
      })),
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
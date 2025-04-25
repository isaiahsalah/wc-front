 import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import ProductCards from "@/components/cards/product/ProductCards";
import ProductTable from "@/components/tables/product/ProductTable";
import DataTable from "@/components/table/DataTable";
import { CreateProductDialog, DeleteProductDialog, EditProductDialog, RecoverProductDialog } from "@/components/dialog/product/ProductDialogs";
 import { ArchiveRestoreIcon, Delete, Edit, PlusIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { useContext, useEffect, useMemo } from "react";
import { TitleContext } from "@/providers/title-provider";
import { Button } from "@/components/ui/button";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
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
      {
        accessorKey: "actions",
        header: "",
        cell: ({ row }: { row: Row<any> }) => {
          if (row.original.deletedAt) {
            return (
              <div className="flex    ">
                <RecoverProductDialog
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
              <EditProductDialog
                id={row.original.id}
                updateView={updateView}
                children={
                  <Button variant={"outline"}>
                    <Edit />
                  </Button>
                }
              />
              <DeleteProductDialog
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
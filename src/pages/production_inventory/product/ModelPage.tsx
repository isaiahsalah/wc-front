import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import ModelCards from "@/components/cards/product/ModelCards";
import ModelTable from "@/components/tables/product/ModelTable";
import { CreateModelDialog, DeleteModelDialog, EditModelDialog, RecoverModelDialog } from "@/components/dialog/product/ModelDialogs";
import { Button } from "@/components/ui/button";
import { ArchiveRestoreIcon, Delete, Edit, PlusIcon } from "lucide-react";
import DataTable from "@/components/table/DataTable";
import { useContext, useEffect, useMemo } from "react";
import { TitleContext } from "@/providers/title-provider";
import { Row } from "@tanstack/react-table";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView: () => void;
}

const ModelPage: React.FC<Props> = ({ data, updateView }) => {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Modelos");
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
                <RecoverModelDialog
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
              <EditModelDialog
                id={row.original.id}
                updateView={updateView}
                children={
                  <Button variant={"outline"}>
                    <Edit />
                  </Button>
                }
              />
              <DeleteModelDialog
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
      <ModelCards initialData={data} />
      <DataTable
        actions={
          <CreateModelDialog
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
};

export default ModelPage;
//      <ModelTable data={data} updateView={updateView} />

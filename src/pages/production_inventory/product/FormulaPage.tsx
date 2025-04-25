 import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
 import FormulaTable from "@/components/tables/product/FormulaTable";
import FormulaCards from "@/components/cards/product/FormulaCards";
import { CreateFormulaDialog, DeleteFormulaDialog, EditFormulaDialog, RecoverFormulaDialog } from "@/components/dialog/product/FormulaDialogs";
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

const FormulaPage: React.FC<Props> =  (({ data, updateView }) => {

  const { setTitle } = useContext(TitleContext);
  
    useEffect(() => {
      setTitle("Formulas");
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
                  <RecoverFormulaDialog
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
                <EditFormulaDialog
                  id={row.original.id}
                  updateView={updateView}
                  children={
                    <Button variant={"outline"}>
                      <Edit />
                    </Button>
                  }
                />
                <DeleteFormulaDialog
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
      <FormulaCards initialData={data} />
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
        columns={columns}
        data={data}
      />
    </div>
  );
});

export default FormulaPage;
//      <FormulaTable data={data} updateView={updateView} />

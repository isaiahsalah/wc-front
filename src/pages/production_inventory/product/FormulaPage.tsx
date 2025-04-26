import { z } from "zod";
import {
  FormulaInterfaces,
  FormulaSchema,
  GeneralSchema,
} from "@/utils/interfaces";
import FormulaTable from "@/components/tables/product/FormulaTable";
import FormulaCards from "@/components/cards/product/FormulaCards";
import {
  CreateFormulaDialog,
  DeleteFormulaDialog,
  EditFormulaDialog,
  RecoverFormulaDialog,
} from "@/components/dialog/product/FormulaDialogs";
import { Button } from "@/components/ui/button";
import {
  ArchiveRestore,
  ArchiveRestoreIcon,
  Delete,
  Edit,
  MoreVerticalIcon,
  PlusIcon,
} from "lucide-react";
import DataTable from "@/components/table/DataTable";
import { useContext, useEffect, useMemo } from "react";
import { TitleContext } from "@/providers/title-provider";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface Props {
  data: FormulaInterfaces[];
  updateView: () => void;
}

const FormulaPage: React.FC<Props> = ({ data, updateView }) => {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Formulas");
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
        cell: ({ row }: { row: Row<FormulaInterfaces> }) => {
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
                      <EditFormulaDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit/> Editar{" "}
                        </DropdownMenuItem>
                      </EditFormulaDialog>
                      <DropdownMenuSeparator />
                      <DeleteFormulaDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Delete/> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteFormulaDialog>
                    </>
                  ) : (
                    <RecoverFormulaDialog
                      id={row.original.id ?? 0}
                      updateView={updateView}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <ArchiveRestore/> Recuperar{" "}
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
};

export default FormulaPage;
//      <FormulaTable data={data} updateView={updateView} />

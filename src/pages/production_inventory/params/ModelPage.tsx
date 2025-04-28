import { ModelInterfaces } from "@/utils/interfaces";
import ModelCards from "@/components/cards/params/ModelCards";
import {
  CreateModelDialog,
  DeleteModelDialog,
  EditModelDialog,
  RecoverModelDialog,
} from "@/components/dialog/params/ModelDialogs";
import { Button } from "@/components/ui/button";
import {
  ArchiveRestore, 
  Delete,
  Edit,
  MoreVerticalIcon,
  PlusIcon,
} from "lucide-react";
import DataTable from "@/components/table/DataTable";
import { useContext, useEffect, useMemo } from "react";
import { TitleContext } from "@/providers/title-provider";
import { CellContext, Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface Props {
  data: ModelInterfaces[];
  updateView: () => void;
}

const ModelPage: React.FC<Props> = ({ data, updateView }) => {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Modelos");
  }, [setTitle]);

  // Generar columnas dinámicamente
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return [
      ...Object.keys(data[0]).map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        cell: (info: CellContext<ModelInterfaces, unknown>) => info.getValue(),
      })),
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }: { row: Row<ModelInterfaces> }) => {
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
                      <EditModelDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditModelDialog>
                      <DropdownMenuSeparator />
                      <DeleteModelDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Delete /> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteModelDialog>
                    </>
                  ) : (
                    <RecoverModelDialog
                      id={row.original.id ?? 0}
                      updateView={updateView}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <ArchiveRestore /> Recuperar{" "}
                      </DropdownMenuItem>
                    </RecoverModelDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [data, updateView]);
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
        /*@ts-expect-error: Ignoramos el error en esta línea */
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default ModelPage;
//      <ModelTable data={data} updateView={updateView} />

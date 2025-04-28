import { 
  UnityInterfaces, 
} from "@/utils/interfaces";
import UnityCards from "@/components/cards/product/UnityCards";
import {
  CreateUnityDialog,
  DeleteUnityDialog,
  EditUnityDialog,
  RecoverUnityDialog,
} from "@/components/dialog/product/UnityDialogs";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import { useContext, useEffect, useMemo } from "react";
import { TitleContext } from "@/providers/title-provider";
import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  ArchiveRestore, 
  Delete,
  Edit,
  MoreVerticalIcon,
  PlusIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface Props {
  data: UnityInterfaces[];
  updateView: () => void;
}

const UnityPage: React.FC<Props> = ({ data, updateView }) => {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Unidades");
  }, []);

  // Generar columnas dinámicamente
  const columns: ColumnDef<UnityInterfaces>[] = useMemo(() => {
    if (data.length === 0) return [];
    return [
      ...Object.keys(data[0] as UnityInterfaces).map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        cell: (info: CellContext<UnityInterfaces, unknown>) => info.getValue(),
      })),
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }: { row: Row<UnityInterfaces> }) => {
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
                      <EditUnityDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditUnityDialog>
                      <DropdownMenuSeparator />
                      <DeleteUnityDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Delete /> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteUnityDialog>
                    </>
                  ) : (
                    <RecoverUnityDialog
                      id={row.original.id ?? 0}
                      updateView={updateView}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <ArchiveRestore /> Recuperar{" "}
                      </DropdownMenuItem>
                    </RecoverUnityDialog>
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
      <UnityCards initialData={data} />
      <DataTable
        actions={
          <CreateUnityDialog
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

export default UnityPage;
//      <UnityTable data={data} updateView={updateView} />

/**
 * 
 * 
 * <div className="flex gap-2   ">
              <EditUnityDialog
                id={row.original.id ?? 0}
                updateView={updateView}
                children={
                  <Button variant={"outline"}>
                    <Edit />
                  </Button>
                }
              />
              <DeleteUnityDialog
                id={row.original.id ?? 0}
                updateView={updateView}
                children={
                  <Button variant={"outline"}>
                    <Delete />
                  </Button>
                }
              />
            </div>
 */

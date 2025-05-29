import {ISectorProcess} from "@/utils/interfaces";
import {useContext, useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, List, PlusIcon, Trash2} from "lucide-react";
import {
  CreateSectorProcessDialog,
  DeleteSectorProcessDialog,
  RecoverSectorProcessDialog,
} from "@/components/dialog/params/SectorProcessDialogs";
import {ColumnDef, Row} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {getSectorProcesses} from "@/api/params/sectorProcess.api";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
interface Props {
  degree: number;
}
const SectorProcessPage: React.FC<Props> = ({degree}) => {
  const [sectorProcesses, setSectorProcesses] = useState<ISectorProcess[] | null>(null);
  const {sectorProcess} = useContext(SectorProcessContext);

  useEffect(() => {
    updateView();
  }, []);

  const updateView = async () => {
    try {
      const sectorProcessesData = await getSectorProcesses({
        all: true,
        id_sector: sectorProcess?.sector?.id,
      });

      setSectorProcesses(sectorProcessesData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const columnsProcess: ColumnDef<ISectorProcess>[] = useMemo(() => {
    if (!sectorProcesses) return [];
    return [
      {
        accessorFn: (row) => row.process?.id?.toString().trim(),
        accessorKey: "id",
        header: "Id",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.process?.name?.toString().trim(),

        accessorKey: "name",
        header: "Nombre",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.process?.description?.toString().trim(),
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
        cell: ({row}: {row: Row<ISectorProcess>}) => {
          return (
            <div className="flex gap-2 justify-end">
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
                      <DeleteSectorProcessDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Eliminar
                        </DropdownMenuItem>
                      </DeleteSectorProcessDialog>
                    </>
                  ) : (
                    <RecoverSectorProcessDialog id={row.original.id ?? 0} updateView={updateView}>
                      <DropdownMenuItem
                        disabled={degree < 4 ? true : false}
                        onSelect={(e) => e.preventDefault()}
                      >
                        <ArchiveRestore /> Recuperar
                      </DropdownMenuItem>
                    </RecoverSectorProcessDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [sectorProcesses]);

  return (
    <div className="flex flex-col gap-2">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Procesos</CardTitle>
          <CardDescription>Procesos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            actions={
              <CreateSectorProcessDialog
                updateView={updateView}
                children={
                  <Button
                    disabled={degree < 2 ? true : false}
                    variant="outline"
                    size="sm"
                    onSelect={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <PlusIcon />
                    <span className="ml-2 hidden lg:inline">Agregar</span>
                  </Button>
                }
              />
            }
            columns={columnsProcess}
            data={sectorProcesses}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorProcessPage;

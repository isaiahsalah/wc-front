import {IProcess} from "@/utils/interfaces";
import {useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {
  ArchiveRestore,
  Edit,
  MoreVerticalIcon,
  PlusIcon,
  Tally5,
  Trash2,
  TrendingUpIcon,
} from "lucide-react";
import {
  CreateProcessDialog,
  DeleteProcessDialog,
  EditProcessDialog,
  RecoverProcessDialog,
} from "@/components/dialog/params/ProcessDialogs";
import {ColumnDef, Row} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {countCurrentMonth} from "@/utils/funtions";
import {format} from "date-fns";
import {getProcesses} from "@/api/params/process.api";
interface Props {
  degree: number;
}
const ProcessPage: React.FC<Props> = ({degree}) => {
  const [processes, setProcesses] = useState<IProcess[] | null>(null);

  useEffect(() => {
    updateView();
  }, []);

  const updateView = async () => {
    try {
      const processesData = await getProcesses({all: true});
      setProcesses(processesData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const columnsProcess: ColumnDef<IProcess>[] = useMemo(() => {
    if (!processes) return [];
    return [
      {
        accessorFn: (row) => row.id?.toString().trim(),
        accessorKey: "id",
        header: "Id",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "name",
        header: "Nombre",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Descripción",
        cell: (info) => info.getValue(),
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
        cell: ({row}: {row: Row<IProcess>}) => {
          return (
            <div className="flex gap-2 justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                    size="icon"
                  >
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  {!row.original.deletedAt ? (
                    <>
                      <EditProcessDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 3 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Edit /> Editar
                        </DropdownMenuItem>
                      </EditProcessDialog>
                      <DropdownMenuSeparator />
                      <DeleteProcessDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Eliminar
                        </DropdownMenuItem>
                      </DeleteProcessDialog>
                    </>
                  ) : (
                    <RecoverProcessDialog id={row.original.id ?? 0} updateView={updateView}>
                      <DropdownMenuItem
                        disabled={degree < 4 ? true : false}
                        onSelect={(e) => e.preventDefault()}
                      >
                        <ArchiveRestore /> Recuperar
                      </DropdownMenuItem>
                    </RecoverProcessDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [processes]);

  return (
    <div className="flex flex-col gap-2">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader className="relative">
          <CardDescription>Procesos registrados</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {processes ? processes.length : 0} Procesos
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />+{countCurrentMonth(processes ?? [])} este mes
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total acumulado en el sistema
            <Tally5 className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Mantén actualizada esta cantidad para un registro preciso.
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Procesos</CardTitle>
          <CardDescription>Procesos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            actions={
              <CreateProcessDialog
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
            data={processes}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessPage;

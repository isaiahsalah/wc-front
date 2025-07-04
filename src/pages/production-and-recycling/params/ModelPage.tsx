import {IProductModel} from "@/utils/interfaces";
import {useContext, useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, Edit, List, PlusIcon, Trash2} from "lucide-react";
import {
  CreateModelDialog,
  EditModelDialog,
  HardDeleteModelDialog,
  RecoverModelDialog,
  SoftDeleteModelDialog,
} from "@/components/dialog/production-and-recycling/params/ModelDialogs";
import {ColumnDef, Row} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {getModels} from "@/api/production-and-recycling/params/model.api";
import {SesionContext} from "@/providers/sesionProvider";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
interface Props {
  degree: number;
}
const ModelPage: React.FC<Props> = ({degree}) => {
  const [models, setModels] = useState<IProductModel[] | null>(null);
  const {sesion} = useContext(SesionContext);
  const {sectorProcess} = useContext(SectorProcessContext);

  useEffect(() => {
    updateView();
  }, [sesion, sectorProcess]);

  const updateView = async () => {
    if (sesion && sectorProcess) {
      try {
        const modelsData = await getModels({id_sector_process: sectorProcess?.id, all: true});
        setModels(modelsData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    }
  };

  const columnsModel: ColumnDef<IProductModel>[] = useMemo(() => {
    if (!models) return [];
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
        accessorFn: (row) => row.sector_process?.process?.name.trim(),
        accessorKey: "process",
        header: "Proceso",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => row.sector_process?.sector?.name.trim(),
        accessorKey: "sector",
        header: "Sector",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
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
        cell: ({row}: {row: Row<IProductModel>}) => {
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
                      <EditModelDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 3 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Edit /> Editar
                        </DropdownMenuItem>
                      </EditModelDialog>
                      <DropdownMenuSeparator />
                      <SoftDeleteModelDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Desactivar
                        </DropdownMenuItem>
                      </SoftDeleteModelDialog>
                    </>
                  ) : (
                    <>
                      <RecoverModelDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <ArchiveRestore /> Reactivar
                        </DropdownMenuItem>
                      </RecoverModelDialog>
                      <HardDeleteModelDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Eliminar
                        </DropdownMenuItem>
                      </HardDeleteModelDialog>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [models]);

  return (
    <div className="flex flex-col gap-2">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Modelos</CardTitle>
          <CardDescription>Modelos registrados </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            actions={
              <CreateModelDialog
                updateView={updateView}
                children={
                  <Button
                    disabled={degree < 2 ? true : false}
                    size="sm"
                    onSelect={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <PlusIcon />
                  </Button>
                }
              />
            }
            columns={columnsModel}
            data={models}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelPage;

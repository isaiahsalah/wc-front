import {IWorkGroup} from "@/utils/interfaces";
import {useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, Edit, List, PlusIcon, Trash2} from "lucide-react";

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
import {getGroups} from "@/api/production-and-recycling/security/group.api";
import {
  CreateGroupDialog,
  EditGroupDialog,
  HardDeleteGroupDialog,
  RecoverGroupDialog,
  SoftDeleteGroupDialog,
} from "@/components/dialog/production-and-recycling/security/GroupDialogs";

interface Props {
  degree: number;
}

const GroupPage: React.FC<Props> = ({degree}) => {
  const [groups, setGroups] = useState<IWorkGroup[] | null>(null);

  useEffect(() => {
    updateView();
  }, []);

  const updateView = async () => {
    try {
      const groupData = await getGroups({all: true});
      setGroups(groupData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Generar columnas dinámicamente
  const columnsGroup: ColumnDef<IWorkGroup>[] = useMemo(() => {
    if (!groups) return [];
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
        cell: ({row}: {row: Row<IWorkGroup>}) => {
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
                      <EditGroupDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 3 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditGroupDialog>
                      <DropdownMenuSeparator />
                      <SoftDeleteGroupDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Desactivar{" "}
                        </DropdownMenuItem>
                      </SoftDeleteGroupDialog>
                    </>
                  ) : (
                    <>
                      <RecoverGroupDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <ArchiveRestore /> Reactivar{" "}
                        </DropdownMenuItem>
                      </RecoverGroupDialog>
                      <HardDeleteGroupDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Eliminar{" "}
                        </DropdownMenuItem>
                      </HardDeleteGroupDialog>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [groups]);

  return (
    <div className="flex flex-col gap-2">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Grupos</CardTitle>
          <CardDescription>Grupos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            actions={
              <CreateGroupDialog
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
            columns={columnsGroup}
            data={groups}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupPage;

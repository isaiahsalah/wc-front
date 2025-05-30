import {ISystemUser} from "@/utils/interfaces";
import {useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, Edit, KeyRound, List, PlusIcon, Trash2} from "lucide-react";

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
import {
  CreateUserDialog,
  EditUserDialog,
  HardDeleteUserDialog,
  RecoverUserDialog,
  SoftDeleteUserDialog,
} from "@/components/dialog/security/UserDialogs";
import {getUsers} from "@/api/security/user.api";
import {EditPermissionUserDialog} from "@/components/dialog/security/PermissionDialog";
interface Props {
  degree: number;
}
const UserPage: React.FC<Props> = ({degree}) => {
  const [users, setUsers] = useState<ISystemUser[] | null>(null);

  useEffect(() => {
    updateView();
  }, []);

  const updateView = async () => {
    try {
      const usersData = await getUsers({all: true});
      setUsers(usersData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Generar columnas dinámicamente
  const columnsUser: ColumnDef<ISystemUser>[] = useMemo(() => {
    if (!users) return [];
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
        accessorKey: "lastname",
        header: "Apellido",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => format(new Date(row.birthday as Date), "dd/MM/yyyy").trim(),
        accessorKey: "birthday",
        header: "Nacimiento",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorKey: "phone",
        header: "Telefono",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "user",
        header: "Usuario",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => `${row.work_group?.name}`.trim(),
        accessorKey: "work_group",
        header: "Grupo",
        cell: (info) =>
          info.getValue() === "undefined" ? (
            <Badge variant={"outline"} className="text-muted-foreground">
              {"N/A"}
            </Badge>
          ) : (
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
        cell: ({row}: {row: Row<ISystemUser>}) => {
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
                      <EditUserDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 3 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Edit /> Editar
                        </DropdownMenuItem>
                      </EditUserDialog>
                      <EditPermissionUserDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 3 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <KeyRound /> Permisos
                        </DropdownMenuItem>
                      </EditPermissionUserDialog>
                      <DropdownMenuSeparator />
                      <SoftDeleteUserDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Desactivar
                        </DropdownMenuItem>
                      </SoftDeleteUserDialog>
                    </>
                  ) : (
                    <>
                      <RecoverUserDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <ArchiveRestore /> Recuperar
                        </DropdownMenuItem>
                      </RecoverUserDialog>
                      <HardDeleteUserDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Eliminar
                        </DropdownMenuItem>
                      </HardDeleteUserDialog>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [users]);

  return (
    <div className="flex flex-col gap-2">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>Usuarios registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            actions={
              <CreateUserDialog
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
            columns={columnsUser}
            data={users}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;

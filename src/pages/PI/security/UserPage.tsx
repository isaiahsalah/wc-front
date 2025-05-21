import {IUser} from "@/utils/interfaces";
import {useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {
  ArchiveRestore,
  Edit,
  KeyRound,
  MoreVerticalIcon,
  PlusIcon,
  Tally5,
  Trash2,
  TrendingUpIcon,
} from "lucide-react";

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
import {format} from "date-fns";
import {
  CreateUserDialog,
  DeleteUserDialog,
  EditUserDialog,
  RecoverUserDialog,
} from "@/components/dialog/security/UserDialogs";
import {countCurrentMonth} from "@/utils/funtions";
import {getUsers} from "@/api/security/user.api";
import {EditPermissionUserDialog} from "@/components/dialog/security/PermissionDialog";

const UserPage = () => {
  const [users, setUsers] = useState<IUser[] | null>(null);

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
  const columnsUser: ColumnDef<IUser>[] = useMemo(() => {
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
        accessorFn: (row) => `${row.group?.name}`.trim(),
        accessorKey: "group",
        header: "Grupo",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
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
        cell: ({row}: {row: Row<IUser>}) => {
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
                      <EditUserDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar
                        </DropdownMenuItem>
                      </EditUserDialog>
                      <EditPermissionUserDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <KeyRound /> Permisos
                        </DropdownMenuItem>
                      </EditPermissionUserDialog>
                      <DropdownMenuSeparator />
                      <DeleteUserDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 /> Eliminar
                        </DropdownMenuItem>
                      </DeleteUserDialog>
                    </>
                  ) : (
                    <RecoverUserDialog id={row.original.id ?? 0} updateView={updateView}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <ArchiveRestore /> Recuperar
                      </DropdownMenuItem>
                    </RecoverUserDialog>
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
        <CardHeader className="relative">
          <CardDescription>Usuarios registrados</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {users ? users.length : 0} Usuarios
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />+{countCurrentMonth(users ? users : [])} este mes
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
            columns={columnsUser}
            data={users}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;

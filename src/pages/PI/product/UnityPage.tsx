import {IUnity} from "@/utils/interfaces";
import {useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {
  ArchiveRestore,
  Delete,
  Edit,
  MoreVerticalIcon,
  PlusIcon,
  Tally5,
  TrendingUpIcon,
} from "lucide-react";
import {
  CreateUnityDialog,
  DeleteUnityDialog,
  EditUnityDialog,
  RecoverUnityDialog,
} from "@/components/dialog/product/UnityDialogs";
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
import {getAllUnities} from "@/api/product/unity.api";
import {Badge} from "@/components/ui/badge";
import {countCurrentMonth} from "@/utils/funtions";

const UnityPage = () => {
  const [unities, setUnities] = useState<IUnity[]>([]);
  const [loading, setLoading] = useState(false); // Estado de carga

  useEffect(() => {
    updateView();
  }, []);

  const updateView = async () => {
    setLoading(true);
    try {
      const ProductionsData = await getAllUnities();
      setUnities(ProductionsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generar columnas dinámicamente
  const columnsUnity: ColumnDef<IUnity>[] = useMemo(() => {
    if (unities.length === 0) return [];
    return [
      {
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
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({row}: {row: Row<IUnity>}) => {
          return (
            <div className="flex gap-2 justify-end">
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
                      <EditUnityDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditUnityDialog>
                      <DropdownMenuSeparator />
                      <DeleteUnityDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Delete /> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteUnityDialog>
                    </>
                  ) : (
                    <RecoverUnityDialog id={row.original.id ?? 0} updateView={updateView}>
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
  }, [unities]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader className="relative">
          <CardDescription>Unidades registradas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {unities.length} Unidades
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />+{countCurrentMonth(unities)} este mes
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
          <CardTitle>Producción</CardTitle>
          <CardDescription>Producción registrada</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? null : (
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
              columns={columnsUnity}
              data={unities}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnityPage;

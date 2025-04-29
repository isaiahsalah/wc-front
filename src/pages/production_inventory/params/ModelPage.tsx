import { ModelInterfaces } from "@/utils/interfaces";
import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
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
  CreateModelDialog,
  DeleteModelDialog,
  EditModelDialog,
  RecoverModelDialog,
} from "@/components/dialog/params/ModelDialogs";
import { ColumnDef, Row } from "@tanstack/react-table";
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
import { getAllModels } from "@/api/params/model.api";
import { Badge } from "@/components/ui/badge";
import { countCurrentMonth } from "@/utils/funtions";

const ModelPage = () => {
  const [models, setModels] = useState<ModelInterfaces[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateView();
  }, []);

  const updateView = async () => {
    setLoading(true);
    try {
      const modelsData = await getAllModels();
      setModels(modelsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const columnsModel: ColumnDef<ModelInterfaces>[] = useMemo(() => {
    if (models.length === 0) return [];
    return [
      ...Object.keys(models[0]).map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        /* @ts-expect-error: Ignoramos el error en esta línea*/
        cell: (info) => info.getValue(),
      })),

      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }: { row: Row<ModelInterfaces> }) => {
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
                      <EditModelDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar
                        </DropdownMenuItem>
                      </EditModelDialog>
                      <DropdownMenuSeparator />
                      <DeleteModelDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Delete /> Eliminar
                        </DropdownMenuItem>
                      </DeleteModelDialog>
                    </>
                  ) : (
                    <RecoverModelDialog
                      id={row.original.id ?? 0}
                      updateView={updateView}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <ArchiveRestore /> Recuperar
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
  }, [models]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader className="relative">
          <CardDescription>Modelos registrados</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {models.length} Modelos
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />+
              {countCurrentMonth(models)} este mes
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
                <CreateModelDialog
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
              columns={columnsModel}
              data={models}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelPage;

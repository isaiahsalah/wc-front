import { ColorInterfaces} from "@/utils/interfaces";
import ColorCards from "@/components/cards/product/ColorCards";
import { useContext, useEffect, useMemo, useState } from "react";
import { TitleContext } from "@/providers/title-provider";
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
  CreateColorDialog,
  DeleteColorDialog,
  EditColorDialog,
  RecoverColorDialog,
} from "@/components/dialog/product/ColorDialogs";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
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
import { getAllColors } from "@/api/product/color.api";
import { Badge } from "@/components/ui/badge";
import { countCurrentMonth } from "@/utils/funtions";


// interface Props {
//   data: ColorInterfaces[];
//   updateView: () => void;
// }

const ColorPage  = ( ) => {

    const [colors, setColors] = useState<ColorInterfaces[]>([]);
    const [loading, setLoading] = useState(false); // Estado de carga

  
  useEffect(() => {
    updateView();
  }, []);

  const updateView = async () => {
    setLoading(true);
    try {
      const ProductionsData = await getAllColors();
      setColors(ProductionsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generar columnas dinámicamente
  const columns: ColumnDef<ColorInterfaces>[] = useMemo(() => {
    if (colors.length === 0) return [];
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
        cell: ({ row }: { row: Row<ColorInterfaces> }) => {
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
                      <EditColorDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                         <Edit/> Editar{" "}
                        </DropdownMenuItem>
                      </EditColorDialog>
                      <DropdownMenuSeparator />
                      <DeleteColorDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                         <Delete/> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteColorDialog>
                    </>
                  ) : (
                    <RecoverColorDialog
                      id={row.original.id ?? 0}
                      updateView={updateView}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                       <ArchiveRestore/> Recuperar{" "}
                      </DropdownMenuItem>
                    </RecoverColorDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [colors]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader className="relative">
          <CardDescription>Colores registrados</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {colors.length} Colores
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />+
              {countCurrentMonth(colors)} este mes
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
              <CreateColorDialog
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
            columns={columns}
            data={colors}
          />
          )}
        </CardContent>
      </Card>
      
    </div>
  );
};

export default ColorPage;
//      <ColorTable data={data} updateView={updateView} />

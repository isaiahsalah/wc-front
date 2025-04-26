import { z } from "zod";
import { ColorInterfaces, ColorSchema, GeneralSchema } from "@/utils/interfaces";
import ColorCards from "@/components/cards/product/ColorCards";
import ColorTable from "@/components/tables/product/ColorTable";
import { useContext, useEffect, useMemo } from "react";
import { TitleContext } from "@/providers/title-provider";
import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  ArchiveRestore,
  ArchiveRestoreIcon,
  Delete,
  Edit,
  MoreVerticalIcon,
  PlusIcon,
} from "lucide-react";
import {
  CreateColorDialog,
  DeleteColorDialog,
  EditColorDialog,
  RecoverColorDialog,
} from "@/components/dialog/product/ColorDialogs";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface Props {
  data: ColorInterfaces[];
  updateView: () => void;
}

const ColorPage: React.FC<Props> = ({ data, updateView }) => {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Colores");
  }, []);

  // Generar columnas dinámicamente
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return [
       
      ...Object.keys(data[0]).map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        cell: (info: any) => info.getValue(),
      })),
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
                          Editar{" "}
                        </DropdownMenuItem>
                      </EditColorDialog>
                      <DropdownMenuSeparator />
                      <DeleteColorDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteColorDialog>
                    </>
                  ) : (
                    <RecoverColorDialog
                      id={row.original.id ?? 0}
                      updateView={updateView}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Recuperar{" "}
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
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <ColorCards initialData={data} />
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
        data={data}
      />
    </div>
  );
};

export default ColorPage;
//      <ColorTable data={data} updateView={updateView} />

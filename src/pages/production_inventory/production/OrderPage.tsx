import { OrderInterfaces } from "@/utils/interfaces";
import OrderCards from "@/components/cards/production/OrderCards";
import OrderTable from "@/components/tables/production/OrderTable";
import { Row } from "@tanstack/react-table";
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
  CreateOrderDialog,
  DeleteOrderDialog,
  EditOrderDialog,
  RecoverOrderDialog,
} from "@/components/dialog/production/OrderDialogs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface Props {
  data: OrderInterfaces[];
  updateView: () => void;
}

const OrderPage: React.FC<Props> = ({ data, updateView }) => {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Unidades");
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
        cell: ({ row }: { row: Row<OrderInterfaces> }) => {
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
                      <EditOrderDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditOrderDialog>
                      <DropdownMenuSeparator />
                      <DeleteOrderDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Delete /> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteOrderDialog>
                    </>
                  ) : (
                    <RecoverOrderDialog
                      id={row.original.id ?? 0}
                      updateView={updateView}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <ArchiveRestore /> Recuperar{" "}
                      </DropdownMenuItem>
                    </RecoverOrderDialog>
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
      <OrderCards initialData={data} />
      <DataTable
        actions={
          <CreateOrderDialog
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

export default OrderPage;
//<OrderTable data={data} updateView={updateView} />

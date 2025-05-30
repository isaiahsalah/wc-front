import {IProductionOrder, ISystemUser} from "@/utils/interfaces";
import {ColumnDef, Row} from "@tanstack/react-table";
import {useContext, useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, Edit, List, PlusIcon, Trash2} from "lucide-react";
import {
  CreateOrderDialog,
  EditOrderDialog,
  HardDeleteOrderDialog,
  RecoverOrderDialog,
  SoftDeleteOrderDialog,
} from "@/components/dialog/production/OrderDialogs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

import {getOrders} from "@/api/production/order.api";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
import {typeTurn} from "@/utils/const";
interface Props {
  degree: number;
}
const OrderPage: React.FC<Props> = ({degree}) => {
  const [orders, setOrders] = useState<IProductionOrder[] | null>(null);
  const {sectorProcess} = useContext(SectorProcessContext);

  useEffect(() => {
    updateView();
  }, [sectorProcess]);

  const updateView = async () => {
    try {
      const ProductionsData = await getOrders({
        all: true,
        id_sector_process: sectorProcess?.id,
      });
      setOrders(ProductionsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Generar columnas dinámicamente
  const columnsOrder: ColumnDef<IProductionOrder>[] = useMemo(() => {
    if (!orders) return [];
    return [
      {
        accessorFn: (row) => ` ${row?.work_group?.name}`.trim(),
        header: "Grupo",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => ` ${typeTurn.find((turn) => turn.id === row?.type_turn)?.name}`.trim(),

        header: "Turno",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorKey: "init_date",
        header: "Fecha de inicio",
        cell: (info) => format(new Date(info.getValue() as Date), "dd/MM/yyyy HH:mm"),
      },

      {
        accessorKey: "end_date",
        header: "Fecha de fin",
        cell: (info) => format(new Date(info.getValue() as Date), "dd/MM/yyyy HH:mm"),
      },
      {
        accessorFn: (row) => ` ${row?.production_order_details?.length}`.trim(),
        header: "Produciones",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },

      {
        accessorKey: "sys_user",
        header: "Usuario Creador",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {(info.getValue() as ISystemUser).name} {(info.getValue() as ISystemUser).lastname}
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
        cell: ({row}: {row: Row<IProductionOrder>}) => {
          return (
            <div className="flex gap-2  justify-end  ">
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
                      <EditOrderDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 3 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditOrderDialog>
                      <DropdownMenuSeparator />
                      <SoftDeleteOrderDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Desactivar{" "}
                        </DropdownMenuItem>
                      </SoftDeleteOrderDialog>
                    </>
                  ) : (
                    <>
                      <RecoverOrderDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <ArchiveRestore /> Recuperar{" "}
                        </DropdownMenuItem>
                      </RecoverOrderDialog>
                      <HardDeleteOrderDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Eliminar{" "}
                        </DropdownMenuItem>
                      </HardDeleteOrderDialog>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [orders]);
  return (
    <div className="grid grid-cols-6 gap-2">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Ordenes</CardTitle>
          <CardDescription>Ordenes registrada</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            actions={
              <CreateOrderDialog
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
            columns={columnsOrder}
            data={orders}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPage;
//<OrderTable data={data} updateView={updateView} />

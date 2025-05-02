import {IOrder} from "@/utils/interfaces";
import {ColumnDef, Row} from "@tanstack/react-table";
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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {getAllOrders} from "@/api/production/order.api";
import {countCurrentMonth} from "@/utils/funtions";
import {Badge} from "@/components/ui/badge";
import {CreateOrderDetailDialog} from "@/components/dialog/production/OrderDetailDialogs";

const OrderPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  const [loading, setLoading] = useState(false); // Estado de carga

  useEffect(() => {
    updateView();
  }, []);

  const updateView = async () => {
    setLoading(true);
    try {
      const ProductionsData = await getAllOrders();
      setOrders(ProductionsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generar columnas dinámicamente
  const columnsOrder: ColumnDef<IOrder>[] = useMemo(() => {
    if (orders.length === 0) return [];
    return [
      ...Object.keys(orders[0]).map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        /* @ts-expect-error: Ignoramos el error en esta línea*/
        cell: (info) => info.getValue(),
      })),
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({row}: {row: Row<IOrder>}) => {
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
                      <EditOrderDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditOrderDialog>
                      <DropdownMenuSeparator />
                      <DeleteOrderDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Delete /> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteOrderDialog>
                    </>
                  ) : (
                    <RecoverOrderDialog id={row.original.id ?? 0} updateView={updateView}>
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
  }, [orders]);
  return (
    <div className="grid grid-cols-6 gap-4">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader className="relative">
          <CardDescription>Órdenes registradas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {orders.length} Órdenes
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {/* @ts-expect-error: Ignoramos el error en esta línea*/}
              <TrendingUpIcon className="size-3" />+{countCurrentMonth(orders)} este mes
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
                <CreateOrderDetailDialog
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
              columns={columnsOrder}
              data={orders}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPage;
//<OrderTable data={data} updateView={updateView} />

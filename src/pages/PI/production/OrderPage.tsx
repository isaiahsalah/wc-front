import {IOrder, IUser} from "@/utils/interfaces";
import {ColumnDef, Row} from "@tanstack/react-table";
import {useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {
  ArchiveRestore,
  Edit,
  MoreVerticalIcon,
  PlusIcon,
  Tally5,
  Trash2,
  TrendingUpIcon,
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
import {format} from "date-fns";

const OrderPage = () => {
  const [orders, setOrders] = useState<IOrder[] | null>(null);

  useEffect(() => {
    updateView();
  }, []);

  const updateView = async () => {
    try {
      const ProductionsData = await getAllOrders();
      setOrders(ProductionsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Generar columnas dinámicamente
  const columnsOrder: ColumnDef<IOrder>[] = useMemo(() => {
    if (!orders) return [];
    return [
      {
        accessorFn: (row) => row.id?.toString().trim(),
        accessorKey: "id",
        header: "Id",
        cell: (info) => info.getValue(),
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
        accessorKey: "user",
        header: "Usuario",
        cell: (info) => (
          <Badge variant={"outline"} className="text-muted-foreground">
            {(info.getValue() as IUser).name} {(info.getValue() as IUser).lastname}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => format(new Date(row.createdAt as Date), "dd/MM/yyyy HH:mm").trim(),
        accessorKey: "createdAt",
        header: "Creado",
        cell: (info) => (
          <Badge variant={"outline"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => format(new Date(row.updatedAt as Date), "dd/MM/yyyy HH:mm").trim(),
        accessorKey: "updatedAt",
        header: "Editado",
        cell: (info) => (
          <Badge variant={"outline"} className="text-muted-foreground">
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
                          <Trash2 /> Eliminar{" "}
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
            {orders ? orders.length : null} Órdenes
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />+{countCurrentMonth(orders ?? [])} este mes
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
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPage;
//<OrderTable data={data} updateView={updateView} />

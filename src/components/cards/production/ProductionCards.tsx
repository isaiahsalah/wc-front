import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Edit, MoreVerticalIcon, Tally5, TrendingUpIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {countCurrentMonth} from "@/utils/funtions";
import {IOrderDetail, IOrder, IProcess, IProduct, ISector} from "@/utils/interfaces";
import DataTable from "@/components/table/DataTable";
import {useEffect, useMemo, useState} from "react";
import {getOrderDetails_date} from "@/api/production/orderDetail.api";
import {ColumnDef, Row} from "@tanstack/react-table";

import {getProcesses} from "@/api/params/process.api";
import {getSectors} from "@/api/params/sector.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {CreateProductionOrderDialog} from "@/components/dialog/production/ProductionOrderDialogs";

interface Props {
  initialData: IProduct[];
}

const ProductionCards: React.FC<Props> = ({initialData}) => {
  const [orderDetails, setOrderDetails] = useState<IOrderDetail[]>([]);
  const [sector, setSector] = useState<number | null>(null);
  const [process, setProcess] = useState<number | null>(null);
  const [sectors, setSectors] = useState<ISector[]>();
  const [processes, setProcesses] = useState<IProcess[]>();

  useEffect(() => {
    updateView();
  }, [sector, process]);

  useEffect(() => {
    fetchFilter();
  }, []);

  const fetchFilter = async () => {
    try {
      const ProcessesData = await getProcesses();
      const SectorsData = await getSectors();

      setProcesses(ProcessesData);
      setSectors(SectorsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const updateView = async () => {
    try {
      const date = new Date().toISOString();
      const OrderDetailsData = await getOrderDetails_date({
        date: date,
        id_process: process ?? undefined,
        id_sector: sector ?? undefined,
      });

      console.log(OrderDetailsData);
      setOrderDetails(OrderDetailsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Generar columnas dinámicamente
  const columns: ColumnDef<IOrderDetail>[] = useMemo(() => {
    if (orderDetails.length === 0) return [];
    return [
      {
        accessorKey: "id",
        header: "Id",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "amount",
        header: "Cant. Ordenada",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "production_count",
        header: "Cant. Producida",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "product",
        header: "Producto",
        cell: (info) => {
          const product: IProduct = info.getValue() as IProduct;
          return product.name;
        },
      },
      {
        id: "product_process",
        accessorKey: "product",
        header: "Proceso",
        cell: (info) => {
          const product: IProduct = info.getValue() as IProduct;
          return product.model?.process?.name;
        },
      },
      {
        id: "product_sector",
        accessorKey: "product",
        header: "Sector",
        cell: (info) => {
          const product: IProduct = info.getValue() as IProduct;
          return product.model?.sector?.name;
        },
      },
      {
        accessorKey: "order",
        header: "Fecha Límite",
        cell: (info) => {
          const order: IOrder = info.getValue() as IOrder;
          return order.end_date;
        },
      },
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({row}: {row: Row<IOrderDetail>}) => {
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
                  <CreateProductionOrderDialog
                    idOrderDetail={row.original.id ?? 0}
                    updateView={updateView}
                  >
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Edit /> Producir
                    </DropdownMenuItem>
                  </CreateProductionOrderDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },

      /*...Object.keys(orderDetails[0]).map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        cell: (info: any) => {
          const value = info.getValue();

          // Si el valor es un objeto, lo convertimos a una cadena para evitar crasheos
          if (value && typeof value === "object") {
            return JSON.stringify(value, null, 2); // Puedes ajustar el formato
          }

          // Si no es un objeto, solo mostramos el valor
          return value;
        },
      })),*/
    ];
  }, [orderDetails]);

  return (
    <div className="grid grid-cols-6 gap-4">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader className="relative">
          <CardDescription>Producciones registradas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {initialData.length} Producciones
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />+{countCurrentMonth(initialData)} este mes
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
          <CardDescription>Ordenes de producción pendientes</CardDescription>
          <div className="flex gap-2">
            <Select
              onValueChange={(value) => setSector(Number(value))} // Convertir el valor a número
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar Sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors?.map((sector: ISector) => (
                  <SelectItem key={sector.id} value={(sector.id ?? "").toString()}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setProcess(Number(value))} // Convertir el valor a número
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar Proceso" />
              </SelectTrigger>
              <SelectContent>
                {processes?.map((process: IProcess) => (
                  <SelectItem key={process.id} value={(process.id ?? "").toString()}>
                    {process.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable hasOptions={false} actions={<></>} columns={columns} data={orderDetails} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionCards;

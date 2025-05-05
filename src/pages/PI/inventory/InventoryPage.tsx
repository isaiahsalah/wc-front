import {
  IOrderDetail,
  IOrder,
  IProcess,
  IProduct,
  IProduction,
  ISector,
  IMachine,
  ILote,
  IUser,
} from "@/utils/interfaces";
import {ColumnDef, Row} from "@tanstack/react-table";
import {useContext, useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, Delete, Edit, MoreVerticalIcon} from "lucide-react";
import {
  DeleteProductionDialog,
  EditProductionDialog,
  RecoverProductionDialog,
} from "@/components/dialog/production/ProductionDialogs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {getProcesses} from "@/api/params/process.api";
import {getSectors} from "@/api/params/sector.api";
import {getOrderDetails_date} from "@/api/production/orderDetail.api";
import {getProductions} from "@/api/production/production.api";
import {CreateProductionOrderDialog} from "@/components/dialog/production/ProductionOrderDialogs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {format} from "date-fns";
import {SectorContext} from "@/providers/sector-provider";
import {typeQuality} from "@/utils/const";
import {Badge} from "@/components/ui/badge";

const InventoryPage = () => {
  const [productions, setProductions] = useState<IProduction[] | null>(null);
  const [orderDetails, setOrderDetails] = useState<IOrderDetail[] | null>(null);
  const {sector} = useContext(SectorContext);

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
        id_sector: sector?.id ?? undefined,
      });

      setOrderDetails(OrderDetailsData);

      const ProductionsData = await getProductions();
      setProductions(ProductionsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Generar columnas dinámicamente
  const columnsProduction: ColumnDef<IProduction>[] = useMemo(() => {
    if (!productions) return [];
    return [
      {
        accessorKey: "id",
        header: "Id",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Descripción",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "date",
        header: "Fecha",
        cell: (info) => (
          <Badge variant={"outline"} className="text-muted-foreground">
            {format(info.getValue() as Date, "dd/MM/yyyy hh:mm")}
          </Badge>
        ),
      },
      {
        accessorKey: "type_quality",
        header: "Calidad",
        cell: (info) => (
          <Badge variant={"outline"} className="text-muted-foreground">
            {typeQuality.find((item) => item.id === info.getValue())?.name}
          </Badge>
        ),
      },

      {
        accessorKey: "amount",
        header: "Cantidad",
        cell: ({row}: {row: Row<IProduction>}) => {
          return (
            <Badge variant={"outline"} className="text-muted-foreground">
              {row.original.amount} {row.original.unity?.shortname}
            </Badge>
          );
        },
      },
      {
        accessorKey: "machine",
        header: "Maquina",
        cell: (info) => (
          <Badge variant={"outline"} className="text-muted-foreground">
            {(info.getValue() as IMachine).name}
          </Badge>
        ),
      },
      {
        accessorKey: "lote",
        header: "Lote",
        cell: (info) => (
          <Badge variant={"outline"} className="text-muted-foreground">
            {(info.getValue() as ILote).name}
          </Badge>
        ),
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
        accessorKey: "createdAt",
        header: "Creado",
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
            return format(new Date(value), "dd/MM/yyyy hh:mm");
          }
          return "No disponible";
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Editado",
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
            return format(new Date(value), "dd/MM/yyyy hh:mm");
          }
          return "No disponible";
        },
      },

      {
        accessorKey: "deletedAt",
        header: "Eliminado",
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
            return format(new Date(value), "dd/MM/yyyy hh:mm");
          }
          return "-";
        },
      },
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({row}: {row: Row<IProduction>}) => {
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
                      <EditProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditProductionDialog>
                      <DropdownMenuSeparator />
                      <DeleteProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Delete /> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteProductionDialog>
                    </>
                  ) : (
                    <RecoverProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <ArchiveRestore /> Recuperar{" "}
                      </DropdownMenuItem>
                    </RecoverProductionDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [productions]);

  // Generar columnas dinámicamente
  const columnsOrderDetails: ColumnDef<IOrderDetail>[] = useMemo(() => {
    if (!orderDetails) return [];
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
          return format(new Date(order.end_date as Date), "dd/MM/yyyy hh:mm");
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
        <CardContent className=" flex flex-col gap-2">
          <CardDescription>Selecciona el sector y proceso</CardDescription>
          <div className="grid grid-cols-6 gap-2">
            <Select
              value={sector?.id?.toString() as string}
              //onValueChange={(value) => setSector(Number(value))} // Convertir el valor a número
            >
              <SelectTrigger className="w-full col-span-3" disabled>
                <SelectValue placeholder="Sector" />
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
              <SelectTrigger className="w-full col-span-3">
                <SelectValue placeholder="Proceso" />
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
        </CardContent>
      </Card>
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Ordenes Pendientes</CardTitle>
          <CardDescription>Ordenes de producción pendientes</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            hasOptions={false}
            actions={<></>}
            columns={columnsOrderDetails}
            data={orderDetails}
          />
        </CardContent>
      </Card>

      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Producción</CardTitle>
          <CardDescription>Producción registrada</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable actions={<></>} columns={columnsProduction} data={productions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;
// <ProductionTable data={data} updateView={updateView} />

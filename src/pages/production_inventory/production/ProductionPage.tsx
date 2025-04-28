import {
  OrderDetailInterfaces,
  OrderInterfaces,
  ProcessInterfaces,
  ProductInterfaces,
  ProductionInterfaces,
  SectorInterfaces,
} from "@/utils/interfaces"; 
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import {   useEffect, useMemo, useState } from "react"; 
import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  ArchiveRestore, 
  Delete,
  Edit,
  MoreVerticalIcon, 
} from "lucide-react";
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
import { getProcesses } from "@/api/params/process.api";
import { getSectors } from "@/api/params/sector.api";
import { getOrderDetails_date } from "@/api/production/orderDetail.api";
import { getAllProductions } from "@/api/production/production.api";
import { CreateProductionOrderDialog } from "@/components/dialog/production/ProductionOrderDialogs";
import {
  Card,
  CardContent,
  CardDescription, 
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductionPage = () => {
  const [productions, setProductions] = useState<ProductionInterfaces[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetailInterfaces[]>([]);

  const [loading, setLoading] = useState(false); // Estado de carga
  const [sector, setSector] = useState<number | null>(null);
  const [process, setProcess] = useState<number | null>(null);
  const [sectors, setSectors] = useState<SectorInterfaces[]>();
  const [processes, setProcesses] = useState<ProcessInterfaces[]>();

  useEffect(() => {
    updateView();
  }, [sector, process]);

  useEffect(() => {
    fetchFilter();
  }, []);

  const fetchFilter = async () => {
    setLoading(true);
    try {
      const ProcessesData = await getProcesses();
      const SectorsData = await getSectors();

      setProcesses(ProcessesData);
      setSectors(SectorsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateView = async () => {
    setLoading(true);
    try {
      const date = new Date().toISOString();
      const OrderDetailsData = await getOrderDetails_date({
        date: date,
        id_process: process ?? undefined,
        id_sector: sector ?? undefined,
      });

      setOrderDetails(OrderDetailsData);

      const ProductionsData = await getAllProductions();
      setProductions(ProductionsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generar columnas dinámicamente
  // @ts-expect-error: Ignoramos el error en esta línea
  const columnsProduction: ColumnDef<ProductionInterfaces> = useMemo(() => {
    if (productions.length === 0) return [];
    return [
      ...Object.keys(productions[0]).map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        cell: (info: CellContext<ProductionInterfaces, unknown>) =>
          info.getValue(),
      })),
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }: { row: Row<ProductionInterfaces> }) => {
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
                      <EditProductionDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditProductionDialog>
                      <DropdownMenuSeparator />
                      <DeleteProductionDialog
                        id={row.original.id ?? 0}
                        updateView={updateView}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Delete /> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteProductionDialog>
                    </>
                  ) : (
                    <RecoverProductionDialog
                      id={row.original.id ?? 0}
                      updateView={updateView}
                    >
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
  const columnsOrderDetails: ColumnDef<OrderDetailInterfaces>[] =
    useMemo(() => {
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
            const product: ProductInterfaces =
              info.getValue() as ProductInterfaces;
            return product.name;
          },
        },
        {
          id: "product_process",
          accessorKey: "product",
          header: "Proceso",
          cell: (info) => {
            const product: ProductInterfaces =
              info.getValue() as ProductInterfaces;
            return product.model?.process?.name;
          },
        },
        {
          id: "product_sector",
          accessorKey: "product",
          header: "Sector",
          cell: (info) => {
            const product: ProductInterfaces =
              info.getValue() as ProductInterfaces;
            return product.model?.sector?.name;
          },
        },
        {
          accessorKey: "order",
          header: "Fecha Límite",
          cell: (info) => {
            const order: OrderInterfaces = info.getValue() as OrderInterfaces;
            return order.end_date;
          },
        },
        {
          id: "actions",
          header: "",
          enableHiding: false,
          cell: ({ row }: { row: Row<OrderDetailInterfaces> }) => {
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
          <CardDescription>Ordenes de producción pendientes</CardDescription>
          <div className="flex gap-2">
            <Select
              onValueChange={(value) => setSector(Number(value))} // Convertir el valor a número
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar Sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors?.map((sector: SectorInterfaces) => (
                  <SelectItem
                    key={sector.id}
                    value={(sector.id ?? "").toString()}
                  >
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
                {processes?.map((process: ProcessInterfaces) => (
                  <SelectItem
                    key={process.id}
                    value={(process.id ?? "").toString()}
                  >
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
          {loading ? null : (
            <DataTable
              options={false}
              actions={<></>}
              /*@ts-expect-error: Ignoramos el error en esta línea */
              columns={columnsOrderDetails}
              /*@ts-expect-error: Ignoramos el error en esta línea */
              data={orderDetails}
            />
          )}
        </CardContent>
      </Card>

      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Producción</CardTitle>
          <CardDescription>Producción registrada</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? null : (
            <DataTable
              actions={<></>}
              // @ts-expect-error: Ignoramos el error en esta línea
              columns={columnsProduction}
              /*@ts-expect-error: Ignoramos el error en esta línea */
              data={productions}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionPage;
// <ProductionTable data={data} updateView={updateView} />

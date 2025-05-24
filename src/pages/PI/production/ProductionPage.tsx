import {IOrderDetail, IOrder, IProduct, IProduction, IMachine, ISector} from "@/utils/interfaces";
import {ColumnDef, Row} from "@tanstack/react-table";
import {useContext, useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, Edit, MoreVerticalIcon, Printer, Trash2} from "lucide-react";
import {
  CreateProductionsDialog,
  DeleteProductionDialog,
  EditProductionDialog,
  PrintQRDialog,
  RecoverProductionDialog,
} from "@/components/dialog/production/ProductionDialogs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {getOrderDetails_date} from "@/api/production/orderDetail.api";
import {getProductions} from "@/api/production/production.api";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {format} from "date-fns";
import {typeQuality} from "@/utils/const";
import {Badge} from "@/components/ui/badge";
import {getMachines} from "@/api/params/machine.api";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
import {SesionContext} from "@/providers/sesionProvider";
interface Props {
  degree: number;
}
const ProductionPage: React.FC<Props> = ({degree}) => {
  const [productions, setProductions] = useState<IProduction[] | null>(null);
  const [orderDetails, setOrderDetails] = useState<IOrderDetail[] | null>(null);
  const {sectorProcess} = useContext(SectorProcessContext);
  const {sesion} = useContext(SesionContext);

  const [idMachine, setIdMachine] = useState<number>();

  const [machines, setMachines] = useState<IMachine[]>();
  const [sector, setSector] = useState<ISector>();

  useEffect(() => {
    if (sector)
      getMachines({id_process: process?.id, id_sector: sector?.id}).then((MachinesData) =>
        setMachines(MachinesData)
      );
  }, [process, sector]);

  useEffect(() => {
    updateView();
  }, [idMachine]);

  const updateView = async () => {
    try {
      const date = new Date().toISOString();
      const OrderDetailsData = await getOrderDetails_date({
        date: date,
        id_process: process?.id ?? null,
        id_sector: sector?.id ?? null,
        id_machine: idMachine ?? null,
      });

      setOrderDetails(OrderDetailsData);

      const ProductionsData = await getProductions({
        id_process: process?.id ?? null,
        id_machine: idMachine ?? null,
        id_sector: sector?.id ?? null,
        all: true,
      });
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
        accessorKey: "lote",
        header: "Lote",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Descripción",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "order_detail",
        header: "Producto",
        cell: (info) => (info.getValue() as IOrderDetail).product?.name,
      },
      {
        accessorKey: "date",
        header: "Fecha",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {format(info.getValue() as Date, "dd/MM/yyyy HH:mm")}
          </Badge>
        ),
      },
      {
        accessorKey: "type_quality",
        header: "Calidad",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {typeQuality.find((item) => item.id === info.getValue())?.name}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => ` ${row.production_unit?.name}`.trim(),
        accessorKey: "production_unit",
        header: "Unidad",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },
      {
        accessorFn: (row) =>
          `${row.equivalent_amount} ${row.production_equivalent_unit?.shortname}`.trim(),
        accessorKey: "production_equivalent_unit",
        header: "Equivalente",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },
      {
        accessorFn: (row) => `${row.weight} kg`.trim(),
        accessorKey: "weight",
        header: "Peso",
        cell: (info) => {
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          );
        },
      },

      {
        accessorKey: "micronage",
        header: "Micronaje",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {(info.getValue() as []) ? (info.getValue() as []).join(" - ") : " - "}
          </Badge>
        ),
      },
      {
        accessorKey: "machine",
        header: "Maquina",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {(info.getValue() as IMachine).name}
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
                      <PrintQRDialog production={row.original}>
                        <DropdownMenuItem
                          disabled={degree < 2 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Printer /> Reimprimir{" "}
                        </DropdownMenuItem>
                      </PrintQRDialog>

                      <DropdownMenuSeparator />

                      <EditProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 3 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditProductionDialog>
                      <DeleteProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Eliminar{" "}
                        </DropdownMenuItem>
                      </DeleteProductionDialog>
                    </>
                  ) : (
                    <RecoverProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                      <DropdownMenuItem
                        disabled={degree < 4 ? true : false}
                        onSelect={(e) => e.preventDefault()}
                      >
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
        accessorKey: "amount",
        header: "Cant. Ordenada",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "productionsGod",
        header: "Cant. Buena",
        cell: ({row}: {row: Row<IOrderDetail>}) =>
          (row.original.productions as IProduction[]).filter((obj) => obj.type_quality === 1)
            .length,
      },
      {
        accessorKey: "productionsBad",
        header: "Cant. Mala",
        cell: ({row}: {row: Row<IOrderDetail>}) =>
          (row.original.productions as IProduction[]).filter((obj) => obj.type_quality !== 1)
            .length,
      },
      {
        accessorKey: "product",
        header: "Producto",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {(info.getValue() as IProduct).name}
          </Badge>
        ),
      },
      {
        accessorKey: "machine",
        header: "Maquina",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {(info.getValue() as IMachine).name}
          </Badge>
        ),
      },
      {
        id: "product_process",
        accessorKey: "product",
        header: "Proceso",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {(info.getValue() as IProduct).model?.process?.name}
          </Badge>
        ),
      },
      {
        id: "product_sector",
        accessorKey: "product",
        header: "Sector",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {(info.getValue() as IProduct).model?.sector?.name}
          </Badge>
        ),
      },
      {
        accessorKey: "order",
        header: "Fecha Límite",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {format((info.getValue() as IOrder).end_date as Date, "dd/MM/yyyy HH:mm")}
          </Badge>
        ),
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
                  <CreateProductionsDialog orderDetail={row.original} updateView={updateView}>
                    <DropdownMenuItem
                      disabled={degree < 2 ? true : false}
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Edit /> Producir
                    </DropdownMenuItem>
                  </CreateProductionsDialog>
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
          <CardDescription>Selecciona la máquina</CardDescription>

          <div className="grid grid-cols-6 gap-2">
            <Select
              onValueChange={(value) => setIdMachine(Number(value))} // Convertir el valor a número
            >
              <SelectTrigger className="w-full col-span-6">
                <SelectValue placeholder="Máquina" />
              </SelectTrigger>
              <SelectContent>
                {machines?.map((machine: IMachine) => (
                  <SelectItem key={machine.id} value={(machine.id ?? "").toString()}>
                    {machine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {idMachine ? (
        <>
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
              <CardDescription>Producción registrada por el usuario activo</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable actions={<></>} columns={columnsProduction} data={productions} />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default ProductionPage;
// <ProductionTable data={data} updateView={updateView} />

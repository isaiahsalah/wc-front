import {
  IProductionOrderDetail,
  IProductionOrder,
  IProduct,
  IProduction,
  IMachine,
  IProductionUser,
} from "@/utils/interfaces";
import {ColumnDef, Row} from "@tanstack/react-table";
import {useContext, useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, Edit, List, Printer, Trash2} from "lucide-react";
import {
  CreateProductionsDialog,
  EditProductionDialog,
  HardDeleteProductionDialog,
  PrintQRDialog,
  RecoverProductionDialog,
  SoftDeleteProductionDialog,
} from "@/components/dialog/production-and-recycling/production/ProductionDialogs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {getOrderDetails} from "@/api/production-and-recycling/production/orderDetail.api";
import {getProductions} from "@/api/production-and-recycling/production/production.api";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

import {format} from "date-fns";
import {typeQuality, typeSize, typeTurn} from "@/utils/const";
import {Badge} from "@/components/ui/badge";
import {getMachines} from "@/api/production-and-recycling/params/machine.api";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
import {SesionContext} from "@/providers/sesionProvider";
import {getWeekRange} from "@/utils/funtions";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Separator} from "@/components/ui/separator";
interface Props {
  type_screen: number;
  degree: number;
}
const ProductionPage: React.FC<Props> = ({degree, type_screen}) => {
  const [productions, setProductions] = useState<IProduction[] | null>(null);
  const [orderDetails, setOrderDetails] = useState<IProductionOrderDetail[] | null>(null);
  const {sectorProcess} = useContext(SectorProcessContext);
  const {sesion} = useContext(SesionContext);

  const [idMachine, setIdMachine] = useState<number>();

  const [machines, setMachines] = useState<IMachine[]>();
  const weekRange = getWeekRange();

  useEffect(() => {
    updateView();
    getMachines({id_sector_process: sectorProcess?.id}).then((MachinesData) =>
      setMachines(MachinesData)
    );
  }, [sesion, sectorProcess]);

  useEffect(() => {
    updateView();
  }, [idMachine]);

  const updateView = async () => {
    try {
      const date = new Date().toISOString();
      const OrderDetailsData = await getOrderDetails({
        id_work_group: sesion?.sys_user.id_work_group as number,
        date: date,
        id_sector_process: sectorProcess?.id ?? null,
        id_machine: idMachine ?? null,
      });

      setOrderDetails(OrderDetailsData);

      const ProductionsData = await getProductions({
        id_sector_process: sectorProcess?.id,
        id_machine: idMachine ?? null,
        init_date: weekRange.start.toISOString(),
        end_date: weekRange.end.toISOString(),
        all: true,
      });

      console.log("ProductionsData", ProductionsData);
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
        accessorKey: "date",
        header: "Fecha",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {format(info.getValue() as Date, "dd/MM/yyyy HH:mm")}
          </Badge>
        ),
      },
      {
        accessorKey: "lote",
        header: "Lote",
        cell: (info) => info.getValue(),
      },

      {
        accessorKey: "production_order_detail",
        header: "Producto",
        cell: (info) => (info.getValue() as IProductionOrderDetail).product?.name,
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
        accessorKey: "type_size",
        header: "Tamaño",

        cell: (info) =>
          info.getValue() ? (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {typeSize.find((item) => item.id === info.getValue())?.name}
            </Badge>
          ) : (
            <Badge variant={"outline"} className="text-muted-foreground">
              {"N/A"}
            </Badge>
          ),
      },

      {
        accessorKey: "micronage",
        header: "Micronaje",
        cell: (info) => {
          const micronaje = info.getValue() as [];
          if (micronaje)
            return (
              <Badge variant={"secondary"} className="text-muted-foreground">
                {micronaje.join(" - ")}
              </Badge>
            );
          else
            return (
              <Badge variant={"outline"} className="text-muted-foreground">
                {"N/A"}
              </Badge>
            );
        },
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
        accessorFn: (row) =>
          ` ${
            typeTurn.find(
              (turn) => turn.id === row.production_order_detail?.production_order?.type_turn
            )?.name
          }`.trim(),
        header: "Turno",
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
          ` ${row.production_order_detail?.production_order?.work_group?.name}`.trim(),
        header: "Grupo",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },

      {
        accessorKey: "production_users",
        header: "Operadores",
        cell: (info) => {
          const productionUsers = info.getValue() as IProductionUser[];
          return (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {productionUsers.map((productionUser) => productionUser.sys_user?.name).join(" - ")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Descripción",
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <Badge variant={"outline"} className="text-muted-foreground">
              {"Sin descripción"}
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
                      <SoftDeleteProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Desactivar{" "}
                        </DropdownMenuItem>
                      </SoftDeleteProductionDialog>
                    </>
                  ) : (
                    <>
                      <RecoverProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <ArchiveRestore /> Reactivar{" "}
                        </DropdownMenuItem>
                      </RecoverProductionDialog>
                      <HardDeleteProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem
                          disabled={degree < 4 ? true : false}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 /> Eliminar{" "}
                        </DropdownMenuItem>
                      </HardDeleteProductionDialog>
                    </>
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
  const columnsOrderDetails: ColumnDef<IProductionOrderDetail>[] = useMemo(() => {
    if (!orderDetails) return [];
    return [
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
        accessorKey: "amount",
        header: "Cant. Ordenada",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "productionsGod",
        header: "Cant. Buena",
        cell: ({row}: {row: Row<IProductionOrderDetail>}) =>
          (row.original.productions as IProduction[]).filter((obj) => obj.type_quality === 1)
            .length,
      },
      {
        accessorKey: "productionsBad",
        header: "Cant. Mala",
        cell: ({row}: {row: Row<IProductionOrderDetail>}) =>
          (row.original.productions as IProduction[]).filter((obj) => obj.type_quality !== 1)
            .length,
      },

      {
        accessorKey: "production_order",
        header: "Fecha Límite",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {format((info.getValue() as IProductionOrder).end_date as Date, "dd/MM/yyyy HH:mm")}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => ` ${row.production_order?.work_group?.name}`.trim(),
        header: "Grupo",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorFn: (row) =>
          ` ${typeTurn.find((turn) => turn.id === row.production_order?.type_turn)?.name}`.trim(),
        header: "Turno",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
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
            {(info.getValue() as IProduct).product_model?.sector_process?.process?.name}
          </Badge>
        ),
      },
      {
        id: "product_sector",
        accessorKey: "product",
        header: "Sector",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {(info.getValue() as IProduct).product_model?.sector_process?.sector?.name}
          </Badge>
        ),
      },

      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({row}: {row: Row<IProductionOrderDetail>}) => {
          return (
            <div className="flex gap-2 justify-end">
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
                  <CreateProductionsDialog
                    orderDetail={row.original}
                    updateView={updateView}
                    type_screen={type_screen}
                  >
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
    <div className="grid grid-cols-6 gap-2">
      <RadioGroup
        className="col-span-6   flex    gap-2  overflow-auto"
        onValueChange={(value) => setIdMachine(Number(value))}
      >
        {machines?.map((machine: IMachine, i) => (
          <label
            key={i}
            htmlFor={machine.name}
            className="flex flex-1 flex-grow min-w-[180px] gap-4 cursor-pointer rounded-lg border p-4 shadow-sm transition-all   h-full   bg-card/50   has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-card dark:has-[[data-state=checked]]:bg-secondary"
          >
            <RadioGroupItem id={machine.name} value={machine.id?.toString() as string} />
            <div className="flex flex-col gap-2">
              <CardTitle>{machine.name}</CardTitle>
              {machine.description && (
                <CardDescription className="  leading-tight">{machine.description}</CardDescription>
              )}
            </div>
          </label>
        ))}
      </RadioGroup>
      <Separator className="col-span-6" />

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
              <DataTable
                actions={<></>}
                columns={columnsProduction}
                data={productions}
                pageSize={10}
              />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default ProductionPage;
// <ProductionTable data={data} updateView={updateView} />

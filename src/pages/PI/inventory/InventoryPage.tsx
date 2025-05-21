import {IOrderDetail, IProcess, IProduction, ISector, IMachine, IUser} from "@/utils/interfaces";
import {ColumnDef, Row} from "@tanstack/react-table";
import {useContext, useEffect, useMemo, useState} from "react";
import DataTable from "@/components/table/DataTable";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, Edit, MoreVerticalIcon, Printer, Trash2} from "lucide-react";
import {
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
import {getProcesses} from "@/api/params/process.api";
import {getSectors} from "@/api/params/sector.api";
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
import {SectorContext} from "@/providers/sectorProvider";
import {typeQuality} from "@/utils/const";
import {Badge} from "@/components/ui/badge";

const InventoryPage = () => {
  const [productions, setProductions] = useState<IProduction[] | null>(null);
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
      const ProcessesData = await getProcesses({});
      const SectorsData = await getSectors({});

      setProcesses(ProcessesData);
      setSectors(SectorsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const updateView = async () => {
    try {
      const ProductionsData = await getProductions({
        id_process: process ?? null,
        id_sector: sector?.id ?? null,
        all: true,
      });
      console.log(ProductionsData);
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
        accessorKey: "user",
        header: "Usuario",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {(info.getValue() as IUser).name} {(info.getValue() as IUser).lastname}
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
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Printer /> Reimprimir{" "}
                        </DropdownMenuItem>
                      </PrintQRDialog>

                      <DropdownMenuSeparator />

                      <EditProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit /> Editar{" "}
                        </DropdownMenuItem>
                      </EditProductionDialog>
                      <DeleteProductionDialog id={row.original.id ?? 0} updateView={updateView}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 /> Eliminar{" "}
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
          <CardTitle>Producción</CardTitle>
          <CardDescription>Producción registrada por el usuario activo</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable actions={<></>} columns={columnsProduction} data={productions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;

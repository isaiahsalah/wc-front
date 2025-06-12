import {IProduction, IMachine, IProductionUser, IResponse} from "@/utils/interfaces";
import {ColumnDef, Row} from "@tanstack/react-table";
import {useContext, useEffect, useMemo, useState} from "react";
import {Button} from "@/components/ui/button";
import {ArchiveRestore, Edit, List, Printer, Trash2} from "lucide-react";
import {
  EditProductionDialog,
  HardDeleteProductionDialog,
  PrintQRDialog,
  RecoverProductionDialog,
  SoftDeleteProductionDialog,
} from "@/components/dialog/production/ProductionDialogs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {typeQuality, typeSize, typeTurn} from "@/utils/const";
import {Badge} from "@/components/ui/badge";
import {SectorProcessContext} from "@/providers/sectorProcessProvider";
import {getMachines} from "@/api/params/machine.api";
import {DateTimePicker} from "@/components/DateTimePicker";
import DataTable from "@/components/table/DataTablePaginated";
interface Props {
  degree: number;
}
const InventoryPage: React.FC<Props> = ({degree}) => {
  const [productions, setProductions] = useState<IProduction[] | null>(null);
  const {sectorProcess} = useContext(SectorProcessContext);

  const [initDate, setInitDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [machines, setMachines] = useState<IMachine[]>();
  const [idMachine, setIdMachine] = useState<number>();

  const [response, setResponse] = useState<IResponse>();

  useEffect(() => {
    getMachines({id_sector_process: sectorProcess?.id}).then((MachinesData) =>
      setMachines(MachinesData)
    );
  }, [sectorProcess]);

  useEffect(() => {
    updateView();
  }, [idMachine, initDate, endDate, sectorProcess]);

  const updateView = async () => {
    try {
      const responseData = await getProductions({
        init_date: initDate?.toISOString() ?? null,
        end_date: endDate?.toISOString() ?? null,
        id_sector_process: sectorProcess?.id ?? null,
        id_machine: idMachine ?? null,
        page: 1,
        page_size: 15,
        all: true,
      });
      console.log(responseData);
      setProductions(responseData.data as IProduction[]);
      setResponse(responseData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const changePage = async ({page, page_size}: {page?: number; page_size?: number}) => {
    try {
      const responseData = await getProductions({
        init_date: initDate?.toISOString() ?? null,
        end_date: endDate?.toISOString() ?? null,
        id_sector_process: sectorProcess?.id ?? null,
        id_machine: idMachine ?? null,
        page: page ?? 1,
        page_size: page_size ?? 15,
        all: true,
      });
      console.log(responseData);
      setProductions(responseData.data as IProduction[]);
      setResponse(responseData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Generar columnas dinámicamente
  const columnsProduction: ColumnDef<IProduction>[] = useMemo(() => {
    if (!productions) return [];
    return [
      {
        accessorFn: (row) => `${row.id}`.trim(),

        header: "ID",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => `${format(row.date as Date, "dd/MM/yyyy HH:mm")}`.trim(),

        header: "Fecha",
        cell: (info) => (
          <Badge variant={"secondary"} className="text-muted-foreground">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorFn: (row) =>
          `${format(new Date(row.threshold_date + "T00:00:00"), "dd/MM/yyyy")}`.trim(),

        header: "Fecha Umbral",
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
        accessorKey: "lote",
        header: "Lote",
        cell: (info) => info.getValue(),
      },

      {
        accessorFn: (row) => ` ${row.production_order_detail?.product?.name}`.trim(),
        header: "Producto",
        cell: (info) => info.getValue() as string,
      },

      {
        accessorFn: (row) => ` ${row.production_unit?.name}`.trim(),
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
        accessorFn: (row) =>
          `${
            row.type_size ? typeSize.find((item) => item.id === row.type_size)?.name : null
          } `.trim(),

        header: "Tamaño",

        cell: (info) =>
          info.getValue() != "null" ? (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          ) : (
            <Badge variant={"outline"} className="text-muted-foreground">
              {"N/A"}
            </Badge>
          ),
      },

      {
        accessorFn: (row) => `${row.micronage ? row.micronage.join(" - ") : null} `.trim(),

        accessorKey: "micronage",
        header: "Micronaje",
        cell: (info) => {
          if (info.getValue() != "null")
            return (
              <Badge variant={"secondary"} className="text-muted-foreground">
                {info.getValue() as string}
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
        accessorFn: (row) => `${row.machine != null ? row.machine.name : "-"} `.trim(),
        header: "Maquina",
        cell: (info) =>
          info.getValue() != "-" ? (
            <Badge variant={"secondary"} className="text-muted-foreground">
              {info.getValue() as string}
            </Badge>
          ) : (
            <Badge variant={"outline"} className="text-muted-foreground">
              {"N/A"}
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
                          <Trash2 /> Eliminar
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

  return (
    <div className="grid grid-cols-6 gap-2">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardContent className=" flex flex-col gap-2">
          <CardDescription>Selecciona la máquina</CardDescription>

          <div className="grid grid-cols-6 gap-2">
            <Select
              onValueChange={(value) => setIdMachine(Number(value))} // Convertir el valor a número
            >
              <SelectTrigger className="w-full col-span-2">
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
            <DateTimePicker
              className="col-span-2"
              value={initDate}
              onChange={setInitDate}
              placeholder=" Inicio"
            />

            <DateTimePicker
              className="col-span-2"
              value={endDate}
              onChange={setEndDate}
              placeholder="Fin"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader>
          <CardTitle>Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            actions={<></>}
            page={response?.page ?? 1}
            page_size={response?.page_size ?? 1}
            changePage={changePage}
            columns={columnsProduction}
            data={productions}
            total_pages={response?.total_pages ?? 1}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;

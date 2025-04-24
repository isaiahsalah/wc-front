import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, CheckCircle2Icon, CircleX } from "lucide-react";
import { GeneralSchema } from "@/utils/interfaces";
import { z } from "zod";
import ColorViewer from "./ColorSheet";
import { deleteColor, recoverColor } from "@/api/color.api";
import ColorSheet from "./ColorSheet";
import DataTableDinamic from "@/components/table/DataTableDinamic"; 

 
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDown,
  ChevronUp,
  ColumnsIcon,
  PlusIcon,
  Upload,
} from "lucide-react"; 
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 
import { useEffect, useState } from "react"; 
import { Filter } from "@/components/table/dataTableFilters";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView: () => void;
}

const ColorTable: React.FC<Props> = ({ data, updateView }) => {




  const columns: ColumnDef<z.infer<typeof GeneralSchema>>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        return (
          <div className={row.original.deletedAt ? "pointer-events-none" : ""}>
            <ColorViewer
              updateView={updateView}
              children={
                <Button
                  variant="link"
                  className=" w-fit px-0 text-left text-foreground"
                >
                  {row.original.name}
                </Button>
              }
              id={row.original.id}
            />
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => (
        <div className=" text-muted-foreground">{row.original.description}</div>
      ),
    },
    {
      accessorKey: "deletedAt",
      header: "Eliminado",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {row.original.deletedAt ? (
            <>
              <CircleX className="text-red-500 dark:text-red-400" />
              {new Date(row.original.deletedAt).toLocaleString()}
            </>
          ) : (
            <>
              <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
              Vigente
            </>
          )}
        </Badge>
      ),
      meta: {
        filterVariant: "select", // Indica que el filtro será un selector
      },
      filterFn: (row, columnId, filterValue) => {
        const deletedAt = row.getValue<Date | null>(columnId);
        if (filterValue === "Eliminado") {
          return !!deletedAt;
        }
        if (filterValue === "Vigente") {
          return !deletedAt;
        }
        return true;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu key={row.original.id}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                size="icon"
              >
                <MoreVerticalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <ColorSheet
                updateView={updateView}
                children={
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault(); // Evita el cierre automático
                    }}
                  >
                    Editar
                  </DropdownMenuItem>
                }
                id={row.original.id}
              />

              <DropdownMenuSeparator />
              {row.original.deletedAt ? (
                <DropdownMenuItem
                  onClick={() =>
                    recoverColor(row.original.id).then(() => updateView())
                  }
                >
                  Recuperar
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() =>
                    deleteColor(row.original.id).then(() => updateView())
                  }
                >
                  Eliminar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
    },
  ];




 const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    filterFns: {}, // Define funciones personalizadas si es necesario
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    console.log("El componente se ha renderizado");
  });





  return (
    <div className="flex flex-col gap-4">
    {/* Barra superior con filtros y opciones */}
    <div className="flex items-center justify-between gap-4">
      <Filter
        placeholder="Busqueda General"
        column={{
          getFilterValue: () => globalFilter,
          setFilterValue: setGlobalFilter,
          columnDef: { meta: { filterVariant: "text" } },
        }}
      />
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ColumnsIcon />
              <span className="ml-2 hidden lg:inline">
                Personalizar Columnas
              </span>
              <ChevronDownIcon className="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
                disabled={!column.getCanHide()}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm">
          <PlusIcon />
          <span className="ml-2 hidden lg:inline">Agregar</span>
        </Button>
      </div>
    </div>

    {/* Tabla principal */}
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const filterOptions =
                  header.column.id === "deletedAt"
                    ? [
                        { value: "Eliminado", label: "Eliminado" },
                        { value: "Vigente", label: "Vigente" },
                      ]
                    : undefined;
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div className="flex gap-2 py-2  ">
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter
                              placeholder={header.column.columnDef.header}
                              column={header.column}
                              options={filterOptions}
                            />
                          </div>
                        ) : null}

                        {header.column.getCanSort() && ( // Verifica si la columna puede ordenarse
                          <Button
                            variant={"link"}
                            size={"sm"}
                            {...{
                              className:
                                "cursor-pointer select-none flex gap-2 my-auto",
                              onClick:
                                header.column.getToggleSortingHandler(),
                            }}
                          >
                            {{
                              asc: <ChevronDown className="h-4 my-auto" />,
                              desc: <ChevronUp className="h-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ChevronsUpDown className="h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}

       
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    {/* Controles de paginación */}
    <div className="flex justify-between items-center">
      <div className="hidden lg:block">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
        </Button>
        <span>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRightIcon />
        </Button>
      </div>
    </div>
  </div>
  );
};

export default ColorTable;

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ColumnDef, flexRender} from "@tanstack/react-table";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {useEffect, useState} from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {Button} from "../ui/button";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
} from "lucide-react";
import {Label} from "../ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {IGeneral} from "@/utils/interfaces";
import TableSkeleton from "../skeleton/table-skeleton";
import ColumnFilter from "./DataTableFilter";
import {Input} from "../ui/input";

interface Props<T extends IGeneral> {
  data: T[] | null;
  actions: React.ReactNode;
  columns: ColumnDef<T>[];
  hasOptions?: boolean;
  page: number;
  page_size: number;
  total_pages: number;
  changePage: (pagination: {page: number; page_size: number}) => Promise<boolean>;
}

const DataTable = <T extends IGeneral>({
  data,
  actions,
  columns,
  hasOptions = true,
  page,
  page_size,
  total_pages,
  changePage,
}: Props<T>) => {
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [inputValue, setInputValue] = useState<string>(String(page));

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    setInputValue(String(page));
  }, [page]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    manualPagination: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },

    filterFns: {}, // Define funciones personalizadas si es necesario
    getRowId: (row) => (row.id ?? "").toString(),
    enableRowSelection: true,
    onPaginationChange: () => {},

    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // const headers = data.length > 0 ? Object.keys(data[0]) : [];

  useEffect(() => {
    if (data) setLoading(false);
    else setLoading(true);
  }, [data]);

  if (!data) {
    return (
      <TableSkeleton colums={5} rows={page_size} hasOptions={hasOptions} hasPaginated={true} />
    );
  }
  return (
    <div
      className={`flex flex-col gap-2 overflow-auto disabled ${
        loading ? "opacity-50" : "opacity-100 "
      }`}
    >
      {/* Barra superior con filtros y opciones */}
      {!hasOptions ? null : (
        <div className="flex items-center justify-between gap-2">
          <ColumnFilter table={table} placeholder="Filtrar..." />
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ColumnsIcon />
                  {/* <span className="ml-2 hidden lg:inline">Personalizar Columnas</span>*/}
                  <ChevronDownIcon className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                {table.getAllColumns().map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                    disabled={!column.getCanHide()}
                    onSelect={(event) => {
                      // Evita el cierre del dropdown
                      event.preventDefault();
                    }}
                  >
                    {typeof column.columnDef.header === "function"
                      ? ""
                      : column.columnDef.header || column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {actions}
          </div>
        </div>
      )}
      <div className="overflow-hidden rounded-lg border   ">
        <Table className="">
          <TableHeader className="bg-foreground/20 border-b-1  ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-left h-8  capitalize text-sm font-medium  "
                    >
                      {!header.column.columnDef.header
                        ? null
                        : header.column.columnDef.header.toString().replace(/_/g, " ")}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={i}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    row.original.deletedAt
                      ? "bg-destructive/25 hover:bg-destructive/50 border-0 "
                      : "odd:bg-accent/75 even:bg-muted/25    border-0"
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id} className="py-0 my-0  ">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No hay datos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Controles de paginación */}
      <div className="flex items-center justify-between px-4">
        {/*<div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} filas selecionadas.
          </div>*/}
        <div className="flex w-fit items-center justify-center text-sm   text-muted-foreground ">
          Página {page} de {total_pages}
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit ml-auto">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-normal text-muted-foreground">
              Mostrar
            </Label>
            <Select
              disabled={loading}
              value={`${page_size}`}
              onValueChange={(value) => {
                setLoading(true);
                changePage({page, page_size: Number(value)}).then(() => setLoading(false));
              }}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 30, 40, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-normal text-muted-foreground">
              Página
            </Label>
            <Input
              className="      w-15 text-center"
              value={inputValue}
              type="number"
              disabled={loading}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                //const inputValue = event.target.value;
                const value = event.target.value;
                if (Number(value) > total_pages) return;

                setInputValue(value);
                // Reiniciar el temporizador
                if (timer) {
                  clearTimeout(timer);
                }

                // Configura un nuevo temporizador para ejecutar el cambio
                const newTimer = setTimeout(() => {
                  setLoading(true);
                  const numericValue = value ? Number(value) : 1; // Asegúrate de convertir a número
                  changePage({page: numericValue, page_size}).then(() => setLoading(false));
                }, 1000);

                setTimer(newTimer);
              }}
            />
          </div>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                setLoading(true);
                changePage({page: 1, page_size}).then(() => setLoading(false));
              }}
              disabled={page === 1 || loading}
            >
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => {
                setLoading(true);
                changePage({page: page - 1, page_size}).then(() => setLoading(false));
              }}
              disabled={page === 1 || loading}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => {
                setLoading(true);
                changePage({page: page + 1, page_size}).then(() => setLoading(false));
              }}
              disabled={page === total_pages || loading}
            >
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              //onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              onClick={() => {
                setLoading(true);
                changePage({page: total_pages, page_size}).then(() => setLoading(false));
              }}
              disabled={page === total_pages || loading}
            >
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

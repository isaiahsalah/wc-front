import React, { useEffect, useState } from "react";
import {
  Column,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
  VisibilityState,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ColumnFiltersState } from "@tanstack/react-table";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MinusIcon,
  Plus,
  PlusIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { createColumnsFromData } from "@/utils/table.func";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type DataTableProps<T> = {
  data?: T[] | null;
  updateData?: (
    rowIndex: number,
    columnId: string,
    value: unknown
  ) => void | null;
};

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkipRef.current, skip] as const;
}

export function EditableDataTable2<T extends RowData>({
  data,
}: DataTableProps<T>) {
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const [newData, setDataNew] = useState(data); // Estado local de los datos

  const columns = createColumnsFromData(data);

  const addRow = () => {
    const newRow = Object.fromEntries(
      Object.keys(data[0] || {}).map((key) => [key, ""])
    );
    setDataNew((prevData) => [newRow, ...prevData]);
  };

  const updateData = (rowIndex: number, columnId: string, value: unknown) => {
    setDataNew((prevData) =>
      prevData.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const table = useReactTable({
    data: newData,
    columns,
    defaultColumn: {
      cell: ({ getValue, row: { index }, column: { id }, table }) => {
        const initialValue = getValue();
        const [value, setValue] = useState(initialValue);

        const onBlur = () => {
          if (updateData) updateData(index, id, value);
        };

        useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);

        return (
          <Input
            className="h-8 bg-yellow-50"
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
          />
        );
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    meta: {
      updateData: updateData || (() => {}),
    },
    initialState: {
      pagination: {
        pageSize: 5, // Mostrar 5 filas inicialmente
      },
    },
  });

  const pageSizeOptions = [5, 10, 20, 50, 100]; // Opciones de selección para el tamaño de página
  const { pageIndex, pageSize } = table.getState().pagination; // Estado actual de la paginación
  const totalRows = table.getFilteredRowModel().rows.length; // Total de filas filtradas
  const startRow = pageIndex * pageSize + 1; // Inicio del rango
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows); // Fin del rango

  return (
    <div className="rounded-md border w-full ">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {/*table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))*/}

          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length * 2}>
              <div className="flex items-center justify-end gap-4">
                <div className="flex items-center space-x-2 mr-auto">
                  <span className="text-sm">Mostrar:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        {table.getState().pagination.pageSize} <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {pageSizeOptions.map((size) => (
                        <DropdownMenuItem
                          key={size}
                          onClick={() => table.setPageSize(size)}
                        >
                          {size}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-x-2 flex  items-center">
                  <div className="text-sm">
                    {startRow}-{endRow} de {totalRows}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRight />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={addRow}
                >
                  Añadir
                  <Plus />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

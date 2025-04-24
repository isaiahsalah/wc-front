import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVerticalIcon,
  CheckCircle2Icon,
  CircleX,
  PlusIcon,
} from "lucide-react";
import { GeneralSchema } from "@/utils/interfaces";
import { z } from "zod"; 
import { deleteColor, recoverColor } from "@/api/color.api"; 
import DataTableDinamic from "@/components/table/DataTableDinamic";
import { useRef, useState } from "react";
import EditColorDialog from "@/components/dialog/color/EditColorDialog";
import CreateColorDialog from "@/components/dialog/color/CreateColorDialog";
 
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
            <EditColorDialog
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
      accessorKey: "createdAt",
      header: "Creado",

      cell: ({ row }) => {
        const createdAt = row.original.updatedAt
          ? new Date(row.original.updatedAt)
          : new Date();
        return (
          <Badge
            variant="outline"
            className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
          >
            {createdAt.toLocaleString()}
          </Badge>
        );
      },
      meta: {
        filterVariant: "date-range", // Indica que el filtro será de rango de fechas
      },
      filterFn: (row, columnId, filterValue) => {
        const createdAt = row.getValue<Date>(columnId);
        const { startDate, endDate } = filterValue || {};
        if (startDate && createdAt < new Date(startDate)) {
          return false;
        }
        if (endDate && createdAt > new Date(endDate)) {
          return false;
        }
        return true;
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Editado",
      cell: ({ row }) => {
        const updatedAt = row.original.updatedAt
          ? new Date(row.original.updatedAt)
          : new Date();
        return (
          <Badge
            variant="outline"
            className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
          >
            {updatedAt.toLocaleString()}
          </Badge>
        );
      },
      meta: {
        filterVariant: "date-range", // Indica que el filtro será de rango de fechas
      },
      filterFn: (row, columnId, filterValue) => {
        const updatedAt = new Date(row.getValue<Date>(columnId));
        if (!filterValue?.from && !filterValue?.to) {
          return true; // Si no hay filtro, incluye todas las filas
        }
        const from = filterValue.from ? new Date(filterValue.from) : null;
        const to = filterValue.to
          ? new Date(filterValue.to.setHours(23, 59, 59, 999))
          : null;

        if (from && updatedAt < from) {
          return false;
        }
        if (to && updatedAt > to) {
          return false;
        }
        return true;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {

        
        return (
          <DropdownMenu key={row.original.id} >
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
            <DropdownMenuContent
              align="end"
              className="w-32"
            > <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault(); // Evita el cierre automático 
            }}
          >
              <EditColorDialog
                updateView={updateView}
                id={row.original.id} 
                children={
                 
                    <div>Editar</div>
                }
              />                  </DropdownMenuItem>

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

  return (
    <DataTableDinamic
      columns={columns}
      data={data}
      actions={
        <CreateColorDialog
          updateView={updateView}
          children={
            <Button
              variant="outline"
              size="sm"
              onSelect={(event) => {
                event.preventDefault(); // Evita el cierre automático
              }}
            >
              <PlusIcon />
              <span className="ml-2 hidden lg:inline">Agregar</span>
            </Button>
          }
        />
      }
    />
  );
};

export default ColorTable;

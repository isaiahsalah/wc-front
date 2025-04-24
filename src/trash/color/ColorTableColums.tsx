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
} from "lucide-react";
import { GeneralSchema } from "@/utils/interfaces";
import { z } from "zod"; 
import { deleteColor, recoverColor } from "@/api/color.api"; 
import EditColorDialog from "@/components/dialog/color/EditColorDialog";

export const ColorTableColumns = (
  updateView: () => void
): ColumnDef<z.infer<typeof GeneralSchema>>[] => {
  return [
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
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu key={row.original.id} 
          >
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
              <EditColorDialog
                updateView={updateView}
                children={<DropdownMenuItem 
                  onSelect={(event) => {
                    event.preventDefault(); // Evita el cierre automático 
                  }}
                >Editar</DropdownMenuItem>}
                id={row.original.id}
              />

              <DropdownMenuSeparator />
              {row.original.deletedAt ? (
                <DropdownMenuItem onClick={() => recoverColor(row.original.id).then(()=>updateView())}>Recuperar</DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => deleteColor(row.original.id).then(()=>updateView())}>
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
};

import DataTableDinamic from "@/components/table/DataTableDinamic";
import { GeneralSchema } from "@/utils/interfaces";
import React, { useState } from "react";
import { z } from "zod";

import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
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
import ColorViewer from "./ColorSheet";
import { Input } from "@/components/ui/input";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView:()=>void;
  //children: React.ReactNode; // Define el tipo de children
}

const ColorTable: React.FC<Props> = ({ data,updateView }) => {


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
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "decription",
      
       cell: info => info.getValue(),
    },
    {
      accessorKey: "deleteAt",
      header: "Eliminado",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {row.original.deletedAt ? (
            <>
              <CircleX className="text-red-500 dark:text-red-400" />
              Eliminado
            </>
          ) : (
            <>
              <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
              Vigente
            </>
          )}
        </Badge>
      ),
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
              <ColorViewer
                updateView={updateView}
                children={
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault(); // Evita que el DropdownMenu se cierre
                    }}
                  >
                    Editar
                  </DropdownMenuItem>
                }
                id={row.original.id}
              />

              <DropdownMenuSeparator />
              {row.original.deletedAt ? (
                <DropdownMenuItem>Recuperar</DropdownMenuItem>
              ) : (
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
    },
  ];

  return <DataTableDinamic data={data} columns={columns} />;
};

export default ColorTable;

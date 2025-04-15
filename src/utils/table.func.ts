import {   ColumnDef, RowData } from "@tanstack/react-table";

type Data<T extends RowData> = T[] | undefined | never[];

export const createColumnsFromData = (data: Data[]): ColumnDef<Data>[] => {
    if (!data || data.length === 0) return [];
  
    // Generar columnas dinámicamente basadas en las claves del primer objeto
    return Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalizar la cabecera
    }));
  };
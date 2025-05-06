import {useState} from "react";
import {Input} from "../ui/input"; // Componente de Input
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select"; // Componente de Select
import {Table} from "@tanstack/react-table"; // Asegúrate de importar el tipo Table

interface DynamicColumnFilterProps<TData> {
  table: Table<TData>; // La instancia de la tabla
  placeholder?: string; // Texto opcional para el placeholder
}

function DynamicColumnFilter<TData>({table, placeholder}: DynamicColumnFilterProps<TData>) {
  const columns = table.getAllColumns().filter((column) => column.getCanFilter());
  const [selectedColumnId, setSelectedColumnId] = useState<string>(columns[0].id);

  const selectedColumn = selectedColumnId ? table.getColumn(selectedColumnId) : undefined;

  return (
    <div className="flex gap-1   w-full">
      {/* Select para elegir columna */}
      <Select onValueChange={(value) => setSelectedColumnId(value)} value={selectedColumnId}>
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {columns.map((column) => (
            <SelectItem key={column.id} value={column.id}>
              {typeof column.columnDef.header === "function"
                ? ""
                : column.columnDef.header || column.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Input dinámico basado en la columna seleccionada */}
      {selectedColumn && (
        <Input
          placeholder={placeholder || `Filter ${selectedColumn.id}...`}
          value={(selectedColumn.getFilterValue() as string) ?? ""}
          onChange={(event) => selectedColumn.setFilterValue(event.target.value)}
          className="w-full h-8"
        />
      )}
    </div>
  );
}

export default DynamicColumnFilter;

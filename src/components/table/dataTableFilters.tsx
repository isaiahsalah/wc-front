import { Column } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search } from "lucide-react";
import DateRangePicker from "../DataRangePicker";

interface FilterProps { 
  column: Column<any, unknown>;
  options?: { value: string; label: string }[]; // Nueva prop para opciones dinámicas
  placeholder: string;
}

export function Filter({ column, options, placeholder }: FilterProps) {
  const columnFilterValue = column.getFilterValue();
  /*@ts-expect-error: Ignoramos el error en esta línea */

  const filterVariant = column.columnDef.meta?.filterVariant;

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        {/* Input para valores mínimos */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder="Mínimo"
          className="w-24 border shadow rounded"
        />
        {/* Input para valores máximos */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder="Máximo"
          className="w-24 border shadow rounded"
        />
      </div>
    </div>
  ) : filterVariant === "date-range" ? (
    <div className="flex space-x-2">
      <DateRangePicker
        /*@ts-expect-error: Ignoramos el error en esta línea */
        dateRange={columnFilterValue || undefined}
        setRange={(newRange) => column.setFilterValue(newRange)}
        placeholder={placeholder}
      />
    </div>
  ) : filterVariant === "select" ? (
    <Select
      onValueChange={(value) => column.setFilterValue(value)}
      value={columnFilterValue?.toString() ?? ""}
    >
      <SelectTrigger size="sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Todos">Todos</SelectItem>
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <DebouncedInput
      type="text"
      value={(columnFilterValue as string) ?? ""}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`${placeholder}...`}
    />
  );
}

interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 250,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    // Evita ejecutar onChange si el valor no ha cambiado
    const timeout = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value);
      }
    }, debounce);

    // Limpia el timeout al desmontar o cambiar dependencias
    return () => clearTimeout(timeout);
  }, [value, debounce, onChange, initialValue]);

  return (
    <div className="flex gap-2 relative w-full">
      <Input
        {...props}
        className="h-8 text-sm px-2 py-1 pr-8 min-w-15"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Search className="h-3.5 my-auto absolute right-1 top-2.5 text-muted-foreground" />
    </div>
  );
}

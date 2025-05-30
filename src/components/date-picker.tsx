"use client";

import * as React from "react";
import {format} from "date-fns";
import {Calendar as CalendarIcon} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {es} from "date-fns/locale";

interface Props {
  value?: Date | undefined; // Valor actual
  onChange?: (date: Date | undefined) => void; // Función de cambio
  placeholder?: string; // Texto cuando no hay fecha seleccionada
  className?: string; // Clases adicionales para el botón
}

export const DatePicker: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}) => {
  //const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd / LLL / y ", {locale: es}) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar locale={es} mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

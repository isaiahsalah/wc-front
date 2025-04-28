"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { es } from "date-fns/locale";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
  value: Date | undefined; // Valor actual
  onChange: (date: Date | undefined) => void; // Función de cambio
  placeholder?: string; // Texto cuando no hay fecha seleccionada
  className?: string; // Clases adicionales para el botón
}

export const DateTimePicker: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}) => {
  
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
    if (newValue) {
      // Aseguramos que el valor sea un número válido
      const parsedValue = parseInt(newValue);
      if (isNaN(parsedValue)) {
        console.error("Valor no válido:", newValue);
        return;
      }

      // Si 'value' es un Date válido
      if (value) {
        // Creamos una copia del valor actual (evitamos mutarlo directamente)
        const newDate = new Date(value);

        if (type === "hour") {
          newDate.setHours(parsedValue); // Actualizamos la hora
        } else if (type === "minute") {
          newDate.setMinutes(parsedValue); // Actualizamos los minutos
        }

        // Verificamos que onChange esté definido antes de invocar
        if (onChange) {
          onChange(newDate); // Pasamos el objeto de fecha actualizado
        }
      }
    }
  };
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
          {value ? (
            format(value, "dd/ LLL/ y - HH:mm", { locale: es })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            locale={es}
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      value && value.getHours() === hour ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      value && value.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

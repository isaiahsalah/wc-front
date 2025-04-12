import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

interface Props {
  dateRange: DateRange | undefined;
  setRange: (dateRange: DateRange | undefined) => void;
}

const RangeDatePicker: React.FC<Props> = ({ dateRange, setRange }) => {
  //const { dateRange, setRange } = useContext(DateRangeContext);

  /*const [date, setDate] = useState<DateRange | undefined>({
    from:dateRange.from, // Fecha de hoy
    to: dateRange.to, // Fecha 1 días después de hoy
  });*/

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-auto justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd, LLL-y", { locale: es })} /{" "}
                  {format(dateRange.to, "dd, LLL-y", { locale: es })}
                </>
              ) : (
                format(dateRange.from, "dd, LLL-y", { locale: es })
              )
            ) : (
              <span>Seleciona el rango de fechas</span>
            )}
          </Button>
         
        </PopoverTrigger>
        
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={es}
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(newDate) => {
              setRange(newDate);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default RangeDatePicker;

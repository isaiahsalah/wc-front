 
import { ChevronDownIcon, ColumnsIcon, PlusIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";

interface Props {
  initialData: z.infer<typeof GeneralSchema>[]; 
}


const ColorActions  : React.FC<Props> = ({ initialData }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <ColumnsIcon />
            <span className="hidden lg:inline">Personalizar Columnas</span>
            <span className="lg:hidden">Columnas</span>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem> 
                    );
                  })}
              </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline">
        <PlusIcon />
        <span className="hidden lg:inline">Agregar Color</span>
      </Button>
    </div>
  );
};

export default ColorActions;
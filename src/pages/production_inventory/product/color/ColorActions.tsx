 
import { ChevronDownIcon, ColumnsIcon, PlusIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ColorActions = () => {
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
        {/* Aquí puedes agregar contenido del menú desplegable si es necesario */}
      </DropdownMenu>
      <Button variant="outline">
        <PlusIcon />
        <span className="hidden lg:inline">Agregar Color</span>
        <span className="lg:hidden">Agregar</span>
      </Button>
    </div>
  );
};

export default ColorActions;
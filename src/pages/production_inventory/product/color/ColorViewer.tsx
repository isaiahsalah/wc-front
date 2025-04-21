import * as React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TrendingUpIcon } from "lucide-react";

const chartData = [
  { month: "January", colors: 186 },
  { month: "February", colors: 305 },
  { month: "March", colors: 237 },
  { month: "April", colors: 73 },
  { month: "May", colors: 209 },
  { month: "June", colors: 214 },
];

export function ColorViewer({ color }: { color: { name: string; status: string; popularity: string } }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {color.name}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{color.name}</SheetTitle>
          <SheetDescription>
            Información detallada sobre el color seleccionado.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          <div className="grid gap-2">
            <div className="flex gap-2 font-medium leading-none">
              Popularidad: {color.popularity}{" "}
              <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Mostrando datos relacionados con el color {color.name}.
            </div>
          </div>
          <Separator />
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Nombre del Color</Label>
              <Input id="name" defaultValue={color.name} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="status">Estado</Label>
              <Select defaultValue={color.status}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full">Guardar</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Cerrar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
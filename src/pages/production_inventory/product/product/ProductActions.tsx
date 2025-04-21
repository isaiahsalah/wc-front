import React, { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDownIcon, ColumnsIcon, PlusIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TitleContext } from "@/providers/title-provider";
import ProductHeader from "./production_inventory/product/product-header";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";


interface Props {
  children: React.ReactNode; // Define el tipo de children
  className?: string; // Clase personalizada opcional
}
//: React.FC<Props> = ({ children, className })=>  

const ProductActions = () => {
  return (
    <div className="  flex items-center justify-end gap-2  ">
        <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" >
                  <ColumnsIcon />
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="lg:hidden">Columns</span>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              {/*<DropdownMenuContent align="end" className="w-56">
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
              </DropdownMenuContent>*/}
            </DropdownMenu>
            <Button variant="outline" >
              <PlusIcon />
              <span className="hidden lg:inline">Add Section</span>
            </Button>
    </div>
  )
}

export default ProductActions
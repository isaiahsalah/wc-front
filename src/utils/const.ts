import InventoryPage from "@/pages/PI/inventory/InventoryPage";
import MachinePage from "@/pages/PI/params/MachinePage";
import ModelPage from "@/pages/PI/params/ModelPage";
import ColorPage from "@/pages/PI/product/ColorPage";
import FormulaPage from "@/pages/PI/product/FormulaPage";
import ProductPage from "@/pages/PI/product/ProductPage";
import UnityPage from "@/pages/PI/product/UnitPage";
import OrderPage from "@/pages/PI/production/OrderPage";
import ProductionPage from "@/pages/PI/production/ProductionPage";
import GroupPage from "@/pages/PI/security/GroupPage";
import UserPage from "@/pages/PI/security/UserPage";
import {Blend, LucideProps, Package, PackagePlus, PackageSearch, UserLockIcon} from "lucide-react";
import {RefAttributes} from "react";
import SectorProcessPage from "@/pages/PI/params/SectorProcessPage";

export interface IPageItem {
  id: number;
  name: string;
  label: string;
  isActive?: boolean;
  link: string;
  page: React.FC<{degree: number; type_screen: number}>; // Componente de la página con props opcionales
}

export interface IMenuItem {
  name: string;
  url: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  isActive?: boolean;
  pages: IPageItem[];
}

export interface IModuleItem {
  id: number;
  name: string;
  isActive?: boolean;
  menu: IMenuItem[];
}

export interface ISizeItem {
  id: number;
  name: string;
}

export interface IPermissionItem {
  id: number;
  name: string;
}

const typeMenuPI: IMenuItem[] = [
  {
    name: "Productos",
    url: "product",
    icon: Package,
    pages: [
      {
        id: 1,
        name: "Producto",
        label: "Productos",
        link: "product",
        page: ProductPage,
      },
      {
        id: 2,
        name: "Unidad de Medida",
        label: "Unidad",
        link: "unit",
        page: UnityPage,
      },
      {
        id: 3,
        name: "Colores",
        label: "Color",
        link: "color",
        page: ColorPage,
      },
      {
        id: 4,
        name: "Fórmula",
        label: "Fórmula",
        link: "formula",
        page: FormulaPage,
      },
    ],
  },
  {
    name: "Producción",
    url: "production",
    icon: PackagePlus,
    pages: [
      {
        id: 11,
        name: "Producción",
        label: "Producción",
        link: "production",
        page: ProductionPage,
      },
      {
        id: 12,
        name: "Orden de Producción",
        label: "Orden",
        link: "production-order",
        page: OrderPage,
      },
    ],
  },

  {
    name: "Inventario",
    url: "inventory",
    icon: PackageSearch,
    pages: [
      {
        id: 21,
        name: "Inventario",
        label: "Inventario",
        link: "inventory",
        page: InventoryPage,
      },
    ],
  },
  {
    name: "Parametros",
    url: "params",
    icon: Blend,
    pages: [
      {
        id: 31,
        name: "Modelo",
        label: "Modelo",
        link: "model",
        page: ModelPage,
      },
      {
        id: 32,
        name: "Maquina",
        label: "Máquina",
        link: "machine",
        page: MachinePage,
      },
      {
        id: 33,
        name: "Procesos del sector",
        label: "Procesos del sector",
        link: "process",
        page: SectorProcessPage,
      },
    ],
  },
  {
    name: "Seguridad",
    url: "security",
    icon: UserLockIcon,
    pages: [
      {
        id: 41,
        name: "Usuario",
        label: "Usuarios",
        link: "user",
        page: UserPage,
      },
      {
        id: 42,
        name: "Grupo",
        label: "Grupos",
        link: "group",
        page: GroupPage,
      },
    ],
  },
];
const typeMenuRA: IMenuItem[] = [{name: "Home", url: "home", icon: Package, pages: []}];
const typeMenuSL: IMenuItem[] = [{name: "Home", url: "home", icon: Package, pages: []}];
const typeMenuCQ: IMenuItem[] = [{name: "Home", url: "home", icon: Package, pages: []}];
const typeMenuAU: IMenuItem[] = [{name: "Home", url: "home", icon: Package, pages: []}];

export const typeModule: IModuleItem[] = [
  {
    name: "Producción e Inventarios",
    id: 1,
    isActive: true,
    menu: typeMenuPI,
  },
  {
    name: "Ventas y Logística",
    id: 2,
    isActive: false,
    menu: typeMenuSL,
  },
  {
    name: "Costos y Calidad",
    id: 3,
    isActive: false,
    menu: typeMenuCQ,
  },
  {
    name: "Administración y Usuarios",
    id: 4,
    isActive: false,
    menu: typeMenuAU,
  },
  {
    name: "Reportes y Análisis",
    id: 5,
    isActive: false,
    menu: typeMenuRA,
  },
];

export const typeTurn = [
  {id: 1, name: "Dia"},
  {id: 2, name: "Noche"},
  {id: 3, name: "Mixto"},
];

export const typeQuality = [
  {id: 1, name: "Buena"},
  {id: 2, name: "Mala"},
  {id: 3, name: "Desecho"},
];

export const typeProduct = [
  {id: 1, name: "Materia Prima"},
  {id: 2, name: "Producto en Proceso"},
  {id: 3, name: "Producto Terminado"},
];

export const typeTicket = [
  {
    id: 1,
    name: "QR 1",
    example: ["Id", "Nombre de Producto", "Fecha de Producción", "Unidad de medida", "Micronage"],
    colums: ["id", "name", "date", "amount", "micronage"],
  },
  {
    id: 2,
    name: "QR 2",
    example: ["Nombre de Producto", "Fecha de Producción"],
    colums: ["name", "date"],
  },
  {
    id: 3,
    name: "QR 3",
    example: ["Nombre de Producto"],
    colums: ["name"],
  },
  {
    id: 4,
    name: "QR 4",
    example: ["Nombre de Producto", "Fecha de Producción", "Tamaño"],
    colums: ["name", "date", "type_size"],
  },
];

export const typePermission: IPermissionItem[] = [
  {id: 0, name: "Sin Acceso"},
  {id: 1, name: "Leer"},
  {id: 2, name: "Crear"},
  {id: 3, name: "Actualizar"},
  {id: 4, name: "Eliminar"},
];

export const typeSize: ISizeItem[] = [
  {id: 1, name: "Pequeño"},
  {id: 2, name: "Mediano"},
  {id: 3, name: "Grande"},
  {id: 4, name: "Extra Grande"},
];

import {Blend, LucideProps, Package, PackagePlus, PackageSearch, UserLockIcon} from "lucide-react";
import {RefAttributes} from "react";

export interface IMenuItem {
  id: number;
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  isActive: boolean;
}

const typeMenuPI: IMenuItem[] = [
  {
    id: 1,
    title: "Productos",
    url: "product",
    icon: Package,
    isActive: false,
  },
  {
    id: 2,
    title: "Producción",
    url: "production",
    icon: PackagePlus,
    isActive: false,
  },

  {
    id: 3,
    title: "Inventario",
    url: "inventory",
    icon: PackageSearch,
    isActive: false,
  },
  {
    id: 4,
    title: "Parametros",
    url: "params",
    icon: Blend,
    isActive: false,
  },
  {
    id: 5,
    title: "Seguridad",
    url: "security",
    icon: UserLockIcon,
    isActive: false,
  },
];
const typeMenuRA: IMenuItem[] = [
  {id: 1, title: "Home", url: "home", icon: Package, isActive: true},
];
const typeMenuSL: IMenuItem[] = [
  {id: 1, title: "Home", url: "home", icon: Package, isActive: true},
];
const typeMenuCQ: IMenuItem[] = [
  {id: 1, title: "Home", url: "home", icon: Package, isActive: true},
];
const typeMenuAU: IMenuItem[] = [
  {id: 1, title: "Home", url: "home", icon: Package, isActive: true},
];

export const typeModule = [
  {
    title: "Producción e Inventarios",
    value: 1,
    isActive: true,
    menu: typeMenuPI,
  },
  {
    title: "Ventas y Logística",
    value: 2,
    isActive: true,
    menu: typeMenuSL,
  },
  {
    title: "Costos y Calidad",
    value: 3,
    isActive: true,
    menu: typeMenuCQ,
  },
  {
    title: "Administración y Usuarios",
    value: 4,
    isActive: true,
    menu: typeMenuAU,
  },
  {
    title: "Reportes y Análisis",
    value: 5,
    isActive: true,
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
    example: ["Nombre de Producto", "Fecha de Producción", "Unidad de medida", "Micronage"],
    colums: ["name", "date", "amount", "micronage"],
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
];

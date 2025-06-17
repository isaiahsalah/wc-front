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

const typeMenuPR: IMenuItem[] = [
  {
    name: "Productos",
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
        name: "Unidades de Medida",
        label: "Unidades de Medida",
        link: "unit",
        page: UnityPage,
      },
      {
        id: 3,
        name: "Colores",
        label: "Colores",
        link: "color",
        page: ColorPage,
      },
      {
        id: 4,
        name: "Fórmulas",
        label: "Fórmulas",
        link: "formula",
        page: FormulaPage,
      },
    ],
  },
  {
    name: "Producción",
    icon: PackagePlus,
    pages: [
      {
        id: 11,
        name: "Producción Actual",
        label: "Producción Actual",
        link: "production",
        page: ProductionPage,
      },
      {
        id: 12,
        name: "Órdenes de Producción",
        label: "Órdenes de Producción",
        link: "production-order",
        page: OrderPage,
      },
      {
        id: 13,
        name: "Seguimiento de Producción",
        label: "Seguimiento de Producción",
        link: "production-tracking",
        page: OrderPage,
      },
    ],
  },

  {
    name: "Inventarios",
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
    name: "Parámetros de Config.",
    icon: Blend,
    pages: [
      {
        id: 31,
        name: "Modelos de Productos",
        label: "Modelos de Productos",
        link: "model",
        page: ModelPage,
      },
      {
        id: 32,
        name: "Máquinas y Equipos",
        label: "Máquinas y Equipos",
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
    name: "Seguridad y Usuarios",
    icon: UserLockIcon,
    pages: [
      {
        id: 41,
        name: "Gestión de Usuarios",
        label: "Gestión de Usuarios",
        link: "user",
        page: UserPage,
      },
      {
        id: 42,
        name: "Gestión de Grupos",
        label: "Gestión de Grupos",
        link: "group",
        page: GroupPage,
      },
      {
        id: 53,
        name: "Permisos de Acceso",
        label: "Permisos de Acceso",
        link: "permissions",
        page: GroupPage,
      },
    ],
  },
];
const typeMenuIA: IMenuItem[] = [{name: "Home", icon: Package, pages: []}];
const typeMenuLD: IMenuItem[] = [{name: "Home", icon: Package, pages: []}];
const typeMenuVCRM: IMenuItem[] = [{name: "Home", icon: Package, pages: []}];
const typeMenuPC: IMenuItem[] = [{name: "Home", icon: Package, pages: []}];
const typeMenuFC: IMenuItem[] = [{name: "Home", icon: Package, pages: []}];
const typeMenuRH: IMenuItem[] = [{name: "Home", icon: Package, pages: []}];
const typeMenuSA: IMenuItem[] = [
  {
    name: "Usuarios y Roles",
    icon: PackagePlus,
    pages: [
      {
        id: 1,
        name: "Usuarios",
        label: "Usuarios",
        link: "user",
        page: UnityPage,
      },
      {
        id: 2,
        name: "Roles y Permisos",
        label: "Roles y Permisos",
        link: "rol-permision",
        page: UnityPage,
      },
    ],
  },
  {
    name: "Bitácora y Seguridad",
    icon: PackagePlus,
    pages: [
      {
        id: 11,
        name: "Bitácora",
        label: "Bitácora",
        link: "binnacle",
        page: UnityPage,
      },
      {
        id: 12,
        name: "Respaldos",
        label: "Respaldos",
        link: "backup",
        page: UnityPage,
      },
    ],
  },
];
const typeMenuAR: IMenuItem[] = [{name: "Home", icon: Package, pages: []}];

export const typeModule: IModuleItem[] = [
  {
    name: "Producción y Reciclaje",
    id: 1,
    isActive: true,
    menu: typeMenuPR,
  },
  {
    name: "Inventarios y Almacenes",
    id: 2,
    isActive: true,
    menu: typeMenuIA,
  },
  {
    name: "Logística y Distribución",
    id: 3,
    isActive: false,
    menu: typeMenuLD,
  },
  {
    name: "Ventas y CRM",
    id: 4,
    isActive: false,
    menu: typeMenuVCRM,
  },
  {
    name: "Proveedores y Compras",
    id: 5,
    isActive: false,
    menu: typeMenuPC,
  },
  {
    name: "Finanzas y Contabilidad",
    id: 6,
    isActive: false,
    menu: typeMenuFC,
  },
  {
    name: "Recursos Humanos",
    id: 7,
    isActive: false,
    menu: typeMenuRH,
  },
  {
    name: "Seguridad y Administración",
    id: 8,
    isActive: true,
    menu: typeMenuSA,
  },
  {
    name: "Análisis y Reportes",
    id: 9,
    isActive: false,
    menu: typeMenuAR,
  },
];

export const typeTurn = [
  {id: 1, name: "Día"},
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
    name: "QR 2",
    example: ["Id", "Nombre de Producto", "Fecha de Producción", "Peso", "Micronage"],
    colums: ["id", "name", "date", "weight", "micronage"],
  },
  {
    id: 2,
    name: "QR 3",
    example: ["Id", "Nombre de Producto", "Fecha de Producción", "Peso"],
    colums: ["id", "name", "date", "weight"],
  },
  {
    id: 3,
    name: "QR 4",
    example: ["Nombre de Producto", "Fecha de Producción"],
    colums: ["name", "date"],
  },
  {
    id: 4,
    name: "QR 5",
    example: ["Nombre de Producto"],
    colums: ["name"],
  },
  {
    id: 5,
    name: "QR 6",
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
  {id: 1, name: "S"},
  {id: 2, name: "M"},
  {id: 3, name: "L"},
  {id: 4, name: "XL"},
];

import {Blend, LucideProps, Package, PackagePlus, PackageSearch, UserLockIcon} from "lucide-react";
import {RefAttributes} from "react";

interface IMenuItem {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  isActive: boolean;
}

export interface IMenu {
  title: string;
  items: IMenuItem[];
}

const typeMenuPI: IMenu = {
  title: "Producción e Inventarios",
  items: [
    {
      title: "Productos",
      url: "product",
      icon: Package,
      isActive: true,
    },
    {
      title: "Producción",
      url: "production",
      icon: PackagePlus,
      isActive: true,
    },

    {
      title: "Inventario",
      url: "inventory",
      icon: PackageSearch,
      isActive: false,
    },
    {
      title: "Parametros",
      url: "params",
      icon: Blend,
      isActive: true,
    },
    {
      title: "Seguridad",
      url: "security",
      icon: UserLockIcon,
      isActive: false,
    },
  ],
};
const typeMenuRA: IMenu = {
  title: "Producción e Inventarios",
  items: [
    {
      title: "Home",
      url: "home",
      icon: Package,
      isActive: true,
    },
  ],
};
const typeMenuSL: IMenu = {
  title: "Producción e Inventarios",
  items: [
    {
      title: "Home",
      url: "home",
      icon: Package,
      isActive: true,
    },
  ],
};
const typeMenuCQ: IMenu = {
  title: "Producción e Inventarios",
  items: [
    {
      title: "Home",
      url: "home",
      icon: Package,
      isActive: true,
    },
  ],
};
const typeMenuAU: IMenu = {
  title: "Producción e Inventarios",
  items: [
    {
      title: "Home",
      url: "home",
      icon: Package,
      isActive: true,
    },
  ],
};

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

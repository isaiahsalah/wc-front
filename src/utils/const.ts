import {Blend, Package, PackagePlus, PackageSearch, UserLockIcon} from "lucide-react";

export const typeModel = [
  {id: 1, name: "Terminado"},
  {id: 2, name: "En proceso"},
  {id: 3, name: "Materia Prima"},
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

export const menuAdmin = {
  title: "Producción e Inventarios",
  url: "#",
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

export const typeModule = [
  {
    title: "Producción e Inventarios",
    value: 1,
    isActive: true,
  },
  {
    title: "Ventas y Logística",
    value: 2,
    isActive: true,
  },
  {
    title: "Costos y Calidad",
    value: 3,
    isActive: true,
  },
  {
    title: "Administración y Usuarios",
    value: 4,
    isActive: true,
  },
  {
    title: "Reportes y Análisis",
    value: 5,
    isActive: true,
  },
];

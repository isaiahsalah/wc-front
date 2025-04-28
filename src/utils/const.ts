import {
  Blend,
  Heater,
  Package,
  PackagePlus,
  PackageSearch, 
  Soup, 
  UserLockIcon,
} from "lucide-react";

export const typeModel = [
  { id: 1, name: "Terminado" },
  { id: 2, name: "En proceso" },
  { id: 3, name: "Materia Prima" },
];

export const typeQuality = [
  { id: 1, name: "Buena" },
  { id: 2, name: "Mala" },
  { id: 3, name: "Desecho" },
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

export const menuOper = {
  title: "Operario",
  url: "#",
  items: [
    {
      title: "Expandido",
      url: "expandido",
      icon: Soup,
      isActive: true,
      items: [
        {
          title: "Mezcla",
          url: "bolsa/mezcla",
          icon: Heater,
          isActive: true,
          items: [
            {
              title: "Mezcla 1",
              url: "bolsa/mezcla",
              icon: Heater,
              isActive: true,
            },
            {
              title: "Mezcla 2",
              url: "bolsa/extrusion",
              icon: Heater,
              isActive: true,
            },
            {
              title: "Mezcla 3",
              url: "bolsa/termoformado",
              icon: Heater,
              isActive: true,
            },
          ],
        },
        {
          title: "Extrusión",
          url: "bolsa/extrusion",
          icon: Heater,
          isActive: true,
          items: [
            {
              title: "Mezcla 1",
              url: "bolsa/mezcla",
              icon: Heater,
              isActive: true,
            },
            {
              title: "Mezcla 2",
              url: "bolsa/extrusion",
              icon: Heater,
              isActive: true,
            },
            {
              title: "Mezcla 3",
              url: "bolsa/termoformado",
              icon: Heater,
              isActive: true,
            },
          ],
        },
        {
          title: "Termofomado",
          url: "bolsa/termoformado",
          icon: Heater,
          isActive: true,
          items: [
            {
              title: "Mezcla 1",
              url: "bolsa/mezcla",
              icon: Heater,
              isActive: true,
            },
            {
              title: "Mezcla 2",
              url: "bolsa/extrusion",
              icon: Heater,
              isActive: true,
            },
            {
              title: "Mezcla 3",
              url: "bolsa/termoformado",
              icon: Heater,
              isActive: true,
            },
          ],
        },
      ],
    },
  ],
};

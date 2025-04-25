import { Bandage, Heater, Soup } from "lucide-react";

export const menuAdmin = {
  title: "Producción e Inventarios",
  url: "#",
  items: [
    {
      title: "Productos",
      url: "product",
      icon: Heater,
      isActive: true,
    },
    {
      title: "Producción",	
      url: "production",
      icon: Bandage,
      isActive: true,
    },
    {
      title: "Procesos",
      url: "process",
      icon: Heater,
      isActive: true,
    },

    {
      title: "Inventario",
      url: "inventory",
      icon: Soup,
      isActive: true,
    },
    {
      title: "Parametros",
      url: "params",
      icon: Soup,
      isActive: true,
    },
    {
      title: "Seguridad",
      url: "security",
      icon: Soup,
      isActive: true,
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

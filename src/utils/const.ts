import { Bandage, Heater, Soup } from "lucide-react";

export const menuAdmin = {
  title: "Administración",
  url: "#",
  items: [
    {
      title: "Productos",
      url: "bolsa",
      icon: Heater,
      isActive: true,
      items: [
        {
          title: "Mezcla",
          url: "bolsa/mezcla",
          icon: Heater,
          isActive: true,
        },
        {
          title: "Extrusión",
          url: "bolsa/extrusion",
          icon: Heater,
          isActive: true,
        },
        {
          title: "Impresión",
          url: "bolsa/impresion",
          icon: Heater,
          isActive: true,
        },
        {
          title: "Corte",
          url: "bolsa/corte",
          icon: Heater,
          isActive: true,
        },
      ],
    },
    {
      title: "Producción",	
      url: "inyecion",
      icon: Bandage,
      isActive: true,
      items: [
        {
          title: "Termoformado",
          url: "termoformado",
          icon: Heater,
          isActive: true,
        },
        {
          title: "Inyeción",
          url: "inyecion",
          icon: Bandage,
          isActive: true,
        },
      ],
    },
    {
      title: "Procesos",
      url: "termo",
      icon: Heater,
      isActive: true,
      items: [
        {
          title: "Cortadora 1 ",
          url: "termo/termoformado",
          icon: Heater,
          isActive: true,
        },
        {
          title: "Cortadora 2",
          url: "termo/inyecion",
          icon: Bandage,
          isActive: true,
        },
        {
          title: "Cortadora 2",
          url: "termo/inyecion",
          icon: Bandage,
          isActive: true,
        },
        {
          title: "Cortadora 2",
          url: "termo/inyecion",
          icon: Bandage,
          isActive: true,
        },
        {
          title: "Cortadora 2",
          url: "termo/inyecion",
          icon: Bandage,
          isActive: true,
        },
        {
          title: "Cortadora 2",
          url: "termo/inyecion",
          icon: Bandage,
          isActive: true,
        },
        {
          title: "Cortadora 2",
          url: "termo/inyecion",
          icon: Bandage,
          isActive: true,
        },
      
      ],
    },

    {
      title: "Inventario",
      url: "expandido",
      icon: Soup,
      isActive: true,
      items: [
        {
          title: "Mezcla",
          url: "bolsa/mezcla",
          icon: Heater,
          isActive: true,
        },
        {
          title: "Extrusión",
          url: "bolsa/extrusion",
          icon: Heater,
          isActive: true,
        },
        {
          title: "Termofomado",
          url: "bolsa/termoformado",
          icon: Heater,
          isActive: true,
        },
      ],
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

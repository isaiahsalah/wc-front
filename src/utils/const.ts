import { Bandage, Heater, Soup } from "lucide-react";

export const menuAdmin = {
  title: "Administración",
  url: "#",
  items: [
    
    {
      title: "Bolsa",
      url: "bolsa",
      icon: Heater,
      isActive: false,
      items: [
        {
          title: "Mezcla",
          url: "bolsa/mezcla",
          icon: Heater,
          isActive: false,
        },
        {
          title: "Extrusión",
          url: "bolsa/extrusion",
          icon: Heater,
          isActive: false,
        },
        {
          title: "Impresión",
          url: "bolsa/impresion",
          icon: Heater,
          isActive: false,
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
        title: "Inyeción",
        url: "inyecion",
        icon: Bandage,
        isActive: false,
        items: [
          {
            title: "Termoformado",
            url: "termoformado",
            icon: Heater,
            isActive: false,
          },
          {
            title: "Inyeción",
            url: "inyecion",
            icon: Bandage,
            isActive: false,
          },
        ],
      },
    {
      title: "Termoformado",
      url: "termo",
      icon: Heater,
      isActive: false,
      items: [
        {
          title: "Termoformado",
          url: "termo/termoformado",
          icon: Heater,
          isActive: true,
        },
        {
          title: "Inyeción",
          url: "termo/inyecion",
          icon: Bandage,
          isActive: false,
        },
      ],
    },
    
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

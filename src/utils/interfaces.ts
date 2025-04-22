import { z } from "zod";

export interface SesionInterface {
    params: string;
    token: string;
  }


  
export interface UsuarioInterface {
    id?: number | null;
    name: string;
    lastname: string;
    birthday: Date;
    image: string;
    phone: string;
    user: string;
    pass: string;
    id_rol: number;
  
    //rol?: RolInterface | null;
  
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }

  export const ProductSchema = z.object({
    id: z.number(),
    header: z.string(),
    type: z.string(),
    status: z.string(),
    target: z.string(),
    limit: z.string(),
    reviewer: z.string(),
  });


  export const GeneralSchema = z.object({
    id: z.number(),
    name: z.string().min(2, {
      message: "El nombre del color debe tener al menos 2 caracteres.",
    }),
    description: z.string(),
    state: z.boolean(),
  });

  export interface GeneralInterfaces{
    id:number,
    name: string,
    description:string,
    state:boolean,
  };
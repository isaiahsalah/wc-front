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


/*
export const GeneralSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  state: z.boolean(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
});
*/

export const GeneralSchema = z.object({
  id: z
    .number()
    .int("El ID debe ser un número entero.")
    .positive("El ID debe ser un número positivo.")
    .min(1, "El ID debe ser mayor o igual a 1."),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre no puede exceder los 100 caracteres.")
    .nonempty("El nombre es obligatorio."),
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres.")
    .max(500, "La descripción no puede exceder los 500 caracteres.")
    .nonempty("La descripción es obligatoria."), 
    createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

export type GeneralInterfaces = z.infer<typeof GeneralSchema>;

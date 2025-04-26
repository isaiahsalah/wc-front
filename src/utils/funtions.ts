import { z } from "zod";
import {
  GeneralSchema,
  UnitySchema,
  ColorSchema,
  ModelSchema,
  FormulaSchema,
  ProductSchema,
} from "./interfaces";

export function countCurrentMonth(
  data: z.infer<
    | typeof UnitySchema
    | typeof ColorSchema
    | typeof ModelSchema
    | typeof FormulaSchema
    | typeof ProductSchema
  >[]
): number {
  const now = new Date();
  const currentMonth = now.getMonth(); // Mes actual (0-11)
  const currentYear = now.getFullYear(); // Año actual

  return data.reduce((count, item) => {
    const itemDate = item.createdAt ? new Date(item.createdAt) : null; // Convierte a objeto Date si está definido
    if (
      itemDate &&
      itemDate.getMonth() === currentMonth &&
      itemDate.getFullYear() === currentYear
    ) {
      count++;
    }
    return count;
  }, 0);
}

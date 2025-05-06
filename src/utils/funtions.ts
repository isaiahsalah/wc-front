import {IGeneral} from "./interfaces";

export function countCurrentMonth(data: IGeneral[]): number {
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

export const randomNumber = (from: number, to: number) => {
  return Math.floor(Math.random() * (to - from + 1)) + from;
};
